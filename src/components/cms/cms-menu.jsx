import React, { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "../../assets/images/tw/mobile-menu.svg";
import Config from "../../config.json";

const CMSMenu = () => {
  const [isMobileMenu, mobileMenuToggle] = useState(false);
  return (
    <React.Fragment>
      <img
        className="cms-mobilemenu-icon d-none"
        src={MobileMenu}
        onClick={() => mobileMenuToggle(!isMobileMenu ? true : false)}
      />
      <nav
        className={
          "d-flex align-items-center justify-content-end h-100 " +
          (isMobileMenu ? "cms-mobilemenu-show" : "")
        }
      >
        <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
          <li>
            <Link className="text-white" to="/">
              Home
            </Link>
          </li>

          {/* <li>
            <Link className="text-white ml-4" to="/">
              Marketplace Packages
            </Link>
          </li>

          <li>
            <Link className="text-white ml-4" to="/">
              Popular Deals
            </Link>
          </li>

          <li>
            <Link className="text-white ml-4" to="/">
              Special Packages
            </Link>
          </li> */}

          <li>
            <Link className="text-white ml-4" to="/about">
              About us
            </Link>
          </li>

          <li>
            <Link className="text-white ml-4" to="/contact">
              Contact us
            </Link>
          </li>

          <li>
            <Link className="text-white ml-4" to={Config.codebaseType !== "tourwiz-tripcenter" && Config.codebaseType !== "tourwiz-marketplace" ? "/login" : "/signin"} >
              Sign in
            </Link>
          </li>
          {Config.codebaseType === "tourwiz-tripcenter" && Config.codebaseType === "tourwiz-marketplace" && (
            <li>
              <Link className="text-white ml-4" to="/signup" >
                Agent signup
              </Link>
            </li>
          )}

        </ul>
      </nav>
    </React.Fragment>
  );
};

export default CMSMenu;
