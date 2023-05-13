import { AppHeader } from "@components/header";
import { Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppFooter } from "@components/footer";
import { appContentHeightService } from "@services/app-content-height";
import { userContext } from "@context/user";
import { setupAxiosInterceptors } from "@services/axios-interceptors";
import { FocusableReference } from "@components/focusable-reference";
import Button from "react-bootstrap/Button";
import "./App.scss";

function App() {
  const location = useLocation();
  const topOfPageRef = useRef<HTMLDivElement>(null);
  const topOfMainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);
  const userConsumer = useContext(userContext);
  const navigationZIndex = 990;

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

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (topOfPageRef.current) {
      topOfPageRef.current.focus();
    }
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
    };
  }, []);

  /**
   * Sets up the axios interceptors.
   */
  useEffect(() => {
    setupAxiosInterceptors(userConsumer.methods);
  }, []);

  /**
   * Changes the focus to the main content.
   */
  const onSkipMainContentClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (topOfMainRef.current) {
      topOfMainRef.current.focus();
    }
  };

  return (
    <div id="test-content">
      <FocusableReference ref={topOfPageRef} />

      <Button
        className="visually-hidden-focusable px-2 py-1 ms-2 mt-2 mb-0 bg-white text-primary border border-primary rounded w-fit position-absolute top-0"
        style={{ zIndex: navigationZIndex + 1 }}
        onClick={onSkipMainContentClick}
      >
        Skip to main content
      </Button>

      {/* Header of the application */}
      <header ref={headerRef}>
        <AppHeader />
      </header>

      {/* Main content of the application */}
      <FocusableReference ref={topOfMainRef} />

      <main className="mx-3" style={{ minHeight: minimumContentHeight }}>
        <Outlet />
      </main>

      <footer ref={footerRef}>
        <AppFooter />
      </footer>
    </div>
  );
}

export default App;
