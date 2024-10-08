import React, { Component } from "react";
import { cmsConfig } from "../../helpers/cms-config";
import { apiRequesterCMS } from "../../services/requester-cms";
import { decode } from "html-entities";
import CMSPageTitle from "../../components/cms/cms-page-title";
import Loader from "../../components/common/loader";
import HtmlParser from "../../helpers/html-parser";
import Config from "../../config.json";
import CMSCopyrights from "../../components/cms/AF-005/cms-copywrite";

class CMSTerms extends Component {
  state = {
    ...cmsConfig,
    result: "",
    isLoading: true,
  };

  getPage = () => {
    const { siteurl } = this.state;
    let reqOBJ = {};
    let reqURL =
      "cms/htmlmodule?" +
      siteurl +
      "&modulename=Terms and Conditions&culturecode=en-us";
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
      <React.Fragment>
        <div>
          <CMSPageTitle title="Terms of Use, Privacy Policy" icon="list-ul" />

          {!isLoading && (
            <div
              className="container mt-4 mb-5"
              style={{ minHeight: "calc(100vh - 284px)", maxWidth: "1140px" }}
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

        {Config.codebaseType === "tourwiz-tripcenter" && !this.props.userInfo && <CMSCopyrights {...this.state} {...this.props} />}
      </React.Fragment>
    );
  }
}

export default CMSTerms;
