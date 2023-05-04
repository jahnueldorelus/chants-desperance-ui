import Placeholder from "react-bootstrap/Placeholder";
import Col from "react-bootstrap/Col";
import { Fragment } from "react";

type SongViewLoaderProps = {
  show: boolean;
};

export const SongViewLoader = (props: SongViewLoaderProps) => {
  if (props.show) {
    return (
      <Fragment>
        <Col className="mt-3" xs={4}>
          <div className="py-3 mb-3">
            <div>
              <Placeholder animation="glow">
                <Placeholder xs={12} />
                <Placeholder className="d-block" xs={4} />
                <Placeholder className="mt-3 d-block" xs={6} />
              </Placeholder>
            </div>
          </div>
        </Col>

        <Col className="mt-3" md={5}>
          <div className="px-3 py-3 border rounded">
            {[1, 2, 3].map((num) => (
              <Placeholder animation="glow" key={num}>
                <Placeholder xs={12} />
                <Placeholder className="d-block" xs={5} />
                <Placeholder className="mt-1 mb-2 d-block" xs={8} />
              </Placeholder>
            ))}
          </div>
        </Col>
      </Fragment>
    );
  } else {
    return <></>;
  }
};
