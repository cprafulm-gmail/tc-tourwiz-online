import React, { Component } from "react";
import Form from "../common/form";
import { Trans } from "../../helpers/translate";
import StarRating from "../common/star-rating";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";
import SVGIcon from "../../helpers/svg-icon";
import HtmlParser from "../../helpers/html-parser";

class EmailWishList extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        subject: "",
        email: "",
        comments: "",
      },
      errors: {},
      isBtnLoading: false,
      items: [],
      reqItems: [],
    };
  }

  handleSubmit = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    let { subject, email, comments } = this.state.data;
    comments = comments.split("&").join("&amp;")
    comments = comments.split("<").join("&lt;")
    comments = comments.split(">").join("&gt;")
    comments = comments.split("\n").join("<br />")

    const { reqItems } = this.state;
    let wishListReq = {
      data: reqItems,
      templateInfo: {
        to: email,
        Data: comments,
        Title: subject,
      },
    };

    this.setState({
      isBtnLoading: true,
    });

    this.props.sendWishList(wishListReq);
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;

    if (!this.validateFormData(data.email, "require"))
      errors.email = Trans("_error_email_require");
    else if (!this.validateFormData(data.email, "email"))
      errors.email = Trans("_error_email_email");

    // Comments Validation
    if (!this.validateFormData(data.comments, "require"))
      errors.comments = Trans("_error_comments_require");

    // Comments Validation
    if (!this.validateFormData(data.subject, "require"))
      errors.subject = Trans("_error_subject_require");

    if (this.state.reqItems.length < 1)
      errors.items = Trans("_error_atleastone_require");

    return Object.keys(errors).length === 0 ? null : errors;
  };

  handleCheck = (item) => {
    let reqItems = this.state.reqItems;

    reqItems.includes(item)
      ? (reqItems = reqItems.filter((x) => x !== item))
      : reqItems.push(item);

    this.setState({
      reqItems,
    });
  };

  componentDidMount() {
    let items = [];
    this.props.wishList.map((item) =>
      items.push(item.id ? item.id : item.token)
    );
    this.setState({
      items,
      reqItems: items,
    });
  }

  render() {
    const { isBtnLoading } = this.state;
    const { wishList } = this.props;
    return (
      <div className="model-popup">
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-capitalize">{Trans("_emailWishList")}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.props.handleWishListPopup}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <ul className="list-unstyled border shadow-sm">
                      {wishList.length > 0
                        ? wishList.map((item, key) => {
                          const airDisplayAmount = item.displayAmount;
                          return (
                            <li className="p-3 border-bottom" key={key}>
                              <div className="row">
                                {item.business !== "air" && (
                                  <React.Fragment>
                                    <div className="col-lg-7 font-weight-bold text-primary">
                                      <div className="custom-control custom-checkbox">
                                        <input
                                          className="custom-control-input"
                                          type="checkbox"
                                          id={item.id}
                                          value={item.id}
                                          name={item.id}
                                          defaultChecked
                                          onChange={() =>
                                            this.handleCheck(item.id)
                                          }
                                        />
                                        <label
                                          name={item.id}
                                          htmlFor={item.id}
                                          className="custom-control-label text-capitalize"
                                        >
                                          <HtmlParser text={item.name} />
                                        </label>
                                      </div>
                                    </div>
                                    {item.business !== "vehicle" &&
                                      <div className="col-lg-2">
                                        <span className="star-rating">
                                          <StarRating {...[item.rating]} />
                                        </span>
                                      </div>
                                    }
                                    <div className="col-lg-3 text-right">
                                      {item.displayAmount}
                                    </div>
                                  </React.Fragment>
                                )}

                                {item.business === "air" && (
                                  <div className="col-lg-12">
                                    <ul className="list-unstyled m-0">
                                      {item.items.map((item, itemKey) => {
                                        const loc = item.locationInfo;
                                        loc.fromLocation =
                                          loc.fromLocation ||
                                          loc.FromLocation;
                                        loc.toLocation =
                                          loc.toLocation || loc.ToLocation;
                                        const date = item.dateInfo;
                                        const stopCount =
                                          item.item.length - 1;
                                        const stops =
                                          stopCount === 0
                                            ? "non stop"
                                            : stopCount === 1
                                              ? stopCount + " stop"
                                              : stopCount + " stops";
                                        const url = item.item[0].images.find(
                                          (x) => x.type === "default"
                                        ).url;

                                        const airline =
                                          item.item[0].vendors[0].item.name;
                                        const airlineCode = item.item[0].code;

                                        const getOnErrorImageURL = () => {
                                          return ImageNotFound.toString();
                                        };
                                        const duration =
                                          item.tpExtension.find(
                                            (x) => x.key === "durationHours"
                                          ).value +
                                          "h " +
                                          item.tpExtension.find(
                                            (x) => x.key === "durationHours"
                                          ).value +
                                          "m";
                                        return (
                                          <li
                                            className="border-bottom p-3"
                                            key={itemKey}
                                          >
                                            <div className="row">
                                              <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                                <img
                                                  className="img-fluid"
                                                  src={url || ImageNotFound}
                                                  onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getOnErrorImageURL();
                                                  }}
                                                  alt=""
                                                />
                                                <span className="small text-secondary mt-2">
                                                  {airline +
                                                    " " +
                                                    airlineCode}
                                                </span>
                                              </div>
                                              <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                                                <span className="small text-secondary">
                                                  {loc.fromLocation.id}
                                                </span>

                                                <b>
                                                  <Date
                                                    date={date.startDate}
                                                    format="shortTime"
                                                  />
                                                </b>

                                                <span className="small text-secondary">
                                                  <Date
                                                    date={date.startDate}
                                                    format="shortDate"
                                                  />
                                                </span>
                                              </div>
                                              <div className="col-lg-2 d-flex justify-content-center align-items-center flex-column">
                                                <Stops {...[stopCount]} />
                                                <span className="small mt-1">
                                                  {Trans("_" + stops.replace(" ", "").replace(" ", "").toLowerCase())}
                                                </span>
                                              </div>
                                              <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                                                <span className="small text-secondary">
                                                  {loc.toLocation.id}
                                                </span>

                                                <b>
                                                  <Date
                                                    date={date.endDate}
                                                    format="shortTime"
                                                  />
                                                </b>

                                                <span className="small text-secondary">
                                                  <Date
                                                    date={date.endDate}
                                                    format="shortDate"
                                                  />
                                                </span>
                                              </div>
                                              <div className="col-lg-2 d-flex justify-content-center align-items-start flex-column">
                                                <h6 className="font-weight-bold">
                                                  {airDisplayAmount}
                                                </h6>
                                                <span className="small text-nowrap">
                                                  <i className="align-text-bottom">
                                                    <SVGIcon
                                                      name="clock"
                                                      className="mr-1 text-secondary"
                                                      width="12"
                                                      height="12"
                                                    ></SVGIcon>
                                                  </i>
                                                  {duration}
                                                </span>
                                              </div>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })
                        : Trans("_noItemsAdded")}
                    </ul>
                    {this.state.errors && this.state.errors.items && (
                      <small class="alert alert-danger mt-2 p-1 d-inline-block">
                        {this.state.errors.items}
                      </small>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    {this.renderInput("subject", Trans("_subject") + " *")}
                  </div>

                  <div className="col-lg-6">
                    {this.renderInput("email", Trans("_datePickerTo") + " *")}
                  </div>

                  <div className="col-lg-12">
                    {this.renderTextarea("comments", Trans("_comments") + " *")}
                  </div>

                  <div className="col-lg-12">
                    <button
                      className="btn btn-primary"
                      onClick={this.handleSubmit}
                    >
                      {isBtnLoading && (
                        <span className="spinner-border spinner-border-sm mr-2"></span>
                      )}
                      {Trans("_sendRequest")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

export default EmailWishList;
