import React from "react";
import TwLogo from "../../assets/images/tw/tw-logo-white.svg";
import SocialMediaFacebookWhite from "../../assets/images/tw/social-media-facebook-white.png";
import SocialMediaInstagramWhite from "../../assets/images/tw/social-media-instagram-white.png";
import SocialMediaLinkedinWhite from "../../assets/images/tw/social-media-linkedin-white.png";
import SocialMediaTwitterWhite from "../../assets/images/tw/social-media-twitter-white.png";
import SocialMediaWhatsappWhite from "../../assets/images/tw/social-media-whatsapp-white.png";
import { Link } from "react-router-dom";

const PublicPageFooter = () => {
  return (
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
                Affordable online solution for travel professionals that
                replaces spreadsheets to simplify itinerary building, customer
                management, accounting reconciliation & reporting
              </p>
            </div>
          </div>
          <div className="col-lg-4 d-flex align-items-center">
            <div className="d-flex footer-menu">
              <ul className="d-inline-block list-unstyled p-0 m-0 mr-5">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/contact-us">Contact</Link>
                </li>
              </ul>

              <ul className="d-inline-block list-unstyled p-0 m-0 ml-5">
                <li>
                  <Link to="/signin">Sign in</Link>
                </li>
                <li>
                  <Link to="/signup">Sign up</Link>
                </li>
                {/* <li>
                  <Link to="/pricing/faq">FAQs</Link>
                </li>
                <li>
                  <Link to="/partner-offers">Partner Offers</Link>
                </li> */}
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
                <a href="mailto:partners@tourwizonline.com">
                  partners@tourwizonline.com
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
                <a href={window.innerWidth <= 768 ? "https://wa.me/918976997100" : "https://web.whatsapp.com/send?phone=+918976997100"}
                  target="_blank"
                  className="shadow-sm">
                  <img src={SocialMediaWhatsappWhite} alt="Whatsapp" />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCtoC64GHCOCfYyeElj-6mNw"
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
  );
};

export default PublicPageFooter;
