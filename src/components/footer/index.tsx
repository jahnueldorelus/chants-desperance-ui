import Container from "react-bootstrap/Container";

export const AppFooter = () => {
  return (
    <Container className="bg-primary text-white" fluid>
      <Container className="py-2">
        <h6 className="m-0">
          &copy; Chants D'Espérance {new Date().getFullYear()}
        </h6>
      </Container>
    </Container>
  );
};
