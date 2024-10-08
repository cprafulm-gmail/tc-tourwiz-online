import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as BrowserRouterLink } from "react-router-dom";
import CustomerLogo from "../../../assets/images/customer-portal/customer-logo-white.png";
import "../../../assets/css/cp-template-1.css";
import SocialMediaFacebookWhite from "../../../assets/images/tw/social-media-facebook-white.png";
import SocialMediaInstagramWhite from "../../../assets/images/tw/social-media-instagram-white.png";
import SocialMediaLinkedinWhite from "../../../assets/images/tw/social-media-linkedin-white.png";
import SocialMediaTwitterWhite from "../../../assets/images/tw/social-media-twitter-white.png";
import Slider1 from "../../../assets/images/customer-portal/template-images/slider-1.png";
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
import { useState } from "react";
import ModelPopup from "../../../helpers/model";
import { Helmet } from "react-helmet";

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

  const { userInfo } = props;

  const companyLogo = userInfo?.provider?.logo?.url;
  const companyName = userInfo?.provider?.name;
  const isLogoUploaded =
    companyLogo ===
      "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/default.png"
      ? false
      : true;

  return (
    <div className="cm-pages">
      <style>{css}</style>
      <Helmet>
        <title>
          Tourwiz-Template 1
        </title>
      </Helmet>
      <BrowserRouterLink to={"/signup"} className="btn btn-sm btn-primary shadow-lg floatButton p-2">
        Click here to get this website
      </BrowserRouterLink>
      <div className="cp-header d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-center">
              <Link to="/Template1">
                <h3 className="text-capitalize mt-3 mb-4 text-white font-weight-bold d-flex align-items-center">
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
                  "d-flex align-items-center justify-content-end h-100"
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-white" to="/Template1">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template1">
                      About us
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template1">
                      Popular Deals
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template1">
                      Special Packages
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template1">
                      Contact us
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template1">
                      Sign in
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template1">
                      Sign up
                    </Link>
                  </li>
                </ul>
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
          <div className="row">
            <div className="col-lg-3">
              <h5 className="font-weight-bold">Browse</h5>
              <p>Look through our search window to find attractive prices.</p>
            </div>
            <div className="col-lg-3">
              <h5 className="font-weight-bold">Select</h5>
              <p>Make your plan by exploring best prices we offer.</p>
            </div>
            <div className="col-lg-3">
              <h5 className="font-weight-bold">Book</h5>
              <p>Immediately book your Itinerary and get confirmation.</p>
            </div>
            <div className="col-lg-3">
              <h5 className="font-weight-bold">Manage Bookings</h5>
              <p>Update plans with no change or cancel fees.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-deals">
        <div className="container">
          <h2 className="mb-4 font-weight-bold text-white">Popular Deals</h2>
          <div className="row">
            <div className="col-lg-4">
              <div className="bg-white shadow">
                <img class="img-fluid" src={Deal1} alt="" />
                <div className="p-4">
                  <h5 className="font-weight-bold mb-3">
                    Classic Dubai Special
                    <span className="text-primary pull-right">{`INR 25000`}</span>
                  </h5>
                  <p className="small text-secondary mb-0">
                    From deserts to lush greenery, pure gold to aromatic
                    spices, cops in lamborghinis to locals riding with pet big
                    cats...
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white shadow">
                <img class="img-fluid" src={Deal2} alt="" />
                <div className="p-4">
                  <h5 className="font-weight-bold mb-3">
                    New York Special
                    <span className="text-primary pull-right">{`INR 24500`}</span>
                  </h5>
                  <p className="small text-secondary mb-0">
                    The state of New York is known as the Empire State, and
                    with good reason. As one of the original thirteen...
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white shadow">
                <img class="img-fluid" src={Deal3} alt="" />
                <div className="p-4">
                  <h5 className="font-weight-bold mb-3">
                    Singapore Delight{" "}
                    <span className="text-primary pull-right">{`INR 24000`}</span>
                  </h5>
                  <p className="small text-secondary mb-0">
                    World’s only island city-state, Singapore welcomes you
                    with an outdoor nature trail, swimming pool, movie
                    theater...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-packages">
        <div className="container">
          <h2 className="mb-4 font-weight-bold text-white">
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
      <div className="cp-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div>
                <Link to="/Template1">
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

                <p className="text-secondary mt-4">
                  Affordable online solution for travel professionals that
                  replaces spreadsheets to simplify itinerary building,
                  customer management, accounting reconciliation & reporting
                </p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="d-flex footer-menu">
                <ul className="d-inline-block list-unstyled p-0 m-0 mr-5">
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      Popular Deals
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      Special Packages
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      Contact us
                    </Link>
                  </li>
                </ul>

                <ul className="d-inline-block list-unstyled p-0 m-0 ml-5">
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-secondary mb-2 d-block"
                      to="/Template1"
                    >
                      Sign up
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3">
              <div>
                <div>
                  <b className="d-block text-secondary mb-2">Mail</b>
                  <a
                    className="d-block text-secondary mb-1"
                    href="mailto:info@yourdomain.com"
                  >
                    info@yourdomain.com
                  </a>
                  <a
                    className="d-block text-secondary"
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
                <Link to="/Template1">{"Company Name"}</Link> |{" "}
                <Link to="/Template1">Terms of Use | Privacy Policy</Link>
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
