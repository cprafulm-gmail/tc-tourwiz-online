import React, { Component } from "react";
import { cmsConfig } from "../../../helpers/cms-config";
import { apiRequesterCMS } from "../../../services/requester-cms";
import Testimonials from "../../../components/cms/AF-005/cms-testimonials";
import Loader from "../../../components/common/loader";
import HtmlParser from "../../../helpers/html-parser";
import { decode } from "html-entities";
import TeamPhoto1 from "../../../assets/images/tw/team-photo-1-swapnil-saha.png";
import TeamPhoto2 from "../../../assets/images/tw/team-photo-2-ashok-mistry.png";
import TeamPhoto3 from "../../../assets/images/tw/team-photo-3-amit-kadiya.png";
import TeamPhoto4 from "../../../assets/images/tw/team-photo-4-chintan-goswami.png";
import BannerImage from "../../../assets/images/customer-portal/template-images/AboutUs-Banner.png";
import CMSCopyrights from "../../../components/cms/AF-005/cms-copywrite";

class CMSAbout extends Component {
  state = {
    ...cmsConfig,
    result: "",
    socialContent: "",
    isLoading: true,
    testimonialsContent: ["<img src=" + TeamPhoto1 + " style=\"width:100%;\" alt=\"Team Photo 1\" />",
    "<img src=" + TeamPhoto2 + " style=\"width:100%;\" alt=\"Team Photo 2\" />",
    "<img src=" + TeamPhoto3 + " style=\"width:100%;\" alt=\"Team Photo 3\" />",
    "<img src=" + TeamPhoto4 + " style=\"width:100%;\" alt=\"Team Photo 4\" />"]
  };

  getPage = () => {
    const { siteurl } = this.state;
    let reqOBJ = {};
    let reqURL =
      "cms/htmlmodule?" + siteurl + "&modulename=about us&culturecode=en-us";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({
          result: (data?.response && data?.response[0]?.desktopHtml) || "",
          isLoading: false,
        });
      },
      "GET"
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getPage();
  }

  render() {
    const { result, isLoading } = this.state;
    return (
      <React.Fragment>
        <div style={{ background: "#eaeeee" }}>
          {/* <CMSPageTitle title="About Us" icon="user-friends" /> */}
          <div className="head-banner">
            <img className="head-banner-img" src={BannerImage} alt="" />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h1>ABOUT US</h1>
                  <h2>The Trip Centre is the best Travel & Tourism Company in India.The company serves people with world-class
                    services with national & international holiday packages, hotel bookings, VISA, transportation
                    and other travel solutions.</h2>
                </div>
              </div>
            </div>
          </div>
          {!isLoading && (
            <div
              className="container mt-4 mb-5"
              style={{ minHeight: "calc(100vh - 284px)" }}
            >
              <HtmlParser text={decode(result)} />
            </div>
          )}
          {/* <Testimonials Title="THE TEAM" SubTitle="MEET" {...this.state} {...this.props} /> */}

          {isLoading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
            >
              <Loader />
            </div>
          )}
        </div>
        <CMSCopyrights {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default CMSAbout;
