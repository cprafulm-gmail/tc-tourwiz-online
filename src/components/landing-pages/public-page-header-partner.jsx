import React, { Component } from "react";
import TwLogo from "../../assets/images/tw/tw-logo-white.svg";
import MobileMenu from "../../assets/images/tw/mobile-menu.svg";
import { Link } from "react-router-dom";

class PublicPageHeader extends Component {
  state = { isMobileMenu: false };

  mobileMenuToggle = () => {
    this.setState({ isMobileMenu: !this.state.isMobileMenu });
  };

  render() {
    const { isMobileMenu } = this.state;
    const css = `
    @media (max-width: 768px){
    .tw-public-pages.tw-home .tw-header {
        background: linear-gradient(to right, #fa7438 0%, #891d9b 100%) !important;
        margin-bottom: 1px;
    }
  }`;
    return (
      <div className="tw-header">
        {window.innerWidth <= 768 && (<style>{css}</style>)}
        <div className="container">
          <div className="pt-4 pb-4">
            <div className="row">
              <div className="col-lg-2 d-flex align-items-center">
                <Link to="/">
                  <img
                    className="header-logo"
                    src={TwLogo}
                    alt="TourWiz"
                    height="46px"
                  />
                </Link>
              </div>

              <div className="col-lg-10">
                <img
                  className="tw-mobilemenu-icon d-none"
                  src={MobileMenu}
                  onClick={this.mobileMenuToggle}
                />
                <nav
                  className={
                    "d-flex align-items-center justify-content-end h-100 " +
                    (isMobileMenu ? "tw-mobilemenu-show" : "")
                  }
                >
                  <ul className="list-unstyled p-0 m-0 d-flex align-items-center"><li>
                    <Link className="text-white ml-5" to="/">
                      Home
                    </Link>
                  </li>
                    <li>
                      <Link className="text-white ml-5" to="/contact-us">
                        Contact us
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-5" to="/signin">
                        Sign in
                      </Link>
                    </li>

                    <li>
                      <Link className="btn btn-primary ml-5" to="/signup">
                        Register as Partner
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PublicPageHeader;
