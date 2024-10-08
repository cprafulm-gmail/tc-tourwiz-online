import React, { Component } from "react";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import { Helmet } from "react-helmet";
import fixedDeals from "../../assets/templates/fixed-deals";
import HtmlParser from "../../helpers/html-parser";
import { StickyContainer, Sticky } from "react-sticky";
import { Link } from "react-router-dom";

class StaticDeals extends Component {
  state = {};

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;
    return (
      <div className="tw-public-pages tw-offers-page">
        <style>{css}</style>

        <Helmet>
          <title>Partner Offers</title>
          <meta
            name="description"
            content="Get access to amazing deals from our trusted partners when you
            sign up"
          />
        </Helmet>

        <StickyContainer>

<Sticky>
      {({ style }) => (<div
          className={
            "hight-z-index mod-search-area" 
          }
          style={{ ...style, transform: "inherit" }}
        >
<PublicPageHeader />
</div>
)}
</Sticky>

        <div className="tw-common-banner">
          <img className="tw-common-banner-img" src={PricingBgImage} alt="" />
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1>Partner Offers</h1>
                <h2>
                  Get access to amazing deals from our trusted partners when you
                  sign up
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ul className="list-unstyled tw-offers-info">
                  <li>
                    When you join TourWiz, you get instant access to exclusive
                    partner deals on flights, hotels, activities, transfers,
                    packages and more
                  </li>
                  <li>
                  These deals will be accessible from the offers section inside the product and updated regularly
                  </li>
                  <li>
                    So{" "}
                    <Link to="/signup" className="text-primary">
                      sign up today
                    </Link>{" "}
                    to take advantage of these offers!
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <h4 className="text-primary text-center mb-3">Sample Offers</h4>
              </div>
              <React.Fragment>
                {fixedDeals.map((item, index) => {
                  return (
                    <div className="col-lg-4">
                      <div
                        className="mb-4 card tw-offers-card shadow border-0"
                        key={index}
                      >
                        <div className="card-header">
                          <h6 className="m-0 p-0">{item.advertiseName}</h6>
                        </div>
                        <div className="card-body">
                          <p className="card-text">
                            {item.advertiseDescription}
                          </p>

                          {item.type === "Web_HTML" && (
                            <HtmlParser text={item.htmlContent} />
                          )}
                        </div>
                        {item.type === "Web_Image" && (
                          <a target="_blank" href={item?.detailsUrl ?? "#"}>
                            <img className="w-100" src={item.imageUrl} />
                          </a>
                        )}
                        <button
                          className="btn btn-primary tw-offers-card-btn"
                          onClick={() => this.props.history.push(`/signup`)}
                        >
                          Sign up to get access
                        </button>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            </div>
          </div>
        </div>
        <PublicPageFindus />
        <PublicPageWherewe />
        <PublicPageClients />
        <PublicPageFooter />
        <PublicPageCopyrights />
        </StickyContainer>
      </div>
    );
  }
}

export default StaticDeals;
