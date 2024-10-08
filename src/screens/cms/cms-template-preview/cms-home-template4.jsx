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
import Slider1 from "../../../assets/images/customer-portal/template-images/template-3-slide-image-new.png";
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
import { useEffect } from "react";
import { useState } from "react";
import ModelPopup from "../../../helpers/model";

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
  
/* How Works Starts */
.how-works-bg { background:#fff; overflow:hidden; padding:50px 0px; clear:both;}
.how-works { text-align:center; 
display: inline-block;}
.how-works h2 { font-size:2.5em; font-weight:800;}
.how-works h4 { font-size:1.5em; font-weight:bold; margin:10px 0px 30px 0px;}
.how-works h5 { font-size:1.2em; font-weight:800; margin:20px 0px 0px 0px;}
.how-works p { font-size:1.2em; text-align:center; line-height:2;}
.how-works .how-works-step { margin-top:30px; clear:both; width:100%; float:left;}
.how-works .how-works-step div { width:33.33%; padding:0px 30px; float:left; box-sizing:border-box;}
.how-works .how-works-step div i { background:#f9676b; width:80px; height:80px; border-radius:50%; color:#fff; font-size:3.5em; line-height:80px;}
@media (max-width:479px)
{	
.how-works .how-works-step div { width:100%; padding:0px 0px 30px 0px;}
}`;

  const { userInfo } = props;

  const companyLogo = userInfo?.provider?.logo?.url;
  const companyName = userInfo?.provider?.name;
  const isLogoUploaded =
    companyLogo ===
      "https://tc-appdata.s3.us-east-2.amazonaws.com/tourwiz/media/default.png"
      ? false
      : true;

  return (
    <div className="AF-001 cm-pages">
      <style>{css}</style>
      <BrowserRouterLink to={"/signup"} className="btn btn-sm btn-primary shadow-lg floatButton p-2">
        Click here to get this website
      </BrowserRouterLink>
      <div className="cp-header-menu d-flex align-items-center ">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
            <div className="col-lg-6"><nav
              className={
                "d-flex align-items-start justify-content-start pt-2 pb-2 w-100 h-50"
              }
            >
              <span className="mr-3">
                <SVGIcon
                  name="phone"
                  className="mr-2 "
                  width="15"
                  height="15"
                ></SVGIcon>
                {"089769 97102"}</span>

              <span>
                <SVGIcon
                  name="envelope"
                  className="mr-2 "
                  width="15"
                  height="15"
                ></SVGIcon>
                {"info@tourwizonline.com"}
              </span>
            </nav>
            </div>
            <div className="col-lg-6"><nav
              className={
                "d-flex align-items-start justify-content-end pt-2 pb-2 w-100 h-50 "
              }
            >
              <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                <li>
                  <Link className="text-black-50" to="/Template4">
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
                  <Link className="text-black-50 ml-4" to="/Template4">
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
            </div>
          </div>
        </div>
      </div>
      <div className="cp-header d-flex align-items-center border bg-white shadow">
        {/* Test Comment */}
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-center sfdf">
              <Link to="/Template4">
                <h3 className="text-capitalize mt-3 mb-3 text-black-50 font-weight-bold d-flex align-items-center">
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
            <div className="col-lg-8">
              <nav
                className={
                  "d-flex align-items-center justify-content-end h-100 "
                }
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-white" to="/Template4">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="text-white ml-4" to="/Template4">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link className="text-white ml-4" to="/Template4">
                      Contact us
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
      <div className="cp-home-deals">
        <div className="container">
          <h1 className="mb-4 font-weight-bold text-whiste text-center mb-0 text-uppercase">Hot Deals</h1>
          <h3 className="mb-4 font-weight-bold text-whiste text-center mb-5 text-uppercase">Show More</h3>
          <div className="row">
            <div className=" col-lg-6 p-0">
              <div className="col-lg-12 hotdeals-item mb-3 pb-3">
                <div className="bg-white populer-deals">
                  <div className="col-lg-4 pull-left p-0">
                    <img
                      class="img-fluid"
                      src={Deal1}
                      alt={"Classic Dubai Special"}
                    />
                  </div>
                  <div className="p-0 col-lg-8 pull-left populer-deals-content">
                    <h5 className="col-lg-12 font-weight-bold mb-2 pr-0">
                      <Link to={"/Template4"}>
                        {"Classic Dubai Special"}
                      </Link>
                    </h5>
                    <div className="col-lg-12 pull-left d-inline pr-0">
                      <div className="col-lg-9 p-0 pull-left d-inline">
                        <p className="small text-secondary mb-0">
                          {"From deserts to lush greenery, pure gold to aromatic spices, cops in lamborghinis to locals riding with pet big cats..."}
                        </p>
                      </div>
                      <div className="p-0 col-lg-3  pull-left populer-deals-content">
                        <div className="col-lg-12 mt-2 p-0 mb-2 d-inline font-weight-bold price">

                          <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                            {`INR 25000`}
                          </span>
                          <br />
                          <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                            {`INR 24000`}
                          </span>
                        </div>
                        <div className="col-lg-12 pull-left d-inline">
                          <Link className="btn btn-lg btn-primary mt-1 pt-0 pb-0 shadow" to={"/Template4"}>More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 hotdeals-item mb-3 pb-3">
                <div className="bg-white populer-deals">
                  <div className="col-lg-4 pull-left p-0">
                    <img
                      class="img-fluid"
                      src={Deal2}
                      alt={"New York Special"}
                    />
                  </div>
                  <div className="p-0 col-lg-8 pull-left populer-deals-content">
                    <h5 className="col-lg-12 font-weight-bold mb-2 pr-0">
                      <Link to={"/Template4"}>
                        {"New York Special"}
                      </Link>
                    </h5>
                    <div className="col-lg-12 pull-left d-inline pr-0">
                      <div className="col-lg-9 p-0 pull-left d-inline">
                        <p className="small text-secondary mb-0">
                          {"The state of New York is known as the Empire State, and with good reason. As one of the original thirteen..."}
                        </p>
                      </div>
                      <div className="p-0 col-lg-3  pull-left populer-deals-content">
                        <div className="col-lg-12 mt-2 p-0 mb-2 d-inline font-weight-bold price">

                          <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                            {`INR 25000`}
                          </span>
                          <br />
                          <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                            {`INR 24000`}
                          </span>
                        </div>
                        <div className="col-lg-12 pull-left d-inline">
                          <Link className="btn btn-lg btn-primary mt-1 pt-0 pb-0 shadow" to={"/Template4"}>More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 hotdeals-item mb-3 pb-3">
                <div className="bg-white populer-deals">
                  <div className="col-lg-4 pull-left p-0">
                    <img
                      class="img-fluid"
                      src={Deal3}
                      alt={"Singapore Delight"}
                    />
                  </div>
                  <div className="p-0 col-lg-8 pull-left populer-deals-content">
                    <h5 className="col-lg-12 font-weight-bold mb-2 pr-0">
                      <Link to={"/Template4"}>
                        {"Singapore Delight"}
                      </Link>
                    </h5>
                    <div className="col-lg-12 pull-left d-inline pr-0">
                      <div className="col-lg-9 p-0 pull-left d-inline">
                        <p className="small text-secondary mb-0">
                          {"World’s only island city-state, Singapore welcomes you with an outdoor nature trail, swimming pool, movie theater..."}
                        </p>
                      </div>
                      <div className="p-0 col-lg-3  pull-left populer-deals-content">
                        <div className="col-lg-12 mt-2 p-0 mb-2 d-inline font-weight-bold price">

                          <span className="text-white ml-3" style={{ textDecoration: 'line-through' }}>
                            {`INR 25000`}
                          </span>
                          <br />
                          <span className="text-white ml-3 " style={{ marginLeft: '.5rem' }}>
                            {`INR 24000`}
                          </span>
                        </div>
                        <div className="col-lg-12 pull-left d-inline">
                          <Link className="btn btn-lg btn-primary mt-1 pt-0 pb-0 shadow" to={"/Template4"}>More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-lg-6 p-0">

              <div className="cp-home-locations">
                <div className="cp-home-locations-wrap col-lg-12">
                  <div className="col-lg-6 pl-3 pr-3 pb-4">
                    <div className="col-lg-12 p-0 cp-home-location-content overflow-hidden">
                      <Link to={"/Template4"}>
                        <img
                          class="img-fluid"
                          src={Location1}
                          alt={"South America"}
                        />
                        <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                          {"South America"}
                        </h5>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-6 pl-3 pr-3 pb-4">
                    <div className="col-lg-12 p-0 cp-home-location-content overflow-hidden">
                      <Link to={"/Template4"}>
                        <img
                          class="img-fluid"
                          src={Location2}
                          alt={"Europe"}
                        />
                        <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                          {"Europe"}
                        </h5>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-6 pl-3 pr-3 pb-4">
                    <div className="col-lg-12 p-0 cp-home-location-content overflow-hidden">
                      <Link to={"/Template4"}>
                        <img
                          class="img-fluid"
                          src={Location4}
                          alt={"America"}
                        />
                        <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                          {"America"}
                        </h5>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-6 pl-3 pr-3 pb-4">
                    <div className="col-lg-12 p-0 cp-home-location-content overflow-hidden">
                      <Link to={"/Template4"}>
                        <img
                          class="img-fluid"
                          src={Location5}
                          alt={"Africa"}
                        />
                        <h5 className="p-2 font-weight-bold text-center text-white position-relative">
                          {"Africa"}
                        </h5>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-packages">
        <div className="container">
          <h1 className="mb-4 font-weight-bold text-center text-uppercase mb-0 text-white">Special Packages</h1>
          <h3 className="mb-4 font-weight-bold text-white text-center mb-5 text-uppercase">Show More</h3>

          <div className="row">
            <div className="col-lg-4 mb-4">
              <Link to={"/Template4"}>
                <div className="bg-white shadow overflow-hidden" style={{ border: "5px #fff solid" }}>
                  <img
                    class="img-fluid"
                    src={Package1}
                    alt={"Singapore and Bali Fusion 6N/7D"}
                  />
                  <h5 className="font-weight-bold text-center text-white position-relative">
                    {"Singapore and Bali Fusion 6N/7D"}
                  </h5>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mb-4">
              <Link to={"/Template4"}>
                <div className="bg-white shadow overflow-hidden" style={{ border: "5px #fff solid" }}>
                  <img
                    class="img-fluid"
                    src={Package2}
                    alt={"USA East Coast 5N/5D"}
                  />
                  <h5 className="font-weight-bold text-center text-white position-relative">
                    {"USA East Coast 5N/5D"}
                  </h5>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mb-4">
              <Link to={"/Template4"}>
                <div className="bg-white shadow overflow-hidden" style={{ border: "5px #fff solid" }}>
                  <img
                    class="img-fluid"
                    src={Package3}
                    alt={"Australia New Zealand"}
                  />
                  <h5 className="font-weight-bold text-center text-white position-relative">
                    {"Australia New Zealand"}
                  </h5>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="cp-home-why-us">
        <div className="container">
          <div class="how-works">
            <div>
              <h2>HOW IT WORKS?</h2>
              <h4>SEARCH - SELECT - BOOK</h4>
              <p>Our website is user friendly and informative. Simply search for what you
                are looking for, select, and book! If you don't find what you are looking
                for, simply email or give us a call, and we will be happy to help.
              </p>
            </div>
            <div class="how-works-step">
              <div>
                <i class="material-icons">search</i>
                <h5>SEARCH</h5>
                <p>Choose from thousands of hotel, car rental, and activity options.
                </p>
              </div>
              <div>
                <i class="material-icons">thumb_up</i>
                <h5>SELECT</h5>
                <p>Select the option that best suits your needs.</p>
              </div>
              <div>
                <i class="material-icons">shopping_cart</i>
                <h5>BOOK</h5>
                <p>Book your travel and receive confirmation.</p>
              </div>
            </div>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /></div>
        </div>
      </div>

      <div className="cp-home-newsletter">
        <div className="container">
          <div className="row"></div>
        </div>
      </div>
      <div className="cp-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-center sfdf">
              <Link to="/Template4">
                <h3 className="text-capitalize mt-3 mb-3 text-black-50 font-weight-bold d-flex align-items-center">
                  <img
                    className="header-logo mr-3"
                    src={CustomerLogoDark}
                    alt="TourWiz"
                    height="48px"
                  />
                  {"Your Logo"}
                </h3>
              </Link>
            </div>
            <div className="col-lg-8">
              <nav
                className={
                  "d-flex align-items-center justify-content-end h-100 "}
              >
                <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                  <li>
                    <Link className="text-white" to="/Template4">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template4">
                      About us
                    </Link>
                  </li>

                  <li>
                    <Link className="text-white ml-4" to="/Template4">
                      Contact us
                    </Link>
                  </li>
                </ul>
              </nav>
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
                <Link to="/Template4">{companyName}</Link> |{" "}
                <Link to="/Template4">Terms of Use | Privacy Policy</Link>
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
