import React, { Component } from "react";
import TwLogo from "../../assets/images/tw/tw-logo-white.svg";
import MobileMenu from "../../assets/images/tw/mobile-menu.svg";
import HomeIcon from "../../assets/images/dashboard/home.png";
import { Link } from "react-router-dom";

class PublicPageHeader extends Component {
  state = {
    isMobileMenu: false,
    isShowGoToTop: document.documentElement.scrollTop > 300,
    isShowSolutionsFor: false,
    isShowMarketPlaceFor: false,
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
    const { isMobileMenu, isShowGoToTop, isShowSolutionsFor, isShowMarketPlaceFor } = this.state;
    window.addEventListener('scroll', this.stickyScroll);

    const css = `
    @media (max-width: 768px){
    .tw-public-pages.tw-home .tw-header {
        background: linear-gradient(to right, #fa7438 0%, #891d9b 100%) !important;
    }
  }`;
    const submenuCSS = `

    ul.submenu {
      position: absolute;
      padding-top:5px !important;
      border-top: 40px;
       border-bottom-left-radius: 10px 10px;
       border-bottom-right-radius: 10px 10px;
       z-index:100;
    }
    @media (max-width: 768px) {
      
    ul.submenu {
      position: relative;
      padding-top: 5px !important;
      border-top: 40px;
      border-bottom-left-radius: 10px 10px;
      border-bottom-right-radius: 10px 10px;
      z-index: 100;
      margin: 0px !important;
      padding: 0px !important;
      box-shadow: none !important;
    }
    ul.submenu li {
      padding: 0px !important;
      box-shadow: none !important;
    }
    
    ul.submenu li a {
    }
  }

    ul.submenu:after {
    position: absolute;
    top: -5px;
    left: 10px;
    content: "";
    width: 0px;
    height: 0px;
    font-size: 0px;
    line-height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid rgb(255, 255, 255);
}`;
    var styleValur = window.innerWidth <= 768 ? isShowGoToTop ? { background: "linear-gradient(to right, #fa7438 0%, #891d9b 100%)" } : { background: "inherit" } : { background: "linear-gradient(to right, #fa7438 0%, #891d9b 100%)" };
    return (
      <div className="tw-header">
        <style>{submenuCSS}</style>
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
                    <li>
                      <Link className="text-white ml-4" to="/">
                        {window.innerWidth <= 768 ? "Home" : (<img
                          style={{ filter: "none", marginTop: "-8px" }}
                          src={HomeIcon}
                          alt=""
                        />)}
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4 d-none" to="/about-us">
                        About us
                      </Link>
                    </li>

                    <li>
                      <Link className="text-white ml-4" to="/features/all-features">
                        Features
                      </Link>
                    </li>



                    <li>
                      <Link className="text-white ml-4" to="/b2b-market-place">
                        Marketplace
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white ml-4" to="/tourwizAI">
                        TourwizAI
                      </Link>
                    </li>
                    {/* <li className="menu" onClick={() => this.setState({ isShowMarketPlaceFor: true })} onMouseOver={() => this.setState({ isShowMarketPlaceFor: true })} onMouseLeave={() => this.setState({ isShowMarketPlaceFor: false })}>
                      {window.innerWidth > 768 && <Link className="text-white ml-4 "
                        onClick={() => this.setState({ isShowMarketPlaceFor: false })}
                        onMouseOver={() => this.setState({ isShowMarketPlaceFor: true })}>
                        Marketplace
                      </Link>
                      }
                      {(isShowMarketPlaceFor || window.innerWidth <= 768) &&
                        <ul className="submenu list-unstyled ml-4 pt-4 align-items-center"
                        >
                          <li className=" pl-3 pr-3 pt-2 pb-1 shadow bg-white bg-light">
                            <Link className="text-secondary mt-1  w-100" to="/b2b-market-place-partner" onClick={() => this.setState({ isShowMarketPlaceFor: true })}>
                              Content Partners
                            </Link>
                          </li>

                          <li className=" pl-3 pr-3  pt-1 pb-1  shadow bg-white bg-light">
                            <Link className="text-secondary mt-1  w-100" to="/b2b-market-place" onClick={() => this.setState({ isShowMarketPlaceFor: true })}>
                              Tourwiz Subscribers
                            </Link>
                          </li>
                        </ul>
                      }
                    </li> */}

                    {/* <li>
                      <Link className="text-white ml-4" to="/partner-offers">
                        Deals
                      </Link>
                    </li> */}

                    {/* <li>
                      <Link className="text-white ml-4 d-none" to="/contact-us">
                        Contact us
                      </Link>
                    </li> */}
                    <li className="menu" onClick={() => this.setState({ isShowSolutionsFor: true })} onMouseOver={() => this.setState({ isShowSolutionsFor: true })} onMouseLeave={() => this.setState({ isShowSolutionsFor: false })}>
                      {window.innerWidth > 768 && <Link className="text-white ml-4 "
                        onClick={() => this.setState({ isShowSolutionsFor: false })}
                        onMouseOver={() => this.setState({ isShowSolutionsFor: true })}>
                        Solutions For
                      </Link>
                      }
                      {(isShowSolutionsFor || window.innerWidth <= 768) &&
                        <ul className="submenu list-unstyled ml-4 pt-4 align-items-center"
                        >
                          <li className=" pl-3 pr-3 pt-2 pb-1 shadow bg-white bg-light">
                            <Link className="text-secondary mt-1  w-100" to="/travel-agents" onClick={() => this.setState({ isShowSolutionsFor: true })}>
                              Travel Agents
                            </Link>
                          </li>

                          <li className=" pl-3 pr-3  pt-1 pb-1  shadow bg-white bg-light">
                            <Link className="text-secondary mt-1  w-100" to="/tour-operator" onClick={() => this.setState({ isShowSolutionsFor: true })}>
                              DMC's + Tour Operators
                            </Link>
                          </li>

                          <li className=" pl-3 pr-3  pt-1 pb-2  shadow bg-white bg-light">
                            <Link className="text-secondary mt-1  w-100" to="/content-partners" onClick={() => this.setState({ isShowSolutionsFor: true })}>
                              Content Partners
                            </Link>
                          </li>
                        </ul>
                      }
                    </li>

                    <li>
                      <Link className="text-white ml-4" target={"_blank"} to="/blog">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white ml-4" to="/pricing">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white ml-4" to="/signin">
                        Sign in
                      </Link>
                    </li>

                    <li>
                      <Link className="btn btn-primary ml-4" to="/signup">
                        Start Free
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
