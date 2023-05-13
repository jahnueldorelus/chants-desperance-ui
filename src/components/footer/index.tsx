import Container from "react-bootstrap/Container";

export const AppFooter = () => {
  return (
    <Container className="bg-primary text-white" fluid>
      <Container className="py-2 d-flex justify-content-between flex-column flex-sm-row text-center">
        <p className="m-0">
          &copy; Chants D'Espérance {new Date().getFullYear()}
        </p>
        <p className="m-0">
          Created by&nbsp;
          <a
            className="text-info text-decoration-none"
            href="https://www.linkedin.com/in/jahnueldorelus/"
            target="_blank"
            rel="nofollow"
            aria-label="visit Jahnuel Dorelus's LinkedIn profile"
          >
            Jahnuel Dorelus
          </a>
        </p>
      </Container>
    </Container>
  );
};
