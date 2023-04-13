import { authService } from "@services/auth";
import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

type AuthenticationProps = {
  children: JSX.Element;
};

export const Authentication = (props: AuthenticationProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const attemptedAuthRequest = useRef<boolean>(false);
  const [authProcessing, setAuthProcessing] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Saves the state changer function to the service to change
     * the state outside of the component
     */
    authService.authUrlMethod = setAuthUrl;

    if (!attemptedAuthRequest.current) {
      attemptedAuthRequest.current = true;
      getUserAuthenticated();
    }
  }, []);

  // Navigates to the auth url if a url is present
  useEffect(() => {
    if (authUrl) {
      window.location.replace(authUrl);
    }
  }, [authUrl]);

  /**
   * Attempts to authenticate the user.
   */
  const getUserAuthenticated = async () => {
    setAuthProcessing(true);
    if (!authService.isUserAuthorized()) {
      await authService.getUserToken();
    }

    setAuthProcessing(false);
    setIsAuthorized(authService.isUserAuthorized());
  };

  // If the user is authorized
  if (isAuthorized) {
    return props.children;
  }

  // If an attempt is in progress to authorize the user
  else if (authProcessing || authUrl) {
    return (
      <Container className="py-5 d-flex flex-column align-items-center">
        <Spinner
          className="mt-5"
          animation="grow"
          role="status"
          variant="primary"
          style={{ height: 70, width: 70 }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h1 className="pt-4 text-tertiary">Attempting to sign in.</h1>
      </Container>
    );
  }

  // The attempt to authorize the user failed
  else {
    return (
      <Container className="px-3 py-5">
        <Container className="mt-3 px-0 w-fit text-primary border rounded overflow-hidden text-center">
          <div className="px-3 py-2 bg-primary">
            <h3 className="m-0 text-secondary">
              Uh-oh, looks like we couldn't log you in.
            </h3>
          </div>
          <div className="px-3">
            {/* If cookies are disabled */}
            {!navigator.cookieEnabled && (
              <p className="mt-3">
                * It appears that cookies are currently disabled. Please enable
                them to use this service! *
              </p>
            )}

            <h5 className="mt-4">
              If you'd like to retry logging in, click the button below.
            </h5>
            <Button
              className="mt-1"
              type="button"
              onClick={getUserAuthenticated}
            >
              Retry Login
            </Button>

            <h6 className="mt-4">
              If the issue persists, please contact us&nbsp;
              <a
                className="text-tertiary"
                href="mailto:support@jahnueldorelus.com?subject=Service - Chant d'Espérance: Unable to Login"
              >
                here
              </a>
              .
            </h6>
          </div>
        </Container>
      </Container>
    );
  }
};
