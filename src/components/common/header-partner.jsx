import React from "react";
import { Link } from "react-router-dom";
import LoginMenu from "./login-menu-partner";
import Lang from "./lang";
import * as Global from "../../helpers/global";

const Header = (props) => {
  const quotationMode = true;

  const getLogoContent = () => {
    if (Global.getEnvironmetKeyValue("CMSWidgetURL", "cobrand")) {
      return (
        <a href={Global.getEnvironmetKeyValue("CMSWidgetURL", "cobrand")}>
          <h3 className="mb-0">
            <img
              src={Global.getEnvironmetKeyValue("portalLogo")}
              alt={Global.getEnvironmetKeyValue("portalName")}
              title={Global.getEnvironmetKeyValue("portalName")}
              style={{ height: "40px" }}
            />
          </h3>
        </a>
      );
    } else
      return (
        <Link to="/" className="logo">
          <h3 className="mb-0">
            <img
              src={Global.getEnvironmetKeyValue("portalLogo")}
              alt={Global.getEnvironmetKeyValue("portalName")}
              title={Global.getEnvironmetKeyValue("portalName")}
              style={{ height: "40px" }}
            />
          </h3>
        </Link>
      );
  };
  return (
    <header className="border-bottom">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-3 pt-3 pb-3">{getLogoContent()}</div>
          <div className="col-9">
            {!quotationMode && <Lang {...props} />}

            <LoginMenu {...props}></LoginMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
