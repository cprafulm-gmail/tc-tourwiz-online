import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Link as BrowserRouterLink } from "react-router-dom";
import CustomerLogoDark from "../../../assets/images/customer-portal/customer-logo-darkblue.png";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-white.png";
import "../../../assets/css/cp-template-1.css";
import SocialMediaFacebookWhite from "../../../assets/images/tw/social-media-facebook-white.png";
import SocialMediaInstagramWhite from "../../../assets/images/tw/social-media-instagram-white.png";
import SocialMediaLinkedinWhite from "../../../assets/images/tw/social-media-linkedin-white.png";
import SocialMediaTwitterWhite from "../../../assets/images/tw/social-media-twitter-white.png";
import Slider1 from "../../../assets/images/customer-portal/template-images/template-1-slide-image.jpg";
import Deal1 from "../../../assets/images/customer-portal/template-images/deal-1.png";
import Deal2 from "../../../assets/images/customer-portal/template-images/deal-2.png";
import Deal3 from "../../../assets/images/customer-portal/template-images/deal-3.png";
import Package1 from "../../../assets/images/customer-portal/template-images/package-1.png";
import Package2 from "../../../assets/images/customer-portal/template-images/package-2.png";
import Package3 from "../../../assets/images/customer-portal/template-images/package-3.png";
import Location1 from "../../../assets/images/customer-portal/template-images/location-1.png";
import Location2 from "../../../assets/images/customer-portal/template-images/location-2.png";
import Location3 from "../../../assets/images/customer-portal/template-images/location-3.png";
import Location4 from "../../../assets/images/customer-portal/template-images/location-4.png";
import Location5 from "../../../assets/images/customer-portal/template-images/location-5.png";
import SVGIcon from "../../../helpers/svg-icon";
import { useState } from "react";
import { useEffect } from "react";
import ModelPopup from "../../../helpers/model";



const CMSHome = (props) => {
  const [logoName, setLogoName] = useState("Your Logo");
  const [isShowPopup, setIsShowPopup] = useState(true);
  useEffect(() => { setIsShowPopup(true) }, [])

  const css = `
  header, footer {
      display: none;
  }
  .AF-003.cm-pages div.cp-header {
    background: none !important;
    box-shadow: none !important;
    border: none !important;
}
.floatButton{
  background-color:#de4a4a !important;
  border:none !important;
    position: fixed !important;
    top:540px !important;
    z-index: 99;
    left: 30px;
    font-size:20px;
}

/* Why Us Starts */
.why-us-bg * { box-sizing:border-box;}
.why-us-bg { box-sizing:border-box; background: #ffffff; width: 100%; float: left; clear: both;}
.why-us-shw { overflow:hidden; padding:40px 0px;}
.why-us { text-align:left;}
.why-us h2 { font-size:1.6em; font-weight:400; text-align:center; background:#fff; padding:20px 0px; border-top:solid 7px #f0f0e8;}
.why-us h4 { font-size:1.5em; font-weight:bold; margin:10px 0px 30px 0px;}
.why-us h5 {font-size: 1.7em;font-weight:500;margin: 6px 0px 8px 0px;float:left;color:#de4a4a;}
.why-us p { font-size:1.3em; text-align:center; line-height:1.4; font-weight:300;}
.why-us .why-us-details { clear:both; width:100%; float:left;}
.why-us .why-us-details > div { width:30%; padding:0px; float:left; box-sizing:border-box; position:relative; margin-bottom:20px; margin-right:5%;}
.why-us .why-us-details > div:nth-child(3n+3) { margin-right:0px;}
.why-us .why-us-details > div figure { float:left; width:34%; overflow:hidden;}
.why-us .why-us-details > div figure img { width:100%; transition: all 0.5s ease; -webkit-transition: all 0.5s ease;}
.why-us .why-us-details > div figure:hover img { transform: scale(1.2); -webkit-transform: scale(1.2); -ms-transform: scale(1.2); -moz-transform: scale(1.2); -o-transform: scale(1.2); }
.why-us .why-us-details > div div { float:left; width:100%; padding:0px 0px 0px 70px; margin:0px;}
.why-us .why-us-details > div i { width:50px; height:50px; color:#fff; font-size:2.2em; position:absolute; top:0px; left:0px; background:#41CCD5; border-radius:50%; text-align:center; line-height:50px;}
.why-us .why-us-details a { display: inline-block; font-weight: 400; margin-top: 15px; text-decoration:none; display:none;}
.why-us .why-us-details > div p { color:#8b8b8b; clear:both; text-align:left; font-size:1.0em; line-height:22px; text-align:justify;}
.why-us .why-us-details a:hover { color:#f9676b;}
.why-us .why-us-details a i { float:right; position:static; width:auto; height:auto; font-size:14px; border:solid 1px #666; border-radius:50%; margin-left:10px;}
.why-us .why-us-details a i:before{ content:"keyboard_arrow_right"; }
.why-us-links { margin-top:35px; text-align:center; clear:both;}
.why-us-links a { display:inline-block; font-size:1.07692em; font-weight:700; text-decoration:none; color:#fff; background:#41ccd5; border-radius:3px; height:48px; line-height:48px; padding:0px 40px; margin-right:30px; border:solid 1px #41ccd5;}
.why-us-links a:last-child { color:#444444; background:#f8f8f8; background:linear-gradient(to bottom, #ffffff, #eeeeee); border:solid 1px #cdcfd1;}
.why-us-links a:hover { transition: background 0.3s ease; background:#de4a4a; color:#fff; border:solid 1px #de4a4a;}
`;

  const { userInfo } = props;

  const companyLogo = userInfo?.provider?.logo?.url;
  const companyName = userInfo?.provider?.name;
  const isLogoUploaded =
    companyLogo ===
      "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/default.png"
      ? false
      : true;

  return (
    <div className="AF-003 cm-pages">
      <style>{css}</style>
      <BrowserRouterLink to={"/signup"} className="btn btn-sm btn-primary shadow-lg floatButton p-2">
        Click here to get this website
      </BrowserRouterLink>
      <div className="cp-header d-flex align-items-center">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
            <div className="col-lg-3 d-flex align-items-center dsad">
              <Link to="/Template2">
                <h3 className="text-capitalize mt-3 mb-4 text-black-50 font-weight-bold d-flex align-items-center">
                  <img
                    className="header-logo mr-3"
                    src={CustomerLogoDark}
                    alt="TourWiz"
                    height="48px"
                  />
                  {logoName || "Your Logo"}
                </h3>
              </Link>
            </div>
            <div className="col-lg-6">
              <nav
                className={
                  "d-flex align-items-center justify-content-end h-100 "
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-white" to="/Template2">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template2">
                      About us
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template2">
                      Contact us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3">

              <nav
                className={
                  "d-flex align-items-start justify-content-end pt-2 pb-2 w-100 h-50 "
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-black-50" to="/Template2">
                      <SVGIcon
                        name="sign-in"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                      Sign in
                    </Link>
                  </li>

                  <li>
                    <Link className="text-black-50 ml-4" to="/Template2">
                      <SVGIcon
                        name="sign-up"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                      Sign up
                    </Link>
                  </li>
                </ul>
              </nav>

              <nav
                className={
                  "d-flex align-items-end justify-content-end pt-2 w-100 pb-2 h-50 "
                }
              >
                <div class="footer-socialicons">
                  <a href="https://www.facebook.com" target="_blank" class="shadow-sm">
                    <img src="https://images.yourtripplans.com/cms/images/social-facebook.png" alt="Facebook" />
                  </a>
                  <a href="https://twitter.com" target="_blank" class="shadow-sm">
                    <img src="https://images.yourtripplans.com/cms/images/social-twitter.png" alt="Twitter" />
                  </a>
                  <a href="https://www.linkedin.com" target="_blank" class="shadow-sm">
                    <img src="https://images.yourtripplans.com/cms/images/social-linkedin.png" alt="Linkedin" />
                  </a>
                  <a href="https://www.instagram.com" target="_blank" class="shadow-sm">
                    <img src="https://images.yourtripplans.com/cms/images/social-instagram.png" alt="Instagram" />
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-slider">
        <div className="d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h2>Explore the World with Us</h2>
            {/* <button className="btn btn-lg btn-primary mt-4 shadow">
              Sign In to Learn More
            </button> */}
          </div>
        </div>
        <img src={Slider1} alt="" />
      </div>
      <div className="cp-home-why-us">
        <div className="container">
          <div class="why-us"><div class="why-us-details">
            <div>
              <div>
                <i class="material-icons">search</i>
                <h5>Handpicked Tour</h5>
                <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id
                  quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                </p>
                <a href="/Template2" target="_blank">KNOW MORE </a>
              </div>
            </div>
            <div>
              <div>
                <i class="material-icons">thumb_up</i>
                <h5>Dedicated Support</h5>
                <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                  minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
                <a href="/Template2" target="_blank">KNOW MORE </a>
              </div>
            </div>
            <div>
              <div>
                <i class="material-icons">shopping_cart</i>
                <h5>Lowest Price</h5>
                <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
                  maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
                <a href="/Template2" target="_blank">KNOW MORE </a>
              </div>
            </div>
          </div>
            <div class="why-us-links">
              <a href="/Template2" target="_blank">View More</a>
              <a href="/Template2" target="_blank">Contact Us</a>
            </div>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          </div>
        </div>
      </div>
      <div className="cp-home-deals">
        <div className="container">
          <div className="row">

            <div className="col-lg-3 mb-4">
              <div className="bg-white populer-deals">
                <div className="clo-lg-12 d-block border border-3 border-white">
                  <img
                    class="img-fluid"
                    src={Deal1}
                    alt={"Classic Dubai Special"}
                  />
                </div>
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    <Link to={"/Template2"}>
                      Classic Dubai Special
                    </Link>
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      From deserts to lush greenery, pure gold to aromatic
                      spices, cops in lamborghinis to locals riding with pet big
                      cats...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold price">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow" to={"/Template2"}>More
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mb-4">
              <div className="bg-white populer-deals">
                <div className="clo-lg-12 d-block border border-3 border-white">
                  <img
                    class="img-fluid"
                    src={Deal2}
                    alt={"New York Special"}
                  />
                </div>
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    <Link to={"/Template2"}>New York Special
                    </Link>
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      The state of New York is known as the Empire State, and
                      with good reason. As one of the original thirteen...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold price">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow" to={"/Template2"}>More
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mb-4">
              <div className="bg-white populer-deals">
                <div className="clo-lg-12 d-block border border-3 border-white">
                  <img
                    class="img-fluid"
                    src={Deal3}
                    alt={"Singapore Delight"}
                  />
                </div>
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    <Link to={"/Template2"}>Singapore Delight
                    </Link>
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      World’s only island city-state, Singapore welcomes you
                      with an outdoor nature trail, swimming pool, movie
                      theater...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold price">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow" to={"/Template2"}>More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mb-4">
              <div className="bg-white populer-deals">
                <div className="clo-lg-12 d-block border border-3 border-white">
                  <img
                    class="img-fluid"
                    src={Deal1}
                    alt={"Classic Dubai Special"}
                  />
                </div>
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    <Link to={"/Template2"}>
                      Classic Dubai Special
                    </Link>
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      From deserts to lush greenery, pure gold to aromatic
                      spices, cops in lamborghinis to locals riding with pet big
                      cats...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold price">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="btn btn-lg btn-primary mt-1 pt-1 pb-1 shadow" to={"/Template2"}>More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-packages">
        <div className="container">
          <h2 className="mb-4 font-weight-bold mb-4 font-weight-bold text-black-50">
            Special Packages
          </h2>
          <div className="row">
            <div className="col-lg-4">
              <div className="bg-white shadow">
                <img class="img-fluid" src={Package1} alt="" />
                <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                  Singapore and Bali Fusion 6N/7D
                </h5>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white shadow">
                <img class="img-fluid" src={Package2} alt="" />
                <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                  USA East Coast 5N/5D
                </h5>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white shadow">
                <img class="img-fluid" src={Package3} alt="" />
                <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                  Australia New Zealand
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-locations">
        <div className="cp-home-locations-wrap">
          <div>
            <img class="img-fluid" src={Location1} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              South America
            </h5>
          </div>
          <div>
            <img class="img-fluid" src={Location2} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              Europe
            </h5>
          </div>
          <div>
            <img class="img-fluid" src={Location3} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              Asia
            </h5>
          </div>
          <div>
            <img class="img-fluid" src={Location4} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              America
            </h5>
          </div>
          <div>
            <img class="img-fluid" src={Location5} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              Africa
            </h5>
          </div>
        </div>
      </div>
      <div className="cp-footer AF-003">
        <div className="container">
          <div className="row border-bottom">
            <div className="col-lg-12">
              <div>
                <Link to="/Template2">
                  <h3 className="text-capitalize mt-3 mb-4 text-white font-weight-bold d-flex align-items-center">
                    <img
                      className="header-logo mr-3"
                      src={CustomerLogo}
                      alt="TourWiz"
                      height="48px"
                    />
                    {"Your Logo"}
                  </h3>
                </Link>
              </div>

              <div className="address-link text-secondary mt-4 mb-4">
                <ul className="d-inline">
                  <li className="mr-4">
                    <SVGIcon
                      name="map-marker"
                      width="16"
                      height="16"
                      className="mr-2"
                    ></SVGIcon>
                    {"Gundecha Onclave Kherani Road, Sakinaka, Andheri East, Mumbai, Maharashtra 400072"}</li>
                  <li className="mr-4">
                    <SVGIcon
                      name="phone"
                      width="16"
                      height="16"
                      className="mr-2"
                    ></SVGIcon>
                    {"089769 97102"}</li>
                  <li className="mr-4">
                    <SVGIcon
                      name="envelope"
                      width="16"
                      height="16"
                      className="mr-2"
                    ></SVGIcon>
                    <a
                      href={"mailto:info@tourwizonline.com"}
                      className="d-inline text-primary"
                    >
                      {"info@tourwizonline.com"}
                    </a>
                  </li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-copyrights">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 d-flex align-items-center justify-content-center">
              <div>
                Copyright 2021-2023 by{" "}
                <Link to="/Template2">{"Company Name"}</Link> |{" "}
                <Link to="/Template2">Terms of Use | Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isShowPopup && <ModelPopup
        sizeClass={"modal-sm"}
        header={"Your Company Name"}
        content={
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <input type="text"
                      name={"txtCompanyName"}
                      id={"txtCompanyName"}
                      className="form-control "
                      minLength="2"
                      maxLength="20"
                      value={logoName}
                      onChange={(e) => { setLogoName(e.target.value) }}
                    /></div>
                </div>
              </div>
              <div className="col-lg-12">
                <label htmlFor={"bookNoOfPax"}>&nbsp;</label>
                <button
                  onClick={() => setIsShowPopup(false)}
                  className="btn btn-primary w-100 text-capitalize"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        }
        handleHide={() => setIsShowPopup(false)}
      />}
    </div>
  );
}

export default CMSHome;
