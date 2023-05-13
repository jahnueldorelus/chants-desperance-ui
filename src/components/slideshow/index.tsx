import { slideshowService } from "@services/slideshow";
import { useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";
import CloseIcon from "@assets/close.svg";
import FullscreenIcon from "@assets/fullscreen.svg";
import { screenService } from "@services/screen";
import "./index.scss";

export const Slideshow = () => {
  useState<NodeListOf<HTMLElement> | null>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    slideshowService.slideshowRef = slideshowRef;

    if (!slideshowService.initialized) {
      Reveal.initialize({
        // Shows the slide number
        slideNumber: true,
        center: false,
        disableLayout: true,
      });

      slideshowService.initialized = true;
    }

    slideshowService.enablePageScroll();
  }, []);

  /**
   * Toggles fullscreen mode of the browser.
   */
  const toggleFullscreen = () => {
    slideshowService.toggleFullscreen();
  };

  /**
   * Closes out of fullscreen mode (if active) and closes out
   * the slideshow.
   */
  const onClose = async () => {
    await slideshowService.closeFullscreen();
    slideshowService.closeSlideshow();
  };

  const slideshowControlsJSX = () => {
    return (
      <div className="slideshow-controls m-3 mt-4">
        {/* Toggle fullscreen */}
        {screenService.hasFullScreenMode && (
          <button
            className="p-0 me-3 bg-transparent"
            type="button"
            onClick={toggleFullscreen}
            aria-label="toggle fullscreen mode"
            title="Toggle fullscreen mode of slideshow"
          >
            <img src={FullscreenIcon} height="30" alt="fullscreen icon" />
          </button>
        )}

        {/* Close slideshow  */}
        <button
          className="p-0 mx-3 bg-transparent"
          type="button"
          onClick={onClose}
          aria-label="close slideshow"
          title="Exit slideshow"
        >
          <img src={CloseIcon} height="30" alt="close icon" />
        </button>
      </div>
    );
  };

  return (
    <div
      id="slideshow-wrapper"
      className="slideshow slideshow-initial-view"
      role="dialog"
      aria-modal={true}
      ref={slideshowRef}
    >
      {/* Slide show controls */}
      {slideshowControlsJSX()}

      {/* Slide show container */}
      <div className="reveal bg-primary">
        <div id="slideContainer" className="slides"></div>
      </div>
    </div>
  );
};
