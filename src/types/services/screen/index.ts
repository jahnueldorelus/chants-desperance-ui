// Allows for specific browser fullscreen methods to be available
export interface BrowserDocument extends Document {
  webkitExitFullscreen?: any;
  msExitFullscreen?: any;
  cancelFullScreen?: any;
  mozCancelFullScreen?: any;
  isFullScreen?: any;
  webkitFullscreenElement?: any;
  mozFullScreenElement?: any;
  msFullscreenElement?: any;
}
export interface BrowserDocumentElement extends HTMLElement {
  webkitRequestFullscreen?: any;
  msRequestFullscreen?: any;
  requestFullScreen?: any;
  mozRequestFullScreen?: any;
}
