import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import CloseButton from "react-bootstrap/CloseButton";
import { NavLink } from "react-router-dom";
import { uiRoutes } from "@components/header/uiRoutes";
import CELogo from "@assets/chants-desperance.png";
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
      <Nav.Item className="py-1 px-2 fs-5" as="li">
        <NavLink to={itemLink} onClick={onMobileMenuToggle}>
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
      <Nav.Item className="mx-2 d-flex align-items-center">
        <NavLink className="px-2 py-1 fs-5" to={itemLink}>
          {itemName}
        </NavLink>
      </Nav.Item>
    );
  };

  return (
    <Navbar className="app-navbar py-1" bg="tertiary" expand="md">
      <Container className="justify-content-md-center">
        {/* Mobile navigation */}
        <Navbar.Toggle
          className="px-2 bg-senary"
          onClick={onMobileMenuToggle}
          aria-controls={mobileNavId}
        />

        <Offcanvas
          backdropClassName="bg-primary"
          id={mobileNavId}
          placement="start"
          show={isOffcanvasVisible}
          onHide={onMobileMenuToggle}
        >
          <CloseButton
            className="m-0 bg-light"
            variant="white"
            aria-label="Close navigation menu"
            onClick={onMobileMenuToggle}
          />
          <Offcanvas.Body>
            <Nav onSelect={onMobileMenuToggle} as="ul">
              {createOffCanvasNavItem(uiRoutes.songs, "Songs")}
              {createOffCanvasNavItem(uiRoutes.favorites, "Favorites")}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Desktop Navigation */}
        <Nav className="d-none d-md-flex">
          {createNavItem(uiRoutes.songs, "Songs")}
          <Navbar.Brand className="mx-4">
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
      </Container>
    </Navbar>
  );
};
