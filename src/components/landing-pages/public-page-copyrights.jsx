import React from "react";
import SocialMediaFacebook from "../../assets/images/tw/social-media-facebook.png";
import SocialMediaInstagram from "../../assets/images/tw/social-media-instagram.png";
import SocialMediaLinkedin from "../../assets/images/tw/social-media-linkedin.png";
import SocialMediaTwitter from "../../assets/images/tw/social-media-twitter.png";
import SocialMediaTwitterAct from "../../assets/images/tw/social-media-twitter-act.png";
import { Link } from "react-router-dom";

const PublicPageCopyrights = () => {
  return (
    <div className="tw-copyrights">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex align-items-center justify-content-center">
            <div>
              Copyright 2021-2023 by{" "}
              <Link className="tw-copyrights-link" to="/">
                TourWiz
              </Link>{" "}
              |{" "}
              <Link to="/terms-of-use" target="_blank">
                Terms of Use
              </Link>
              ,{" "}
              <Link to="/terms-of-use" target="_blank">
                Privacy Policy
              </Link>
              , &{" "}
              <Link to="/terms-of-use" target="_blank">
                Other Policies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPageCopyrights;
