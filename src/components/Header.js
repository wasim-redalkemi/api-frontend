import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Image, Form, InputGroup } from "react-bootstrap";


export default function Header() {

  const api_domain = process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_DOMAIN : "";

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  const fetchData = async (url) => {
    try {

      //fetch data
      const response = await fetch(api_domain+url);
      const result = await response.json();

      //set data
      setCategories(result); 
    } 
    catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (event) => {    
    setSearchText(event.target.value);  
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/search/'+searchText);
    setSearchText("");
  }

  useEffect(() => {
    fetchData("/categories?include=24,110,6,5,4,21,68,20&orderby=include");
  }, []);

  return(
    <header className="header">
      <Helmet>
        <title>TheMoviesKing - TheMoviesVerse | MoviesFlixPro | MoviesVerse</title>
      </Helmet>
      <Container>
        <Row>
          <Col xs="12" className="text-center py-4">
            <Link to="/"><Image fluid="true" src="/assets/images/MoviesKing-logo.png" alt="logo" width="201" height="36"></Image></Link>
          </Col>
          <Col lg="5" md="7" xs="12" className="mx-auto">
            <Form onSubmit={handleSubmit}>
              <InputGroup className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Search..." 
                  name="search"
                  value={searchText}
                  required
                  onChange={handleChange}
                />
                <Button variant="success" type="submit">Search</Button>
              </InputGroup>
            </Form>
          </Col>
          <Col xs="12" className="text-center pb-4">
          {
            categories.map((category) => (
              <Button key={category.id} variant="success" size="sm" as={Link} to={"/category/"+category.slug} className="m-1">{category.name}</Button>
            ))
          }
          </Col>
        </Row>
      </Container>
    </header>
  ); 
}
