import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Breadcrumb } from "react-bootstrap";

import BannerAds from '../components/BannerAds.js';

export default function Download(props) {

  const api_domain = process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_DOMAIN : "";

  const params = useParams();
  const slug = params.slug;
  const [relatedItems, setRelatedItems] = useState([]);
  const [details, setDetails] = useState([]);
  const [isDetailsLoaded, setIsDetailsLoaded] = useState(false);
  const [isRelatedItemsLoaded, setIsRelatedItemsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [site, setSite] = useState(() => {
    var currentSite = parseInt(localStorage.getItem("site"));
    if(currentSite){
      return currentSite;
    }
    else{
      return 1;
    }
  });

  const defaultUrl = "/posts?site="+site;
  const metaDescription = "moviesking, moviesverse, moviesFlix, 480p Movies, 720p Movies, 1080p movies, Dual Audio Movies, Hindi Dubbed Series, Hollywood Movies.";
  const metaUrl = "https://movies-king.herokuapp.com/";
  const metaOgImage = "/assets/images/moviesking-og-image.jpg";

  const fetchData = async (url, type) => {
    try {

      //fetch data
      const response = await fetch(api_domain+url);
      const result = await response.json();

      if(type === "details"){
        setDetails(result[0]);
        setCategories(result[0].categories);
        setIsDetailsLoaded(true);
        //console.log(result[0]);
      }
      else if(type === "relatedItems"){
        setRelatedItems(result);
        setIsRelatedItemsLoaded(true);
      }
    } 
    catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    //fetch data
    fetchData(defaultUrl+"&slug="+slug, "details");
  }, [slug]);


  useEffect(() => {
    //fetch data
    if(categories.length > 0){
      fetchData(defaultUrl+"&categories="+categories, "relatedItems");
    }
  }, [categories]);

  if (!isDetailsLoaded) {
    return (
      <Container>
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
    return (
      <Container>
        <Helmet>

          {/*<!-- Primary Meta Tags -->*/}
          <title>TheMoviesKing | {details.title.rendered}</title>
          
          <meta name="robots" content="index, follow" />

          <meta name="title" content={"TheMoviesKing | " + details.title.rendered} />
          <meta name="description" content={metaDescription} />

          {/*<!-- Open Graph / Facebook -->*/}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={metaUrl} />
          <meta property="og:title" content={"TheMoviesKing | " + details.title.rendered} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:image" content={metaOgImage} />

          {/*<!-- Twitter -->*/}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={metaUrl} />
          <meta property="twitter:title" content={"TheMoviesKing | " + details.title.rendered} />
          <meta property="twitter:description" content={metaDescription} />
          <meta property="twitter:image" content={metaOgImage} />

          {/*<!-- native banner -->*/}
          <script async="async" data-cfasync="false" src="//pl17433154.profitablecpmgate.com/922675462c26f8ceddf0c9a466b3ee4d/invoke.js"></script>

        </Helmet>
        <Row className="pb-5 pt-4">
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{details.title.rendered}</Breadcrumb.Item>
          </Breadcrumb>
          <Col lg="8" xs="12" className="single-item-details">
            <h1 className="mb-4">{details.title.rendered}</h1>   

            {/*<!-- native banner -->*/}
            <div id="container-922675462c26f8ceddf0c9a466b3ee4d"></div>

            <BannerAds adskey="1968b4e10fa863cf4329e4eb4558e2d3" width="728" height="90" />

            {/*{details.content.rendered.replace(/moviesverse|MoviesVerse/g, "MoviesKing")}*/}
            <div className="item-content" dangerouslySetInnerHTML={{__html: details.content.rendered.replace(/moviesverse|MoviesVerse/g, "MoviesKing") }} />
          </Col>
          <Col lg="4" xs="12">
            <h3>Related</h3>
            <BannerAds adskey="e53f7ff77c96509738e4f596f3bcfcef" width="320" height="50" />
            <BannerAds adskey="37c629e416a663925a4cf17797fb2da2" width="300" height="250" />
            {
              (categories.length === 0) ? 
              <p>No result found</p> 
              : 
              (!isRelatedItemsLoaded) ?
              <Spinner animation="border" variant="success" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              :
              <Row className="g-2 listing-items">
                {relatedItems.map(item => (
                  <Col xs="6" key={item.id}>
                    <Link to={"/download/"+item.slug}>
                      <Card className="text-white">
                        {/*<Card.Img src="/assets/images/blog.jpg" alt="Card image" width="350" height="350" className="object-cover" />*/}
                        <Card.Img src={typeof item.yoast_head_json.og_image != "undefined" ? item.yoast_head_json.og_image[0].url : ""} alt="Card image" width="350" height="350" className="object-cover" />
                        <Card.ImgOverlay className="d-flex flex-column justify-content-end bg-black-gradient">
                          <Card.Title as="p">{item.title.rendered}</Card.Title>
                        </Card.ImgOverlay>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}
