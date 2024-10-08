import React from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import { Link } from "react-router-dom";
import Config from "../../config.json";

const Footer = () => {
  var copyRightsText = Global.getEnvironmetKeyValue("poweredby", "cobrand");
  let content = copyRightsText
    ? Trans("_copyRightsByText") + copyRightsText
    : Trans("_copyRightsText");
  return (
    <footer className="border-top mt-4 bg-white">
      <div className="container">
        <div className="d-flex justify-content-center pt-0">
          <p className="small mt-3 mb-3">{content}</p>
          <span className="small  mt-3 mb-3 ml-2 mr-2"> | </span>
          {/* <a
            href="#/terms-of-use"
            target="_blank"
            className="small text-secondary"
          >
            Terms of Use, Privacy Policy, & Other Policies
          </a> */}
          <Link
            className="small text-secondary mt-3 mb-3"
            to={Config.codebaseType !== "tourwiz-tripcenter" ? "/terms-of-use" : "/terms"}
            target={Config.codebaseType !== "tourwiz-tripcenter" ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            Terms of Use, Privacy Policy, & Other Policies
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
