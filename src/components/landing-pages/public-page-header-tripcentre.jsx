import React, { Component } from "react";
import TwLogo from "../../assets/images/tw/tripcentre_white.png";
import MobileMenu from "../../assets/images/tw/mobile-menu.svg";
import HomeIcon from "../../assets/images/dashboard/home.png";
import { Link } from "react-router-dom";

class PublicPageHeader extends Component {
  state = {
    isMobileMenu: false,
    isShowGoToTop: document.documentElement.scrollTop > 300
  };

  mobileMenuToggle = () => {
    this.setState({ isMobileMenu: !this.state.isMobileMenu });
  };
  stickyScroll = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 50) {
      this.setState({ isShowGoToTop: true });
    }
    else if (scrolled <= 50) {
      this.setState({ isShowGoToTop: false });
    }
  }

  render() {
    const { isMobileMenu, isShowGoToTop } = this.state;
    window.addEventListener('scroll', this.stickyScroll);

    const css = `
    @media (max-width: 768px){
    .tw-public-pages.tw-home .tw-header {
        background: linear-gradient(to right, #fa7438 0%, #891d9b 100%) !important;
    }
  }`;
    var styleValur = window.innerWidth <= 768 ? isShowGoToTop ? { background: "linear-gradient(to right, #fa7438 0%, #891d9b 100%)" } : { background: "inherit" } : { background: "linear-gradient(to right, #fa7438 0%, #891d9b 100%)" };
    return (
      <div className="tw-header">
        {window.innerWidth <= 768 && isShowGoToTop && (<style>{css}</style>)}
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
                  <ul className="list-unstyled p-0 m-0 d-flex align-items-center">
                    {/* <li>
                      <Link className="text-white ml-4" to="/">
                        {window.innerWidth <= 768 ? "Home" : (<img
                          style={{ filter: "none", marginTop: "-8px" }}
                          src={HomeIcon}
                          alt=""
                        />)}
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/about-us">
                        About us
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/features">
                        Features
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/pricing">
                        Pricing
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/partner-offers">
                        Deals
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/contact-us">
                        Contact us
                      </Link>
                    </li>

                    <li>
                      <a className="text-white ml-4" target="_blank" href="https://blog.tourwizonline.com">
                        Blog
                      </a>
                    </li> */}

                    <li>
                      <Link className="text-white ml-4" to="/signin">
                        Sign in
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/signup">
                        Sign Up
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
