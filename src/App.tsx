import { AppHeader } from "@components/header";
import { Outlet, useLocation } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import { AppFooter } from "@components/footer";
import { appContentHeightService } from "@services/app-content-height";
import { parentWindowService } from "@services/parent-window";
import "./App.scss";

function App() {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);

  /**
   * Handles setting up the app content height service.
   */
  useEffect(() => {
    if (!appContentHeightService.setMinContentHeight) {
      appContentHeightService.setMinContentHeight = setMinimumContentHeight;
    }
    if (headerRef.current !== appContentHeightService.headerRef?.current) {
      appContentHeightService.headerRef = headerRef;
    }
    if (footerRef.current !== appContentHeightService.footerRef?.current) {
      appContentHeightService.footerRef = footerRef;
    }
  }, [headerRef.current, footerRef.current]);

  /**
   * Both useEffects below sets the minimum height of the main content on page load and
   * on location change. This makes the content on the page to have the full height
   * of the window. It also removes unneeded event listeners.
   */
  useEffect(() => {
    appContentHeightService.calculateNewHeight();
  }, [location.pathname]);

  useEffect(() => {
    const resizeListenerFunction = appContentHeightService.calculateNewHeight;

    if (window.visualViewport) {
      /**
       * This is added for all devices that have a visual viewport whose height
       * is different than the window object. This fixes an issue on Safari iOS where
       * a window resize event isn't triggered upon the controls of the browser
       * expanding/collapsing.
       */
      window.visualViewport.addEventListener("resize", resizeListenerFunction);
    } else {
      window.addEventListener("resize", resizeListenerFunction);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          resizeListenerFunction
        );
      } else {
        window.removeEventListener("resize", resizeListenerFunction);
      }

      parentWindowService.destroyListener();
    };
  }, []);

  return (
    <Fragment>
      <header ref={headerRef}>
        <AppHeader />
      </header>
      <main style={{ minHeight: minimumContentHeight }}>
        <Outlet />
      </main>
      <footer ref={footerRef}>
        <AppFooter />
      </footer>
    </Fragment>
  );
}

export default App;
