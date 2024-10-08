import React from "react";
import { Link } from "react-router-dom";
import LoginMenu from "./login-menu";
import Lang from "./lang";
import * as Global from "../../helpers/global";

const Header = (props) => {
  const quotationMode = false;

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
        <div className='row'>
          <div className='col-lg-12'>
            <div class="d-flex flex-row justify-content-between  pt-3 pb-3 w-100">
              <div>{getLogoContent()}</div>
              {(props.isCustomerHeader && window.innerWidth >= 768) && <div><h3 className="text-primary">Customer Self Service Portal</h3></div>}
              <div>
                {!quotationMode && <Lang {...props} />}
                <LoginMenu {...props}></LoginMenu>
              </div>
            </div>
            {(props.isCustomerHeader && window.innerWidth <= 768) && <div className="d-flex flex-row justify-content-center w-100"><h6 className="text-primary">Customer Self Service Portal</h6></div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
