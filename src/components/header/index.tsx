import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";
import { NavLink } from "react-router-dom";
import { uiRoutes } from "@components/header/uiRoutes";
import CELogo from "@assets/chants-desperance.svg";
import UserSvg from "@assets/user.svg";
import { userContext } from "@context/user";
import "./index.scss";

export const AppHeader = () => {
  const mobileNavId = "app-navigation-mobile";
  const desktopUserMenuId = "app-navigation-desktop-user-menu";
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [failedToSignOut, setFailedToSignOut] = useState(false);
  const attemptedAuthRequest = useRef<boolean>(false);
  const userConsumer = useContext(userContext);

  /**
   * Attempts to reauthorize the user if they're already
   * signed in.
   */
  useEffect(() => {
    if (!attemptedAuthRequest.current) {
      attemptedAuthRequest.current = true;
      getUserReauthorized();
    }
  }, []);

  // Navigates to the auth url if a url is present
  useEffect(() => {
    if (userConsumer.state.ssoAuthUrl) {
      window.location.replace(userConsumer.state.ssoAuthUrl);
    }
  }, [userConsumer.state.ssoAuthUrl]);

  /**
   * Attempts to get the user's reauthorized.
   */
  const getUserReauthorized = async () => {
    await userConsumer.methods.reauthorizeUser();
  };

  /**
   * Attempts to authenticate the user.
   */
  const signInUser = async (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (event) {
      event.preventDefault();
    }

    await userConsumer.methods.signInUser();
  };

  /**
   * Attempts to sign out the user.
   */
  const signOutUser = async (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (event) {
      event.preventDefault();
    }

    const userSignedOut = await userConsumer.methods.signOutUser();

    if (!userSignedOut) {
      setFailedToSignOut(true);

      // Displays the alert for a few seconds
      setTimeout(() => {
        setFailedToSignOut(false);
      }, 5000);
    }
  };

  /**
   * Handles dismissing the "failed to sign out" alert.
   */
  const onAlertClose = () => {
    setFailedToSignOut(false);
  };

  /**
   * Click handler for the mobile menu toggle.
   */
  const onMobileMenuToggle = () => {
    setIsOffcanvasVisible(!isOffcanvasVisible);
  };

  /**
   * Click handler for the user menu options toggle.
   */
  const onUserMenuOptionsToggle = (willMenuShow: boolean) => {
    setIsUserDropdownVisible(willMenuShow);
  };

  /**
   * Retrieves the JSX for the user profile image.
   */
  const getUserProfileImgJSX = () => {
    return <img src={UserSvg} alt="user profile" width="38" />;
  };

  /**
   * Retrieves the JSX for a logged in user in the user
   * menu options dropdown.
   */
  const loggedInUserDropdownInfo = (): JSX.Element => {
    const user = userConsumer.state.user;

    if (user) {
      const userFullName = userConsumer.methods.getUserFullName(user);

      return (
        <Fragment>
          <div className="mb-0 py-2 px-2 text-white">
            Logged in as
            <br />
            <span className="text-secondary">
              <strong>{userFullName}</strong>
            </span>
          </div>

          <Dropdown.Divider className="mx-2 bg-white" />
        </Fragment>
      );
    } else {
      return <></>;
    }
  };

  /**
   * Retrieves the JSX for a logged in user in the user
   * menu options dropdown.
   */
  const loggedInUserOffCanvasInfo = (): JSX.Element => {
    const user = userConsumer.state.user;
    const userFullName = userConsumer.methods.getUserFullName(user);

    return (
      <Offcanvas.Header className="mb-3 pb-2 align-items-start bg-primary text-white">
        <Container className="p-0 me-4">
          {getUserProfileImgJSX()}
          <Offcanvas.Title className="mt-2">
            {userConsumer.state.user ? "Logged in as" : "Not logged in"}
            <br />
            {userConsumer.state.user && (
              <span className="text-secondary">
                <strong>{userFullName}</strong>
              </span>
            )}
          </Offcanvas.Title>
        </Container>
        <CloseButton
          className="m-0 bg-light"
          variant="white"
          aria-label="Close navigation menu"
          onClick={onMobileMenuToggle}
        />
      </Offcanvas.Header>
    );
  };

  /**
   * Creates an offcanvas nav item.
   * @param itemLink The path to link the nav item to
   * @param itemName The name of the nav item
   * @param itemOnClick The event handler when the item is clicked
   */
  const createOffCanvasNavItem = (
    itemLink: string,
    itemName: string,
    itemOnClick: () => void
  ) => {
    return (
      <Nav.Item className="app-nav-item py-1 fs-5" as="li">
        <NavLink
          className="app-nav-link d-inline-block"
          to={itemLink}
          onClick={itemOnClick}
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
      <Nav.Item className="app-nav-item mx-3 d-none d-md-flex align-items-center">
        <NavLink className="app-nav-link fs-5" to={itemLink}>
          {itemName}
        </NavLink>
      </Nav.Item>
    );
  };

  return (
    <Navbar className="app-navbar py-1" bg="tertiary" expand="md">
      <Container className="flex-row-reverse flex-md-row justify-content-md-center position-relative">
        {/* Desktop Navigation */}
        <Nav className="flex-row align-items-center justify-content-between w-100">
          <Navbar.Toggle
            className="app-nav-toggle px-2 py-0 mx-2 my-1 bg-white border-transparent w-fit"
            onClick={onMobileMenuToggle}
            label="toggle navigation menu"
            aria-controls={mobileNavId}
          />

          <Navbar.Brand>
            <NavLink className="text-decoration-none" to={uiRoutes.songs}>
              <div className="me-0 d-flex align-items-center text-white text-decoration-none fs-3">
                <img
                  className="me-2"
                  src={CELogo}
                  alt="Chants d'Esperance logo"
                  width="40"
                />
                <h1 className="m-0 fs-2">CE</h1>
              </div>
            </NavLink>
          </Navbar.Brand>

          <div className="d-none d-md-flex">
            {createNavItem(uiRoutes.songs, "Songs")}
            {userConsumer.state.user &&
              createNavItem(uiRoutes.favorites, "Favorites")}
            {userConsumer.state.user &&
              userConsumer.state.user.isAdmin &&
              createNavItem(uiRoutes.admin, "Admin")}

            <Dropdown
              className="app-profile-dropdown ms-4 d-none d-md-flex align-items-center"
              onToggle={onUserMenuOptionsToggle}
              as={Nav.Item}
            >
              <Dropdown.Toggle
                className="p-0 bg-transparent d-flex align-items-center rounded-circle border-0"
                aria-expanded={isUserDropdownVisible}
                aria-controls={desktopUserMenuId}
                aria-label="more navigation options"
              >
                {/* Shows a loader instead of the user profile image if an auth request is processing */}
                {userConsumer.state.authProcessing ? (
                  <Spinner className="me-1" animation="border">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  getUserProfileImgJSX()
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={
                  "user-dropdown-menu bg-primary p-2 overflow-hidden" +
                  (userConsumer.state.authProcessing ? " d-none" : "")
                }
                id={desktopUserMenuId}
                align="end"
              >
                {loggedInUserDropdownInfo()}
                <ul className="p-0 m-0">
                  <li>
                    <Button
                      className="p-0 border-0 w-100 text-start"
                      onClick={
                        userConsumer.state.user ? signOutUser : signInUser
                      }
                    >
                      <Dropdown.Item
                        className="dropdown-menu-item py-2 m-0 fs-5 rounded"
                        as="h2"
                      >
                        {userConsumer.state.user ? "Logout" : "Login"}
                      </Dropdown.Item>
                    </Button>
                  </li>
                </ul>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Nav>

        {/* Mobile navigation */}
        <Offcanvas
          backdropClassName="bg-primary"
          id={mobileNavId}
          placement="start"
          show={isOffcanvasVisible}
          onHide={onMobileMenuToggle}
        >
          {loggedInUserOffCanvasInfo()}

          <Offcanvas.Body className="pt-0">
            {!userConsumer.state.authProcessing && (
              <Nav onSelect={onMobileMenuToggle} as="ul">
                {createOffCanvasNavItem(
                  uiRoutes.songs,
                  "Songs",
                  onMobileMenuToggle
                )}
                {userConsumer.state.user &&
                  createOffCanvasNavItem(
                    uiRoutes.favorites,
                    "Favorites",
                    onMobileMenuToggle
                  )}
                {userConsumer.state.user &&
                  userConsumer.state.user.isAdmin &&
                  createOffCanvasNavItem(
                    uiRoutes.admin,
                    "Admin",
                    onMobileMenuToggle
                  )}
                {createOffCanvasNavItem(
                  userConsumer.state.user ? "/login" : "/logout",
                  userConsumer.state.user ? "Logout" : "Login",
                  userConsumer.state.user ? signOutUser : signInUser
                )}
              </Nav>
            )}
            {userConsumer.state.authProcessing && (
              <div className="mt-3 d-flex flex-column align-items-center">
                <Spinner animation="border">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <h3 className="mt-3 text-primary">
                  {userConsumer.state.user ? "Logging Out" : "Logging In"}
                </h3>
              </div>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        <Alert
          className="mt-3 mx-3 position-absolute top-100"
          variant="danger"
          show={failedToSignOut}
          onClose={onAlertClose}
        >
          An error occurred while trying to log you out. Please try again or
          contact us for assistance.
        </Alert>
      </Container>
    </Navbar>
  );
};
