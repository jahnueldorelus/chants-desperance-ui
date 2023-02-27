import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink } from "react-router-dom";
import { uiRoutes } from "@components/header/uiRoutes";
import CELogo from "@assets/chants-desperance.png";
import CloseSvg from "@assets/close.svg";
import "./index.scss";

export const AppHeader = () => {
  const mobileNavId = "app-navigation-mobile";
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);

  /**
   * Click handler for the mobile menu toggle.
   */
  const onMobileMenuToggle = () => {
    setIsOffcanvasVisible(!isOffcanvasVisible);
  };

  /**
   * Creates an offcanvas nav item.
   * @param itemLink The path to link the nav item to
   * @param itemName The name of the nav item
   */
  const createOffCanvasNavItem = (itemLink: string, itemName: string) => {
    return (
      <Nav.Item className="app-nav-item py-1 fs-5" as="li">
        <NavLink
          className="app-nav-link d-inline-block"
          to={itemLink}
          onClick={onMobileMenuToggle}
        >
          {itemName}
        </NavLink>
      </Nav.Item>
    );
  };

  /**
   * Creates a nav item.
   * @param itemLink The path to link the nav item to
   * @param itemName The name of the nav item
   */
  const createNavItem = (itemLink: string, itemName: string) => {
    return (
      <Nav.Item className="app-nav-item mx-2 d-none d-md-flex align-items-center">
        <NavLink className="app-nav-link fs-5" to={itemLink}>
          {itemName}
        </NavLink>
      </Nav.Item>
    );
  };

  return (
    <Navbar className="app-navbar py-1" bg="tertiary" expand="md">
      <Container className="justify-content-md-center">
        {/* Desktop Navigation */}
        <Nav>
          {createNavItem(uiRoutes.songs, "Songs")}
          <Navbar.Brand className="mx-2 mx-md-4">
            <div className="me-0 d-flex align-items-center text-white text-decoration-none fs-3">
              <img
                className="me-2"
                src={CELogo}
                alt="Chants d'Esperance logo"
                width="40"
              />
              <h1 className="m-0 fs-2">CE</h1>
            </div>
          </Navbar.Brand>
          {createNavItem(uiRoutes.favorites, "Favorites")}
        </Nav>

        {/* Mobile navigation */}
        <Navbar.Toggle
          className="app-nav-toggle px-2 py-0 mx-2 my-1 bg-white border-transparent"
          onClick={onMobileMenuToggle}
          aria-controls={mobileNavId}
        />

        <Offcanvas
          backdropClassName="bg-primary"
          id={mobileNavId}
          placement="end"
          show={isOffcanvasVisible}
          onHide={onMobileMenuToggle}
        >
          <Offcanvas.Header className="justify-content-start align-items-center">
            <button
              className="close-menu-btn w-full d-flex align-items-center rounded"
              onClick={onMobileMenuToggle}
              aria-label="Close navigation menu"
            >
              <img src={CloseSvg} alt="x mark symbol" height={15} />
              <h5 className="ms-2 mb-0 text-tertiary">Close</h5>
            </button>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav onSelect={onMobileMenuToggle} as="ul">
              {createOffCanvasNavItem(uiRoutes.songs, "Songs")}
              {createOffCanvasNavItem(uiRoutes.favorites, "Favorites")}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
};
