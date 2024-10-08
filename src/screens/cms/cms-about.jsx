import React, { Component } from "react";
import { cmsConfig } from "../../helpers/cms-config";
import { apiRequesterCMS } from "../../services/requester-cms";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import HtmlParser from "../../helpers/html-parser";
import { decode } from "html-entities";

class CMSAbout extends Component {
  state = {
    ...cmsConfig,
    result: "",
    isLoading: true,
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
    this.getPage();
  }

  render() {
    const { result, isLoading } = this.state;
    return (
      <div>
        <CMSPageTitle title="About Us" icon="user-friends" />

        {!isLoading && (
          <div
            className="container mt-4 mb-5"
            style={{ minHeight: "calc(100vh - 284px)" }}
          >
            <HtmlParser text={decode(result)} />
          </div>
        )}

        {isLoading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "calc(100vh - 228px)", opacity: ".5" }}
          >
            <Loader />
          </div>
        )}
      </div>
    );
  }
}

export default CMSAbout;
