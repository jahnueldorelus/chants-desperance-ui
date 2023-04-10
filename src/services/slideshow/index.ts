import { Verse } from "@app-types/entities/verses";
import { Song } from "@app-types/entities/songs";
import Reveal from "reveal.js";
import { versesService } from "@services/verses";
import { screenService } from "@services/screen";
import { RefObject } from "react";

class SlideshowService {
  slideshowRef: RefObject<HTMLDivElement> | null;
  prevScrollPosition: number;
  initialized: boolean;

  constructor() {
    this.slideshowRef = null;
    this.prevScrollPosition = 0;
    this.initialized = false;
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
   * Opens the slideshow.
   */
  openSlideshow() {
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
    screenService.enterFullscreen();
  }

  /**
   * Exits fullscreen mode for the browser.
   */
  closeFullscreen() {
    screenService.exitFullscreen();
  }

  /**
   * Toggles fullscreen mode.
   */
  toggleFullscreen() {
    screenService.toggleFullscreen();
  }
}

export const slideshowService = new SlideshowService();
