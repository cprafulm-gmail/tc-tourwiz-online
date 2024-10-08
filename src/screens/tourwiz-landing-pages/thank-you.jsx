import React, { Component } from "react";
import SVGIcon from "../../helpers/svg-icon";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import { Helmet } from "react-helmet";
import { StickyContainer, Sticky } from "react-sticky";

class ThankYou extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;

    return (
      <div className="tw-public-pages tw-contact-page">
        <style>{css}</style>

        <Helmet>
          <title>Contact Us | TourWiz</title>
          <meta
            name="description"
            content="Get in touch with us for Product Queries, Demo Requests, Collaboration or General Inquiries"
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
                <h1>Get in Touch</h1>
                <h2>
                  If you’ve got questions about the product, pricing or anything
                  else, <br />
                  feel free to reach out to us. We are here to help!
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tw-contact-form">
                  <div className="bg-light rounded p-4 text-center">
                    <h3 className="text-primary mb-4 mt-2">
                      Your inquiry has been submitted successfully. We will get
                      in touch with you soon.
                    </h3>

                    <p>
                      If you have any other queries in the meantime, please
                      don't hesitate to get in touch with us at{" "}
                      <a
                        href="mailto:info@tourwizonline.com"
                        className="text-primary"
                      >
                        info@tourwizonline.com
                      </a>
                    </p>
                  </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="tw-contact-details">
                <h3>Other ways to reach us</h3>
                <h4>Mail</h4>
                <a href="mailto:info@tourwizonline.com" className="d-block">
                  <SVGIcon
                    name="envelope"
                    width="16"
                    height="16"
                    className="mr-2"
                  ></SVGIcon>
                  info@tourwizonline.com
                </a>
                <a href="mailto:sales@tourwizonline.com" className="d-block">
                  <SVGIcon
                    name="envelope"
                    width="16"
                    height="16"
                    className="mr-2"
                  ></SVGIcon>
                  sales@tourwizonline.com
                </a>
              </div>
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

export default ThankYou;
