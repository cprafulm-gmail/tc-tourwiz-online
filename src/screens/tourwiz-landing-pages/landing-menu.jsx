import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import { Link } from "react-router-dom";

class LandingMenu extends Component {
  state = { isMobileMenu: false };

  handleMobileMenu = () => {
    this.setState({ isMobileMenu: !this.state.isMobileMenu });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container position-relative landing-menu-web">
          <div
            className="landing-pg-menu bg-white position-absolute d-flex align-items-center"
            style={{ top: "-56px", right: "16px", height: "42px" }}
          >
            <Link className="text-secondary text-decoration-none ml-4" to="/">
              Home
            </Link>

            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/about-us"
            >
              About Us
            </Link>

            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/features"
            >
              Features
            </Link>

            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/contact-us"
            >
              Contact Us
            </Link>

            {!this.props.loginscreen && (
              <React.Fragment>
                <Link className="btn btn-outline-primary ml-3" to="/login">
                  Sign up
                </Link>

                <Link className="btn btn-primary ml-3" to="/login">
                  Sign in
                </Link>
              </React.Fragment>
            )}
          </div>
        </div>

        <div className=" landing-menu-mobile">
          <div
            className="position-absolute d-flex"
            style={{ right: "16px", top: "18px" }}
          >
            <Link className="btn btn-primary ml-3" to="/login">
              Sign in
            </Link>

            <button
              className="btn btn-primary ml-3 p-0 text-center pl-2 pr-2"
              onClick={this.handleMobileMenu}
            >
              <SVGIcon
                name="list-ul"
                width="24"
                height="24"
                style={{ marginTop: "5px" }}
              ></SVGIcon>
            </button>
          </div>

          {this.state.isMobileMenu && (
            <div
              className="bg-white position-absolute pt-1 shadow w-50 rounded"
              style={{ right: "16px", top: "72px", zIndex: "100" }}
            >
              <ul className="list-unstyled">
                <li>
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    to="/"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    to="/about-us"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    to="/features"
                  >
                    Features
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block"
                    to="/contact-us"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default LandingMenu;
