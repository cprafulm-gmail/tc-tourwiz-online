import React, { Component } from "react";
import SVGIcon from "../helpers/svg-icon";
import { CMSPages } from "../helpers/cms-pages";

class StaticPages extends Component {
  state = { pageName: "", isLoading: true };

  setPageDate = () => {
    this.setState({
      pageName: this.props.match.params.pageName,
      isLoading: false,
    });
  };

  componentDidMount() {
    const pages = [];
    CMSPages.map((item) => pages.push(item.page));

    pages.includes(this.props.match.params.pageName)
      ? this.setPageDate()
      : this.props.history.push("/PageNotFound");
  }

  render() {
    const { isLoading } = this.state;
    const page = CMSPages.find((x) => x.page === this.props.match.params.pageName);

    return (
      <div className="bookings">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon name="list-ul" width="24" height="24" className="mr-3"></SVGIcon>
              {!isLoading && page.title}
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="mt-5">
            {!isLoading &&
              page.content.map((item, key) => {
                return (
                  <div key={key} className="mb-5">
                    <h5 className="text-primary mb-3">{item.subTitle}</h5>
                    <p className="text-secondary">{item.data}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default StaticPages;
