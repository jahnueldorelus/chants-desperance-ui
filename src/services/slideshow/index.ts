import { Verse } from "@app-types/entities/verses";
import { Song } from "@app-types/entities/songs";
import Reveal from "reveal.js";
import { versesService } from "@services/verses";
import { screenService } from "@services/screen";
import { RefObject } from "react";

class SlideshowService {
  slideshowRef: RefObject<HTMLDivElement> | null;
  presentButtonRef: RefObject<HTMLButtonElement> | null;
  prevScrollPosition: number;
  initialized: boolean;
  focusableElements: HTMLElement[] | null;
  inFullscreenMode: boolean;

  constructor() {
    this.slideshowRef = null;
    this.presentButtonRef = null;
    this.prevScrollPosition = 0;
    this.initialized = false;
    this.focusableElements = null;
    this.inFullscreenMode = false;
  }

  /**
   * Updates the class list of the slideshow component to reflect
   * changes of its visibility.
   */
  set isSlideshowVisible(isVisible: boolean) {
    if (this.slideshowRef && this.slideshowRef.current) {
      const slideshow = this.slideshowRef.current;

      if (isVisible) {
        slideshow.classList.remove("slideshow-initial-view");
        slideshow.classList.remove("slideshow-closed");
        slideshow.classList.add("slideshow-open");
      } else {
        slideshow.classList.remove("slideshow-open");
        slideshow.classList.add("slideshow-closed");
      }
    }
  }

  /**
   * Retrieves all the focusable child elements of a parent element.
   * @param parentElement The parent HTML element
   */
  getAllFocusableElements(parentElement: HTMLElement): NodeListOf<HTMLElement> {
    return parentElement.querySelectorAll<HTMLElement>(
      'button, a, [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
  }

  /**
   * Handler for keyboard keydown events.
   * @param event A keyboard event
   * @param focusableElements The list of elements that are focusable
   */
  keydownHandler =
    (focusableElements: HTMLElement[]) => (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      // If the "shift" & "tab" key were pressed
      if (event.shiftKey) {
        // If the focus is on the first element, the last element is focused
        if (
          document.activeElement === firstFocusableElement &&
          lastFocusableElement
        ) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
      }

      // Just the "shift" key was pressed
      else {
        if (
          document.activeElement === lastFocusableElement &&
          firstFocusableElement
        ) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

  /**
   * Opens the slideshow.
   */
  openSlideshow() {
    // Adds event listener to prevent the user from tabbing outside of the slideshow
    const appContent = document.getElementById("slideshow-wrapper");
    if (appContent) {
      this.focusableElements = [
        ...this.getAllFocusableElements(appContent).values(),
      ].slice(0, 5);

      // Makes the elements within the slideshow focusable
      this.focusableElements.forEach((element) =>
        element.classList.remove("d-none")
      );

      // Focuses on the first focusable element after opening the slideshow
      if (this.focusableElements[0]) {
        this.focusableElements[0].focus();
      }

      // Adds the event listener to keep focus inside of the slideshow
      document.addEventListener(
        "keydown",
        this.keydownHandler(this.focusableElements)
      );
    }

    this.prevScrollPosition =
      (window.pageYOffset || document.documentElement.scrollTop) -
      (document.documentElement.clientTop || 0);
    this.isSlideshowVisible = true;
    this.disablePageScroll();
    /**
     * This must be called after disabling page scroll or a bug
     * will occur in browsers such as Firefox where the scrollTo method
     * doesn't work
     */
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    Reveal.addEventListeners();
  }

  /**
   * Closes the slideshow.
   */
  closeSlideshow() {
    document.documentElement.scrollTo({
      top: this.prevScrollPosition,
      behavior: "smooth",
    });
    this.isSlideshowVisible = false;
    this.enablePageScroll();
    Reveal.removeEventListeners();

    // Removes event listener that prevented the user from tabbing outside of the slideshow
    const appContent = document.getElementById("slideshow-wrapper");
    if (appContent && this.focusableElements) {
      document.removeEventListener(
        "keydown",
        this.keydownHandler(this.focusableElements)
      );

      // Makes the elements within the slideshow unfocusable
      this.focusableElements.forEach((element) =>
        element.classList.add("d-none")
      );

      if (this.presentButtonRef && this.presentButtonRef.current) {
        this.presentButtonRef.current.focus();
      }
    }
  }

  /**
   * Enables page scroll that Reveal.js disables after initializing
   * the slideshow.
   */
  enablePageScroll() {
    document.body.style.setProperty("overflow", "auto");
  }

  /**
   * Disables page scroll so that the user can't scroll the document while the
   * slideshow is visible.
   */
  disablePageScroll() {
    document.body.style.setProperty("overflow", "hidden");
  }

  /**
   * Takes the verses of a song and creates a slide for each verse.
   * @param verses The verses of the song
   * @param song The song's information
   */
  loadSongIntoSlideshow(verses: Verse[], song: Song) {
    this.removeAllSlides();
    const slideContainer = document.getElementById("slideContainer");

    if (slideContainer) {
      let chorusSlide: HTMLElement | null = null;

      verses.forEach((verse) => {
        const newSlide = document.createElement("section");
        newSlide.classList.add(
          "p-3",
          "d-flex",
          "flex-column",
          "justify-content-center"
        );
        newSlide.style.height = "100%";

        // Creates the line that contains the verse number
        const verseNumber = document.createElement("h1");
        verseNumber.innerHTML = versesService.getVerseNumber(verse, song);
        verseNumber.classList.add("text-secondary");
        // verseNumber.style.fontSize = "3.5vw";
        newSlide.appendChild(verseNumber);

        // Splits the lines in the verse so that they're on their own separate lines
        const verseLines = verse.verse.split("\n");
        verseLines.forEach((line) => {
          const verseText = document.createElement("h1");
          verseText.classList.add("mb-0", "text-secondary");
          verseText.innerHTML = line;
          // verseText.style.fontSize = "3.5vw";
          newSlide.appendChild(verseText);
        });

        slideContainer.appendChild(newSlide);

        // Adds the chorus slide after the verse if a chorus exists
        if (chorusSlide) {
          slideContainer.appendChild(chorusSlide.cloneNode(true));
        }

        // Saves the verse as the chorus if it's the chorus
        if (verse.isChorus && !chorusSlide) {
          chorusSlide = newSlide;
        }
      });
    }

    Reveal.sync();
    // Puts the focus on the first slide
    Reveal.slide(0);
  }

  /**
   * Removes all the slides in the slideshow.
   */
  removeAllSlides() {
    const slideContainer = document.getElementById("slideContainer");
    if (slideContainer) {
      while (slideContainer.firstChild) {
        slideContainer.removeChild(slideContainer.firstChild);
      }
    }
  }

  /**
   * Opens the browser in fullscreen mode.
   */
  openFullscreen() {
    this.inFullscreenMode = true;
    screenService.enterFullscreen();

    if (this.focusableElements && this.focusableElements[0]) {
      this.focusableElements[0].focus();
    }
  }

  /**
   * Exits fullscreen mode for the browser.
   */
  async closeFullscreen() {
    this.inFullscreenMode = false;
    await screenService.exitFullscreen();

    if (this.slideshowRef && this.slideshowRef.current) {
      this.slideshowRef.current.focus();
    }
  }

  /**
   * Toggles fullscreen mode.
   */
  toggleFullscreen() {
    screenService.toggleFullscreen();
    this.inFullscreenMode = !this.inFullscreenMode;

    if (
      this.inFullscreenMode &&
      this.focusableElements &&
      this.focusableElements[0]
    ) {
      this.focusableElements[0].focus();
    }
  }
}

export const slideshowService = new SlideshowService();
