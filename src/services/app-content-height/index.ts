import { RefObject } from "react";

class AppContentHeight {
  headerRef: RefObject<HTMLElement> | null;
  footerRef: RefObject<HTMLElement> | null;
  setMinContentHeight: ((newHeight: number) => void) | null;
  contentHeight: number;

  constructor() {
    this.headerRef = null;
    this.footerRef = null;
    this.setMinContentHeight = null;
    this.contentHeight = 0;
  }

  /**
   * Sets the minimum height of the main content and the height of the root
   * element. This makes the main content on the page to have the full height
   * of the window.
   */
  calculateNewHeight = () => {
    if (this.setMinContentHeight) {
      if (
        this.headerRef &&
        this.headerRef.current &&
        this.footerRef &&
        this.footerRef.current
      ) {
        document.documentElement.style.setProperty(
          "height",
          (window.visualViewport?.height || window.innerHeight) + "px"
        );

        if (window.visualViewport) {
          const tempHeight =
            window.visualViewport.height -
            this.headerRef.current.offsetHeight -
            this.footerRef.current.offsetHeight;

          console.log("New Height:", tempHeight + "px");
          this.setMinContentHeight(tempHeight);
          this.contentHeight = tempHeight;
        } else {
          const tempHeight =
            window.innerHeight -
            this.headerRef.current.offsetHeight -
            this.footerRef.current.offsetHeight;

          this.setMinContentHeight(tempHeight);
          this.contentHeight = tempHeight;
        }
      }
    }
  };
}

export const appContentHeightService = new AppContentHeight();
