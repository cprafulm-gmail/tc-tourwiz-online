import React from "react";
import TwLogo from "../../assets/images/tw/tw-logo-white.svg";
import SocialMediaFacebookWhite from "../../assets/images/tw/social-media-facebook-white.png";
import SocialMediaInstagramWhite from "../../assets/images/tw/social-media-instagram-white.png";
import SocialMediaLinkedinWhite from "../../assets/images/tw/social-media-linkedin-white.png";
import SocialMediaTwitterWhite from "../../assets/images/tw/social-media-twitter-white.png";
import SocialMediaWhatsappWhite from "../../assets/images/tw/social-media-whatsapp-white.png";
import SocialMediaYouTubeWhite from "../../assets/images/tw/social-media-youtube-white.png";
import TechPartner from "../../assets/images/landing-pg/Tech-Partner.png";
import PaymentPartners from "../../assets/images/landing-pg/Payment-Partners.png";
import { Link } from "react-router-dom";
import TechPartner1 from "../../assets/images/landing-pg/Tech-Partner1.png";

const css = `
.tw-partner span {  
  display: block;
  }
.tw-partner hr {  
  border-left: 1px solid #b3b1b1 !important;
  height: 70px;
  margin: 0px;
  align-self: center;
  flex-wrap: wrap;
  border-style: ridge;
}
@media (max-width: 768px){
.tw-partner img {
    display:block !important;
    margin: 0px auto;
    margin-bottom: 10px;
}
.tw-partner hr { 
  display: none;
}
.tw-partner span {  
  display: block !important;
  margin: 10px 0px 5px;
  font-size: 25px !important;
  padding-top: 0px;
}
.tw-partner span.partnerColon {
  display:none !important;
}

}`;
const PublicPageFooter = (props) => {
  return (
    <React.Fragment>
      <style>{css}</style>
      <div className="tw-partner" style={{ textAlign: "center", backgroundColor: "#fff" }}>
        <div className="container">
          {!props.trialAIMode && <div className="row justify-content-center">
            {/* <span style={{fontSize:"20px", opacity:"0.8"}}>
              Our Tech Partners
              <span className="partnerColon">: 
              </span> 
            </span>               */}
            <div className="col-lg-3 p-0 mt-1">
              <span style={{ fontSize: "20px", opacity: "0.8", fontWeight: "500" }}>
                Tech Partner
              </span>
              <img
                src={TechPartner} style={{ height: "60px" }} className="pt-2 pb-2 pl-3 pr-3"
                alt="TourWiz - Our Tech Partners" />
            </div>
            <hr />
            <div className="col-lg-4 p-0 mt-1">
              <span style={{ fontSize: "20px", opacity: "0.8", fontWeight: "500" }}>
                Payment Partners
              </span>
              <img
                src={PaymentPartners} style={{ height: "60px" }} className="pt-2 pb-2 pl-3 pr-3"
                alt="TourWiz - Our Payment Partners" />
            </div>
            <hr />
            <div className="col-lg-3 p-0 mt-1">
              <span style={{ fontSize: "20px", opacity: "0.8", fontWeight: "500" }}>
                Travel Association
              </span>
              <img
                src={TechPartner1} style={{ height: "60px" }} className="pt-2 pb-2 pl-3 pr-3"
                alt="TourWiz - Our Travel Association" />
            </div>
          </div>}
        </div>
      </div>
      <div className="tw-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div>
                <Link to="/">
                  <img
                    className="footer-logo"
                    src={TwLogo}
                    alt="TourWiz"
                    height="46px"
                  />
                </Link>
                <p>
                  Tourwiz is an all-in-one solution tool that manages your travel business by replacing spreadsheets and simplifying workflow.
                </p>
                <p>Packed full of helpful features, it is also user-friendly, transparent & affordable.
                </p>
              </div>
            </div>
            <div className="col-lg-4 d-flex align-items-center">
              <div className="d-flex footer-menu">
                <ul className="d-inline-block list-unstyled p-0 m-0 mr-1">
                  <li>
                    <Link to="/">Home</Link>
                  </li>

                  <li>
                    <Link to="/features/all-features">Features</Link>
                  </li>
                  <li>
                    <Link to="/b2b-market-place">
                      Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link to="/travel-agents">Travel Agents</Link>
                  </li>
                  <li>
                    <Link to="/tour-operator">DMC's + Tour Operators</Link>
                  </li>
                  <li>
                    <Link to="/content-partners">Content Partners</Link>
                  </li>
                  <li>
                    <Link to="/pricing">Pricing</Link>
                  </li>
                </ul>

                <ul className="d-inline-block list-unstyled p-0 m-0 ml-3">
                  <li>
                    <Link to="/signin">Sign in</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign up</Link>
                  </li>
                  <li>
                    <Link to="/pricing/faq">FAQs</Link>
                  </li>
                  <li>
                    <Link to="/partner-offers">Partner Offers</Link>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://partners.tourwizonline.com"
                    >
                      Become a Partner
                    </a>
                  </li>
                  <li>
                    <Link to="/about-us">About</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 d-flex align-items-center">
              <div>
                <div className="footer-contact">
                  <b>Mail</b>
                  <a href="mailto:info@tourwizonline.com">
                    info@tourwizonline.com
                  </a>
                  <a href="mailto:sales@tourwizonline.com">
                    sales@tourwizonline.com
                  </a>
                </div>

                <div className="footer-socialicons">
                  <a
                    href="https://www.facebook.com/TourWiz-101869248569536"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaFacebookWhite} alt="Facebook" />
                  </a>
                  <a
                    href="https://twitter.com/tourwizonline"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaTwitterWhite} alt="Twitter" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/tourwiz"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaLinkedinWhite} alt="Linkedin" />
                  </a>
                  <a
                    href="https://www.instagram.com/tourwiz"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaInstagramWhite} alt="Instagram" />
                  </a>
                  <a href={window.innerWidth <= 768 ? "https://wa.me/918976997102" : "https://web.whatsapp.com/send?phone=+918976997102"}
                    target="_blank"
                    className="shadow-sm">
                    <img src={SocialMediaWhatsappWhite} alt="Whatsapp" />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCtoC64GHCOCfYyeElj-6mNw"
                    target="_blank"
                    className="shadow-sm"
                  >
                    <img src={SocialMediaYouTubeWhite} alt="YouTude" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PublicPageFooter;
