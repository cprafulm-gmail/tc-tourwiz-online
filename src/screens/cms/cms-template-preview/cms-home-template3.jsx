import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Link as BrowserRouterLink } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-darkblue.png";
import CustomerLogoWhite from "../../../assets/images/customer-portal/customer-logo-white.png";
import "../../../assets/css/cp-template-1.css";
import SocialMediaFacebookWhite from "../../../assets/images/tw/social-media-facebook-white.png";
import SocialMediaInstagramWhite from "../../../assets/images/tw/social-media-instagram-white.png";
import SocialMediaLinkedinWhite from "../../../assets/images/tw/social-media-linkedin-white.png";
import SocialMediaTwitterWhite from "../../../assets/images/tw/social-media-twitter-white.png";
import Slider1 from "../../../assets/images/customer-portal/template-images/parallax1.jpg";
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
import ModelPopup from "../../../helpers/model";
import { useEffect } from "react";
import { useState } from "react";

const CMSHome = (props) => {
  const [logoName, setLogoName] = useState("Your Logo");
  const [isShowPopup, setIsShowPopup] = useState(true);
  useEffect(() => { setIsShowPopup(true) }, [])
  const css = `
  header, footer {
      display: none;
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
  `;
  const cssInner = `
  
/* Why Us Starts */
.why-us-bg {background:#fff; overflow:hidden;}
.why-us-shw {background:#fff; overflow:hidden; padding:40px 0px;}
.why-us {text - align:left;}
.why-us h2 {font - size:2.4em; font-weight:400; text-align:center; font-family: 'Rokkitt', serif;}
.why-us h4 {font - size:1.5em; font-weight:bold; margin:10px 0px 30px 0px;}
.why-us h5 {font - size:1.5em; font-weight:bold; margin:0px 0px 20px 50px; float:left; color:#da2a3a; text-transform:uppercase;}
.why-us p {font - size:1.3em; text-align:center; line-height:1.4; font-weight:300;}
.why-us .why-us-details {margin - top:30px; clear:both; width:100%; display: flex;}
.why-us .why-us-details div {background:#fff; width:33.33%; padding:30px 20px; float:left; box-sizing:border-box; position:relative;}
.why-us .why-us-details div:nth-child(2) {margin:0px 0px;}
.why-us .why-us-details div i {width:32px; height:32px; color:#404855; font-size:2.6666em; position:absolute; top:26px; left:20px;}
.why-us .why-us-details a {display: inline-block; display: none; font-weight: 400; margin-top: 15px; text-decoration:none;}
.why-us .why-us-details div p {color:#07253f; clear:both; text-align:left; font-size:1.0em; line-height:1.6;}
.why-us .why-us-details a:hover {color:#f9676b;}
.why-us .why-us-details a i {float:right; position:static; width:auto; height:auto; font-size:14px; border:solid 1px #666; border-radius:50%; margin-left:10px;}
.why-us .why-us-details a i:before{content:"keyboard_arrow_right"; }`;

  const { userInfo } = props;

  const companyLogo = userInfo?.provider?.logo?.url;
  const companyName = userInfo?.provider?.name;
  const isLogoUploaded =
    companyLogo ===
      "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/default.png"
      ? false
      : true;

  return (
    <div className="AF-002 cm-pages">
      <style>{css}</style>
      <BrowserRouterLink to={"/signup"} className="btn btn-sm btn-primary shadow-lg floatButton p-2">
        Click here to get this website
      </BrowserRouterLink>
      <div className="cp-header d-flex align-items-center border bg-white shadow">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-center sfdf">
              <Link to="/Template3">
                <h3 className="text-capitalize mt-3 mb-4 text-black-50 font-weight-bold d-flex align-items-center">
                  <img
                    className="header-logo mr-3"
                    src={CustomerLogo}
                    alt="TourWiz"
                    height="48px"
                  />
                  {logoName || "Your Logo"}
                </h3>
              </Link>
            </div>
            <div className="col-lg-8">

              <nav
                className={
                  "d-flex align-items-start justify-content-end pt-2 pb-2 w-100 h-50 "
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-black-50" to="/Template3">
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
                    <Link className="text-black-50 ml-4" to="/Template3">
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
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <SVGIcon
                      name="phone"
                      className="mr-2 "
                      width="15"
                      height="15"
                    ></SVGIcon>
                    +91 987 654 3210
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-header-menu d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <nav
                className={
                  "d-flex align-items-end justify-content-start pt-3 pb-3 h-100 "
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-white" to="/Template3">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template3">
                      About us
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template3">
                      Contact us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="cp-home-slider">
            <div className="d-flex align-items-start mt-5 justify-content-center">
              <div className="text-center">
                <h2 className="mt-5">Explore the World with Us</h2>
                <button className="btn btn-lg btn-primary mt-4 shadow">
                  Sign In to Learn More
                </button>
              </div>
            </div>
            <img src={Slider1} alt="" />
          </div>
        </div>
      </div>
      <div className="cp-home-deals">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="bg-white shadow populer-deals">
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    Classic Dubai Special
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      From deserts to lush greenery, pure gold to aromatic
                      spices, cops in lamborghinis to locals riding with pet big
                      cats...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="m-3 d-block" to="/Template3">
                      <SVGIcon
                        name="chevron-right"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                    </Link>
                  </div>
                </div>
                <div className="clo-lg-12 d-block">
                  <img className="img-fluid" src={Deal1} alt="" />
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="bg-white shadow populer-deals">
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    New York Special
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      The state of New York is known as the Empire State, and
                      with good reason. As one of the original thirteen...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="m-3 d-block" to="/Template3">
                      <SVGIcon
                        name="chevron-right"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                    </Link>
                  </div>
                </div>
                <div className="clo-lg-12 d-block">
                  <img className="img-fluid" src={Deal2} alt="" />
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="bg-white shadow populer-deals">
                <div className="p-4 populer-deals-content">
                  <h5 className="font-weight-bold mb-3">
                    Singapore Delight
                  </h5>
                  <div className="clo-lg-12 d-block">
                    <p className="small text-secondary mb-0">
                      World’s only island city-state, Singapore welcomes you
                      with an outdoor nature trail, swimming pool, movie
                      theater...
                    </p>
                  </div>
                  <div className="clo-lg-12 mt-2 mb-2 d-block font-weight-bold">
                    Price
                    <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                      {`INR 25000`}
                    </span>
                    <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                      {`INR 24000`}
                    </span>
                  </div>
                  <div className="clo-lg-12 d-block">
                    <Link className="m-3 d-block" to="/Template3">
                      <SVGIcon
                        name="chevron-right"
                        className="mr-2 "
                        width="15"
                        height="15"
                      ></SVGIcon>
                    </Link>
                  </div>
                </div>
                <div className="clo-lg-12 d-block">
                  <img className="img-fluid" src={Deal3} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-why-us">
        <div className="container">
          <div className="why-us">
            <style>{cssInner}</style>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <div>
              <h2>WHY CHOOSE US?</h2>
              <p>We also strive to provide as much flexibility and choice as we possibly can, making it simple
                for you to experience a very different holiday. Our thoughtful team of knowledgeable experts
                are here to take care of every need, from the second you contact us to when you return.
              </p>
            </div>
            <div className="why-us-details">
              <div>
                <i className="material-icons">search</i>
                <h5>Handpicked Tour</h5>
                <p>Explore our hand-picked multi-day tours and discover the beauty and diversity of Australia.
                  From sandy beaches, to the remote outback, or our vibrant bustling cities these packages have it all.
                </p>
                <a href="/Template3" target="_blank">KNOW MORE </a>
              </div>
              <div>
                <i className="material-icons">thumb_up</i>
                <h5>Dedicated Support</h5>
                <p>Deliver the support your business travellers need, wherever they are in the world. From the
                  moment a reservation is made until their return home, we provide business travellers with
                  24/7/365 support. They’ll get one-click/one-call support when they need it from our team of
                  business travel agents who know exactly what your travellers want and how to get it for them
                  quickly, smoothly and in policy.</p>
                <a href="/Template3" target="_blank">KNOW MORE </a>
              </div>
              <div>
                <i className="material-icons">shopping_cart</i>
                <h5>Lowest Price</h5>
                <p>That’s Right! You have access to outstanding quality content at Super Low Prices.
                  We find out what you think might make it extra special, then sprinkle in our own
                  special little touches ( even a surprise to enjoy while you're away) to help create
                  your dream holiday.</p>
                <a href="/Template3" target="_blank">KNOW MORE </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-packages">
        <div className="container">
          <div className="col-lg-12 p-0 mb-5 d-flex justify-content-center align-items-center flex-column">
            <h1 className="mb-4 font-weight-bold text-white">OUR PACKAGES</h1>
            <h3 className="mb-4 text-white font-italic">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil</h3>
          </div>
          <div className="row mb-5">
            <div className="col-lg-4 d-flex align-items-start justify-content-center">
              <div className="bg-white shadow rounded-circle border">
                <img className="img-fluid rounded-circle border" src={Package1} alt="" />
                {/* <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                    Singapore and Bali Fusion 6N/7D
                  </h5> */}
              </div>
            </div>

            <div className="col-lg-4 d-flex align-items-start justify-content-center">
              <div className="bg-white shadow rounded-circle border">
                <img className="img-fluid rounded-circle border" src={Package2} alt="" />
                {/* <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                    USA East Coast 5N/5D
                  </h5> */}
              </div>
            </div>

            <div className="col-lg-4 d-flex align-items-start justify-content-center">
              <div className="bg-white shadow rounded-circle border">
                <img className="img-fluid rounded-circle border" src={Package3} alt="" />
                {/* <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                    Australia New Zealand
                  </h5> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-locations">
        <div className="cp-home-locations-wrap">
          <div>
            <img className="img-fluid" src={Location1} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              South America
            </h5>
          </div>
          <div>
            <img className="img-fluid" src={Location2} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              Europe
            </h5>
          </div>
          <div>
            <img className="img-fluid" src={Location3} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              Asia
            </h5>
          </div>
          <div>
            <img className="img-fluid" src={Location4} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              America
            </h5>
          </div>
          <div>
            <img className="img-fluid" src={Location5} alt="" />
            <h5 className="p-2 font-weight-bold text-center text-white position-relative">
              Africa
            </h5>
          </div>
        </div>
      </div>
      <div className="cp-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 text-center" style={{ backgroundColor: "#da2a3a" }}>
              <div>
                <Link to="/Template3">
                  <h3 className="text-capitalize mt-3 mb-4 text-white font-weight-bold align-items-center" style={{ textAlign: "center" }}>
                    <img
                      className="header-logo mr-3"
                      src={CustomerLogoWhite}
                      alt="TourWiz"
                      height="48px"
                    />
                    {"Your Logo"}
                  </h3>
                </Link>

                <p className="mt-4 text-white" style={{ textAlign: "center" }}>
                  Affordable online solution for travel professionals that
                  replaces spreadsheets to simplify itinerary building,
                  customer management, accounting reconciliation & reporting
                </p>
              </div>
            </div>

            <div className="col-lg-5" style={{ visibility: "hidden" }}>
              <div className="d-flex footer-menu">
                <ul className="d-inline-block list-unstyled p-0 m-0 mr-5">
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      Popular Deals
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      Special Packages
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>

                <ul className="d-inline-block list-unstyled p-0 m-0 ml-5">
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template3"
                    >
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 mt-5">
              <div>
                <div>
                  <b className="d-block text-white mb-2">CONNECT WITH US</b>
                  <a
                    className="d-block text-white mb-1"
                    href="mailto:info@yourdomain.com"
                  >
                    info@yourdomain.com
                  </a>
                  <a
                    className="d-block text-white"
                    href="mailto:sales@yourdomain.com"
                  >
                    sales@yourdomain.com
                  </a>
                </div>

                <div className="footer-socialicons">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaFacebookWhite} alt="Facebook" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaTwitterWhite} alt="Twitter" />
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaLinkedinWhite} alt="Linkedin" />
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaInstagramWhite} alt="Instagram" />
                  </a>
                </div>
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
                <Link to="/Template3">{"Company Name"}</Link> |{" "}
                <Link to="/Template3">Terms of Use | Privacy Policy</Link>
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
