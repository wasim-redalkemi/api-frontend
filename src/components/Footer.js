import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
export default function Footer() {
  return(
    <footer className="footer bg-dark">
      <Container>
        <Row>
          <Col xs="12" className="text-center py-3">
            <p className="text-white mb-0">© Worldwide Copyright Reserved. <Link to="/" className="text-white text-decoration-none">RedAlkemi</Link></p>
          </Col>
        </Row>
      </Container>
    </footer>
  ); 
}
