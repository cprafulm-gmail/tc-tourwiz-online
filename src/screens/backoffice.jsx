import React, { Component } from "react";
import SVGICon from "../helpers/svg-icon";
import Loader from "../components/common/loader";
import { apiRequester } from "../services/requester";
import QuotationMenu from "../components/quotation/quotation-menu";

class BackOffice extends Component {
  state = {
    url: "https://preprod-backoffice.tourwizonline.com",
    title: "",
    loading: true,
  };

  getAuthToken = () => {
    var reqURL = "api/v1/user/token";
    var reqOBJ = { request: "jwt" };
    apiRequester(reqURL, reqOBJ, (data) => {
      let url =
        this.state.url +
        (this.props.match.params.page
          ? this.props.match.params.page !== "Home"
            ? "/Login.aspx?ReturnUrl=/" +
            this.props.match.params.page.replace("|", "/") +
            "&token=" +
            data.response
            : "/Login.aspx?token" + data.response
          : "");

      let title =
        this.props.match.params.page === "MyAccount|UpdateProfile.aspx"
          ? "Update Profile"
          : "Backoffice";

      this.setState({ url, title, loading: false });
    });
  };

  handleMenuClick = (req, redirect) => {
    if (redirect) {
      if (redirect === "back-office")
        this.props.history.push(`/Backoffice/${req}`);
      else {
        this.props.history.push(`/Reports`);
      }
      window.location.reload();
    } else {
      this.props.history.push(`${req}`);
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAuthToken();
  }

  render() {
    return (
      <div className="backoffice">
        <div className="title-bg pt-3 pb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGICon
                name="list-ul"
                width="24"
                height="24"
                className="mr-3"
              ></SVGICon>
              {this.state.title}
            </h1>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <QuotationMenu handleMenuClick={this.handleMenuClick} userInfo={this.props.userInfo} />
            </div>
            <div className="col-lg-9">
              <div style={{ marginLeft: "-20px" }}>
                {!this.state.loading ? (
                  <iframe
                    src={this.state.url}
                    style={{
                      width: "100%",
                      height: "600px",
                      border: "0px none",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: "calc(100vh - 200px)" }}
                  >
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BackOffice;
