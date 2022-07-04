import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";

export default function Home() {

  const api_domain = process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_DOMAIN : "";

  const params = useParams();
  const location = useLocation();

  const [site, setSite] = useState(() => {
    var currentSite = parseInt(localStorage.getItem("site"));
    if(currentSite){
      return currentSite;
    }
    else{
      return 1;
    }
  });
  const defaultUrl = "/posts?site="+site+"&per_page=20&orderby=modified";

  const [url, setUrl] = useState(defaultUrl);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const fetchData = async (url) => {
    try {

      //console.log(url);
      // loader 
      setIsLoaded(false);

      //fetch data
      const response = await fetch(api_domain+url);
      const result = await response.json();

      //set data
      setIsLoaded(true);
      setTotalPage(parseInt(response.headers.get('totalPages')));
      setItems(result); 

    } 
    catch (error) {
      console.log("error", error);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  }
  const handlePrevious = () => {
    setPage(page - 1);
  }

  useEffect(() => {

    //change url
    if(params.categorySlug){
      fetch(api_domain+"/categories?site="+site+"&slug="+params.categorySlug)
      .then(response => response.json())
      .then(data => {
        setUrl(defaultUrl + "&categories=" + data[0].id);
      });
      setPage(1);
    }
    else if(params.searchText){
      setUrl(defaultUrl + "&search="+params.searchText);
      setPage(1);
    }
    else{
      setUrl(defaultUrl);  
    }

  }, [location]);

  useEffect(() => {

    //fetch data
    fetchData(url+"&page="+page);
  }, [page, url]);


  if (!isLoaded) {
    return (
      <Container>
        <Row>
          <Col xs="12">
            <Alert variant="success">
              <h1 className="h6 m-0 d-inline">Moviesking is The Best Website/Platform For Hollywood HD Movies.</h1> We Provide Direct Google Drive Download Links For Fast And Secure Downloading. Just Click On Download Button And Follow Steps To Download And Watch Movies Online For Free.
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="pb-5 text-center">
            <Spinner animation="border" variant="success" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  } 
  else {
    if(items.length>0){
      return (
        <Container>
          <Row>
            <Col xs="12">
              <Alert variant="success">
                <h1 className="h6 m-0 d-inline">Moviesking is The Best Website/Platform For Hollywood HD Movies.</h1> We Provide Direct Google Drive Download Links For Fast And Secure Downloading. Just Click On Download Button And Follow Steps To Download And Watch Movies Online For Free.
              </Alert>
            </Col>
          </Row>
          <Row className="g-md-4 g-2 listing-items">
            {items.map(item => (
              <Col lg="3" md="4" xs="6" key={item.id}>
                <Link to={"/download/"+item.slug}>
                  <Card className="text-white">
                    {/* <Card.Img src="/assets/images/blog.jpg" alt="Card image" width="350" height="350" className="object-cover" /> */}
                    <Card.Img src={typeof item.yoast_head_json.og_image != "undefined" ? item.yoast_head_json.og_image[0].url : ""} alt="Card image" width="350" height="350" className="object-cover" />
                    <Card.ImgOverlay className="d-flex flex-column justify-content-end bg-black-gradient">
                      <Card.Title as="p">{item.title.rendered}</Card.Title>
                    </Card.ImgOverlay>
                  </Card>
                </Link>
              </Col>
            ))}
            <Col xs="12" className="py-md-5 py-4 text-center">
              { page !== 1 && <Button variant="success" className="me-3" onClick={handlePrevious}>Previous</Button> }
              { page !== totalPage && <Button variant="success" onClick={handleNext}>Next</Button> }
            </Col>
          </Row>
        </Container>
      );
    }
    else{
      return (
        <Container>
          <Row>
            <Col xs="12" className="pb-5 text-center">
              <p>No result found</p>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
