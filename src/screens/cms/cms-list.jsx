import React, { Component } from "react";
import "../../assets/css/cp-template-1.css";
import CMSPageTitle from "../../components/cms/cms-page-title";
import { apiRequesterCMS } from "../../services/requester-cms";
import CMSDeals from "../../components/cms/cms-deals";
import CMSPackages from "../../components/cms/cms-packages";
import { cmsConfig } from "../../helpers/cms-config";

class CMSList extends Component {
  state = {
    ...cmsConfig,
    deals: [],
    packages: [],
    locations: [],
  };

  getDeals = () => {
    const { siteurl } = this.state;

    let reqOBJ = {};
    let reqURL = "cms/deals?" + siteurl + "&pagenumber=1&pagesize=100";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({ deals: data?.response || [] });
      },
      "GET"
    );
  };

  getPackages = () => {
    const { siteurl } = this.state;

    let reqOBJ = {};
    let reqURL = "cms/packages?" + siteurl + "&pagenumber=1&pagesize=100";
    apiRequesterCMS(
      reqURL,
      reqOBJ,
      (data) => {
        this.setState({ packages: data?.response || [] });
      },
      "GET"
    );
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getDeals();
    this.getPackages();
  }

  render() {
    return (
      <div className="cm-pages cms-list">
        <CMSPageTitle title="Popular Deals" icon="user-friends" />
        <CMSDeals {...this.state} {...this.props} />
        <CMSPackages {...this.state} {...this.props} />
      </div>
    );
  }
}

export default CMSList;
