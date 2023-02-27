import Container from "react-bootstrap/Container";

export const AppFooter = () => {
  return (
    <Container className="bg-primary text-white" fluid>
      <Container className="py-2 d-flex justify-content-between flex-column flex-sm-row text-center">
        <h6 className="m-0">
          &copy; Chants D'Espérance {new Date().getFullYear()}
        </h6>
        <h6 className="m-0">
          Created by&nbsp;
          <a
            className="text-info text-decoration-none"
            href="https://www.linkedin.com/in/jahnueldorelus/"
          >
            Jahnuel Dorelus
          </a>
        </h6>
      </Container>
    </Container>
  );
};
