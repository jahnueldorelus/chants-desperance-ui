import { Verse } from "@app-types/entities/verses";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import TrashCan from "@assets/trash-can.svg";
import { Fragment, useState } from "react";
import { Song } from "@app-types/entities/songs";

type EditVersesProps = {
  addingASong: boolean;
  newVersePrefix: string;
  selectedSong: Song | null;
  verseWithChorusExists: boolean;
  setVerseWithChorusExists: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSongVerses: Map<string, Verse> | null;
  setSelectedSongVerses: React.Dispatch<
    React.SetStateAction<Map<string, Verse>>
  >;
  showVerseIsChorusTooltip: Map<string, boolean>;
  setShowVerseIsChorusTooltip: React.Dispatch<
    React.SetStateAction<Map<string, boolean>>
  >;
};

export const EditVerses = (props: EditVersesProps) => {
  const [newVerseCount, setNewVerseCount] = useState(1);

  /**
   * Updates a verse's number.
   * @param item The verse to modifiy
   * @param event The event of changing an input
   */
  const onVerseNumberChange =
    (item: Verse) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const tempVersesMap = new Map(props.selectedSongVerses);
      tempVersesMap.set(item._id, {
        ...item,
        // Sets the new verse number. Lowest number by default is 1
        verseNum: Math.max(parseInt(event.target.value), 1).toString(),
      });

      props.setSelectedSongVerses(tempVersesMap);
    };

  /**
   * Updates a verse's chorus status.
   * @param item The verse to modifiy
   * @param event The event of selecting an option
   */
  const onVerseChorusStatusChange =
    (item: Verse) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      event.preventDefault();

      const verseIsNowChorus =
        event.target.value === true.toString() ? true : false;

      const tempVersesMap = new Map(props.selectedSongVerses);
      tempVersesMap.set(item._id, {
        ...item,
        // Sets the new verse chorus
        isChorus: verseIsNowChorus,
      });
      props.setSelectedSongVerses(tempVersesMap);

      if (!verseIsNowChorus) {
        props.setVerseWithChorusExists(false);
      } else {
        props.setVerseWithChorusExists(true);
      }
    };

  /**
   * Adds a line to a verse.
   * @param item The verse to modifiy
   * @param event The event of clicking a button
   */
  const addLineToVerse =
    (item: Verse) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const tempVersesMap = new Map(props.selectedSongVerses);
      tempVersesMap.set(item._id, {
        ...item,
        // Sets the new verse
        verse: item.verse.trim() + "\n",
      });
      props.setSelectedSongVerses(tempVersesMap);
    };

  /**
   * Updates a verse line's text.
   * @param item The verse to modifiy
   * @param lineNumber The line number to edit
   * @param event The event of changing an input
   */
  const onVerseLineChange =
    (item: Verse) =>
    (lineNumber: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const lines = item.verse.split("\n");
      lines[lineNumber] = event.target.value;

      const tempVersesMap = new Map(props.selectedSongVerses);
      tempVersesMap.set(item._id, {
        ...item,
        // Sets the new verse
        verse: lines.join("\n"),
      });
      props.setSelectedSongVerses(tempVersesMap);
    };

  /**
   * Removes a line from a verse.
   * @param item The verse to modifiy
   * @param lineNumber The line number to remove
   * @param event The event of clicking a button
   */
  const removeLineFromVerse =
    (item: Verse) =>
    (lineNumber: number) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const lines = item.verse.split("\n");
      lines.splice(lineNumber, 1);

      const tempVersesMap = new Map(props.selectedSongVerses);
      tempVersesMap.set(item._id, {
        ...item,
        // Sets the new verse
        verse: lines.join("\n"),
      });
      props.setSelectedSongVerses(tempVersesMap);
    };

  /**
   * Determines if a tooltip for changing a verse's chorus status
   * will appear.
   * @param verse The verse to modifiy showing the chorus tooltip for
   * @param nextShow Determines the  visibility of the chorus tooltip
   */
  const onIsChorusSelectTooltipToggle =
    (verse: Verse) => (showTooltip: boolean) => {
      if (!verse.isChorus && props.verseWithChorusExists) {
        const tempShowVerseIsChorusTooltip = new Map(
          props.showVerseIsChorusTooltip
        );
        tempShowVerseIsChorusTooltip.set(verse._id, showTooltip);
        props.setShowVerseIsChorusTooltip(tempShowVerseIsChorusTooltip);
      }
    };

  /**
   * Adds a new verse to the song.
   * @param event The event of clicking a button
   */
  const addNewVerse = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (props.selectedSongVerses) {
      const newVerse: Verse = {
        _id: props.newVersePrefix + newVerseCount,
        isChorus: false,
        verse: "",
        songId: props.selectedSong ? props.selectedSong._id : "null",
        verseNum: "1",
      };
      setNewVerseCount(newVerseCount + 1);

      const tempVersesMap = new Map(props.selectedSongVerses);
      tempVersesMap.set(newVerse._id, newVerse);

      const tempShowVerseIsChorusTooltip = new Map(
        props.showVerseIsChorusTooltip
      );
      tempShowVerseIsChorusTooltip.set(newVerse._id, false);

      props.setSelectedSongVerses(tempVersesMap);
      props.setShowVerseIsChorusTooltip(tempShowVerseIsChorusTooltip);
    }
  };

  /**
   * Deletes a verse.
   * @param verse The verse to delete
   * @param event The event of clicking a button
   */
  const deleteVerse =
    (verse: Verse) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (props.selectedSongVerses) {
        const tempVersesMap = new Map(props.selectedSongVerses);
        tempVersesMap.delete(verse._id);

        if (verse.isChorus) {
          props.setVerseWithChorusExists(false);
        }

        props.setSelectedSongVerses(tempVersesMap);
      }
    };

  if (props.addingASong || (props.selectedSong && props.selectedSongVerses)) {
    const versesJSX: JSX.Element[] = [];

    if (props.selectedSongVerses) {
      props.selectedSongVerses.forEach((item) => {
        versesJSX.push(
          <div className="py-2 px-3 my-2 border border-secondary rounded" key={item._id}>
            <div className="d-flex">
              <Form.Label className="my-2 me-4 text-tertiary w-fit" as="label">
                Verse Number
                <Form.Control
                  type="number"
                  value={item.isChorus ? "1.5" : item.verseNum}
                  onChange={onVerseNumberChange(item)}
                  required
                />
              </Form.Label>

              <Form.Label className="my-2 me-4 text-tertiary w-fit " as="label">
                Is Chorus
                <OverlayTrigger
                  placement="auto"
                  onToggle={onIsChorusSelectTooltipToggle(item)}
                  overlay={
                    <Tooltip>Another verse is already the chorus</Tooltip>
                  }
                  show={props.showVerseIsChorusTooltip.get(item._id)}
                >
                  <div className="position-relative">
                    {/* Displays a hidden div that allows a tooltip to display on disabled  items */}
                    {!item.isChorus && props.verseWithChorusExists && (
                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          cursor: "not-allowed",
                          zIndex: 2,
                        }}
                      />
                    )}
                    <Form.Select
                      className="w-fit"
                      aria-label="Select whether the verse is the song's chorus"
                      value={item.isChorus.toString()}
                      onChange={onVerseChorusStatusChange(item)}
                      disabled={!item.isChorus && props.verseWithChorusExists}
                    >
                      <option value={false.toString()}>False</option>
                      <option value={true.toString()}>True</option>
                    </Form.Select>
                  </div>
                </OverlayTrigger>
              </Form.Label>
            </div>

            <div className="d-flex flex-wrap align-items-end">
              {item.verse.split("\n").map((verseLine, lineIndex) => (
                <Col xs={12} md={6} key={`verseline-${lineIndex}`}>
                  <Form.Label
                    className="my-2 pe-4 text-tertiary w-100"
                    as="label"
                  >
                    Line {lineIndex + 1}
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={verseLine}
                        onChange={onVerseLineChange(item)(lineIndex)}
                        required
                      />

                      <button
                        className="p-0 ms-2 rounded-circle"
                        onClick={removeLineFromVerse(item)(lineIndex)}
                      >
                        <img src={TrashCan} width={35} alt="a trash can" />
                      </button>
                    </div>
                  </Form.Label>
                </Col>
              ))}

              <div className="d-flex justify-content-end w-100">
                <Button className="mt-4 mb-2 me-4 bg-danger border-0" onClick={deleteVerse(item)}>
                  Delete Verse
                </Button>
                <Button
                  className="mt-4 mb-2"
                  onClick={addLineToVerse(item)}
                >
                  Add Line
                </Button>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <Fragment>
        <hr className="mx-1 my-4" />
        <h5 className="mt-4 text-tertiary">Verses</h5>
        {versesJSX}
        <div className="mt-3 d-flex justify-content-end">
          <Button className="my-3" onClick={addNewVerse}>
            Add a Verse
          </Button>
        </div>
      </Fragment>
    );
  } else {
    return <></>;
  }
};
