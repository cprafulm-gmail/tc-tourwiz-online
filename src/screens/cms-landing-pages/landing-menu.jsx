import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import Config from "../../config.json";
import { apiRequesterCMS } from "../../services/requester-cms";

class LandingMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      result: [],
      isMobileMenu: false,
    };
  }

  handleMobileMenu = () => {
    this.setState({ isMobileMenu: !this.state.isMobileMenu });
  };

  componentDidMount() {

    !localStorage.getItem("menu") && this.getAgentList();
    //this.getAgentList();
  }
  getAgentList() {
    let reqOBJ = {};

    let reqURL = `cms/portal/menu?siteurl=${Config.CMSPortalURL != undefined ? Config.CMSPortalURL.replace(/^http:\/\//i, '').replace(/^https:\/\//i, '') : ""}`;
    this.setState({ isLoading: true });
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.error) {
          data.response = [];
        }
        if (data.response.length > 0) {

          localStorage.setItem("menu", JSON.stringify(data.response));
          this.setState({ result: data.response, isLoading: false });
        } else {
          this.setState({ result: [], isLoading: false });
        }
      }.bind(this),
      "GET"
    );
  }

  render() {
    const { result, isLoading } = this.state;
    const resultMenu = JSON.parse(localStorage.getItem("menu"));
    return (
      <React.Fragment>
        <div className="container position-relative landing-menu-web">
          <div
            className="landing-pg-menu bg-white position-absolute d-flex align-items-center"
            style={{ top: "-56px", right: "16px", height: "42px" }}
          >
            {/* <a className="text-secondary text-decoration-none ml-4" href="/#">
              Home cms
            </a> */}
            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/"
              rel="noopener noreferrer"
            >
              Home cms
            </Link>
            {resultMenu &&
              resultMenu.length > 0 &&
              resultMenu.map((data, key) => {
                return (
                  data.tabName !== "Home" &&
                  data.tabName !== "About Us" &&
                  data.tabName !== "Contact Us" && (
                    <a
                      className="text-secondary text-decoration-none ml-4"
                      href={"/#" + data.tabPath.replace("//", "/")}
                      key={key}
                    >
                      {data.tabName}
                    </a>
                  )
                );
              })}
            {/* <a
              className="text-secondary text-decoration-none ml-4"
              href="/#/about"
            >
              About Us
            </a> */}
            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/about"
              rel="noopener noreferrer"
            >
              About Us
            </Link>

            {/* <a
              className="text-secondary text-decoration-none ml-4"
              href="/#/features"
            >
              Features
            </a> */}

            {/* <a
              className="text-secondary text-decoration-none ml-4"
              href="/#/contact"
            >
              Contact Us
            </a> */}
            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/contact"
              rel="noopener noreferrer"
            >
              Contact Us
            </Link>

            {/* <a
              className="text-secondary text-decoration-none ml-4"
              href="/#/terms-conditions"
            >
              Terms
            </a> */}
            <Link
              className="text-secondary text-decoration-none ml-4"
              to="/terms-conditions"
              rel="noopener noreferrer"
            >
              Terms
            </Link>

            {/* {!this.props.loginscreen && (
              <React.Fragment>
                <a className="btn btn-outline-primary ml-3" href="/#/login">
                  Sign up
                </a>

                <a className="btn btn-primary ml-3" href="/#/login">
                  Sign in
                </a>
              </React.Fragment>
            )} */}
          </div>
        </div>

        <div className=" landing-menu-mobile">
          <div
            className="position-absolute d-flex"
            style={{ right: "16px", top: "18px" }}
          >
            {/* <a className="btn btn-primary ml-3" href="/#/login">
              Sign in
            </a> */}
            <Link
              className="btn btn-primary ml-3"
              to="/login"
              rel="noopener noreferrer"
            >
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
                  {/* <a
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    href="/#/"
                  >
                    Home
                  </a> */}
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    to="/"
                    rel="noopener noreferrer"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  {/* <a
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    href="/#/about-us"
                  >
                    About Us
                  </a> */}
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    to="/about-us"
                    rel="noopener noreferrer"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  {/* <a
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    href="/#/features"
                  >
                    Features
                  </a> */}
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block border-bottom"
                    to="/features"
                    rel="noopener noreferrer"
                  >
                    Features
                  </Link>
                </li>

                <li>
                  {/* <a
                    className="text-secondary text-decoration-none p-3 d-block"
                    href="/#/contact-us"
                  >
                    Contact Us
                  </a> */}
                  <Link
                    className="text-secondary text-decoration-none p-3 d-block"
                    to="/contact-us"
                    rel="noopener noreferrer"
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
