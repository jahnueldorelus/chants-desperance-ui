import {
  BrowserDocument,
  BrowserDocumentElement,
} from "@app-types/services/screen";

class ScreenService {
  /**
   * Determines if the browser is in fullscreen mode.
   */
  isDocInFullscreenMode() {
    const doc = <BrowserDocument>document;
    return (
      doc.fullscreenElement ||
      doc.isFullScreen ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  /**
   * Determines if the broswer has fullscreen mode.
   */
  get hasFullScreenMode() {
    const docElement = <BrowserDocumentElement>document.documentElement;

    return Boolean(
      docElement.requestFullscreen ||
        docElement.webkitRequestFullscreen ||
        docElement.msRequestFullscreen ||
        docElement.requestFullScreen ||
        docElement.mozRequestFullScreen
    );
  }

  /**
   * Sends an enter fullscreen request to the browser.
   */
  enterFullscreen() {
    if (!this.isDocInFullscreenMode()) {
    const docElement = <BrowserDocumentElement>document.documentElement;

    // Enters fullscreen mode based upon the browsers fullscreen method
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
      docElement.webkitRequestFullscreen();
    } else if (docElement.msRequestFullscreen) {
      docElement.msRequestFullscreen();
    } else if (docElement.requestFullScreen) {
      docElement.requestFullScreen();
    } else if (docElement.mozRequestFullScreen) {
      docElement.mozRequestFullScreen();
    }}
  }

  /**
   * Sends an exit fullscreen request to the browser.
   */
  async exitFullscreen() {
    if (this.isDocInFullscreenMode()) {
    const doc = <BrowserDocument>document;

    // Exits fullscreen mode
    if (doc.exitFullscreen) {
     await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    } else if (doc.cancelFullScreen) {
      doc.cancelFullScreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    }
  }
  }

  /**
   * Toggles fullscreen mode of the browser.
   */
  toggleFullscreen() {
    if (this.isDocInFullscreenMode()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }
}

export const screenService = new ScreenService();
