import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { userContext } from "@context/user";
import { useNavigate } from "react-router-dom";
import { uiRoutes } from "@components/header/uiRoutes";

type AuthenticationProps = {
  children: JSX.Element;
  pageName?: string;
};

export const Authentication = (props: AuthenticationProps) => {
  const navigate = useNavigate();
  const userConsumer = useContext(userContext);

  /**
   * Attempts to authenticate the user.
   */
  const getUserAuthenticated = async (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (event) {
      event.preventDefault();
    }

    await userConsumer.methods.signInUser();
  };

  /**
   * Navigates to the home page.
   */
  const goHome = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event) {
      event.preventDefault();
    }

    navigate(uiRoutes.songs);
  };

  // If the user is authorized
  if (userConsumer.state.user) {
    return props.children;
  }

  // If an attempt is in progress to authorize the user
  else if (userConsumer.state.authProcessing) {
    return (
      <Container className="py-5 d-flex flex-column align-items-center text-center">
        <Spinner
          className="mt-5"
          animation="border"
          role="status"
          variant="primary"
          style={{ height: 85, width: 85, borderWidth: 9 }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div>
          <p className="px-3 mt-5 fs-4 mb-0 bg-primary text-white rounded">
            Signing in
          </p>
          <p className="mt-3 fs-2 fw-bold text-tertiary">
            Please wait a moment
          </p>
        </div>
      </Container>
    );
  }

  // The attempt to authorize the user failed
  else {
    return (
      <Container className="px-3 py-5">
        <Container className="mt-3 px-0 w-fit text-primary border rounded overflow-hidden text-center">
          <div className="px-3 py-2 bg-primary">
            <h3 className="m-0 text-white">Authentication Required</h3>
          </div>
          <div className="px-3 text-tertiary">
            {/* If cookies are disabled */}
            {!navigator.cookieEnabled && (
              <p className="mt-3">
                * It appears that cookies are currently disabled. Please enable
                them to use this service! *
              </p>
            )}

            <h5 className="mt-4 fw-bold">
              In order to view {props.pageName || "this page"}, you'll have to
              be logged in.
            </h5>
            <h5 className="fw-normal">
              Click below to log into your account or go back home.
            </h5>

            <div className="my-4 d-flex justify-content-evenly align-items-center">
              <Button className="mx-3 w-100" type="button" onClick={goHome}>
                Go Home
              </Button>

              <Button
                className="mx-3 w-100"
                type="button"
                onClick={getUserAuthenticated}
              >
                Login
              </Button>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
};
