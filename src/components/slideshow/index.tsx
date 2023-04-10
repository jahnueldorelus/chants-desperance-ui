import { slideshowService } from "@services/slideshow";
import { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import CloseIcon from "@assets/close.svg";
import FullscreenIcon from "@assets/fullscreen.svg";
import { screenService } from "@services/screen";
import "./index.scss";

export const Slideshow = () => {
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

  const toggleFullscreen = () => {
    slideshowService.toggleFullscreen();
  };

  const onClose = () => {
    slideshowService.closeFullscreen();
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
    <div className="slideshow slideshow-initial-view" ref={slideshowRef}>
      {/* Slide show controls */}
      {slideshowControlsJSX()}

      {/* Slide show container */}
      <div className="reveal bg-primary">
        <div id="slideContainer" className="slides"></div>
      </div>
    </div>
  );
};
