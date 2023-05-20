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
            href="https://www.jahnueldorelus.com"
            target="_blank"
            aria-label="Jahnuel Dorelus's personal website"
          >
            Jahnuel Dorelus
          </a>
        </p>
      </Container>
    </Container>
  );
};
