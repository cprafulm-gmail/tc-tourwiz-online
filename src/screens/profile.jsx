import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import Date from "../helpers/date";
import * as DropdownList from "../helpers/dropdown-list";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import SVGIcon from "../helpers/svg-icon";
import avatar from "../assets/images/default_avatar.png";

class Profile extends Component {
  constructor(props) {
    super(props);
    let AirBusiness = false;
    Global.getEnvironmetKeyValue("availableBusinesses") !== undefined &&
      Global.getEnvironmetKeyValue("availableBusinesses").map((item, index) => {
        if (item.name === "air") AirBusiness = true;
      });
    this.state = {
      isLoading: true,
      userInfo: "",
      isAssignedAirBusiness: AirBusiness,
      showErrow: false
    };
  }

  getUserDetails = () => {
    var reqURL = "api/v1/user/details";
    var reqOBJ = {
      Request: ""
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        data.response !== undefined
          ? this.setState({
            isLoading: false,
            userInfo: data.response
          })
          : this.setState({
            isLoading: true,
            showErrow: true
          });
      }.bind(this)
    );
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    const { isLoading, userInfo, showErrow } = this.state;
    let IsAnniverseryNotAllowed = Global.getEnvironmetKeyValue("IsAnniverseryNotAllowed", "cobrand") === "true" ? true : false;
    return (
      <div className="profile">
        <div className="title-bg pt-3 pb-3 mb-3">
          <div className="container">
            <h1 className="text-white m-0 p-0 f30">
              <SVGIcon
                name="user-plus"
                type="fill"
                className="mr-3"
                width="30"
                height="30"
              ></SVGIcon>
              {Trans("_myProfile")}
            </h1>
          </div>
        </div>
        <div className="container">
          {!isLoading ? (
            <React.Fragment>
              <div className="border bg-white shadow-sm ">
                <ul className="list-unstyled row p-4">
                  <li className="col-lg-12">
                    <div className="row">
                      <div className="col-10 d-flex align-items-center">
                        <img
                          src={userInfo?.profilePicture?.url ? userInfo.profilePicture.url : avatar}
                          className="profile-img d-inline-block mr-3"
                          alt=""
                        />
                        <div className="d-inline-block">
                          <label className="mb-0">
                            {Trans("_passangerName") + " : "}
                          </label>
                          <h5>
                            {userInfo.firstName + " " + userInfo.lastName}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <hr />
                  </li>

                  <li className="col-lg-6 mb-lg-0 mb-3 ">
                    <div className="row">
                      <label className="col-lg-4">
                        {Trans("_lblBirthdate") + " : "}
                      </label>
                      <b className="col-lg-8">
                        {userInfo.birthDate === "0001-01-01T00:00:00" ? (
                          "---"
                        ) : (
                          <Date date={userInfo.birthDate} />
                        )}
                      </b>
                    </div>
                  </li>
                  {!IsAnniverseryNotAllowed &&
                    <li className="col-lg-6 mb-lg-0 mb-3">
                      <div className="row">
                        <label className="col-lg-4">
                          {Trans("_lblAnniversarydate") + " : "}
                        </label>
                        <b className="col-lg-8">
                          {userInfo.anniversaryDate === "0001-01-01T00:00:00" ? (
                            "---"
                          ) : (
                            <Date date={userInfo.anniversaryDate} />
                          )}
                        </b>
                      </div>
                    </li>}
                  <li className="col-lg-6 mb-lg-0 mb-3">
                    <div className="row">
                      <label className="col-lg-4">
                        {Trans("_lblEmail") + " : "}
                      </label>
                      <b className="col-lg-8">
                        {userInfo.contactInformation.email}
                      </b>
                    </div>
                  </li>
                  <li className="col-lg-6 mb-lg-0 mb-3">
                    <div className="row">
                      <label className="col-lg-4">
                        {Trans("_lblCity") + "/" + Trans("_lblCountry") + " : "}
                      </label>
                      <b className="col-lg-8">
                        {userInfo.location.countryID &&
                          userInfo.location.countryID !== "undefined" &&
                          userInfo.location.countryID !== ""
                          ? userInfo.location.city +
                          ", " +
                          DropdownList.CountryList.find(x =>
                            x.isoCode.includes(userInfo.location.countryID)
                          ).name
                          : "---"}
                      </b>
                    </div>
                  </li>
                  <li className="col-lg-6 mb-lg-0 mb-3">
                    <div className="row">
                      <label className="col-lg-4">
                        {Trans("_lblAddress") + " : "}
                      </label>
                      <b className="col-lg-8">
                        {userInfo.location.address === ""
                          ? "---"
                          : userInfo.location.address}
                      </b>
                    </div>
                  </li>
                  <li className="col-lg-6 mb-lg-0 mb-3">
                    <div className="row">
                      <label className="col-lg-4">
                        {Trans("_lblZipCodeOrPostalCode") + " : "}
                      </label>
                      <b className="col-lg-8">
                        {userInfo.location.zipCode === ""
                          ? "---"
                          : userInfo.location.zipCode}
                      </b>
                    </div>
                  </li>
                  {this.state.isAssignedAirBusiness && (
                    <li className="col-lg-6 mb-lg-0 mb-3">
                      <div className="row">
                        <label className="col-lg-4">
                          {Trans("_lblNationality") + " : "}
                        </label>
                        <b className="col-lg-8">
                          {userInfo.nationalityCode &&
                            userInfo.nationalityCode !== "undefined" &&
                            userInfo.nationalityCode !== ""
                            ? DropdownList.CountryList.find(x =>
                              x.isoCode.includes(
                                userInfo.nationalityCode === ""
                                  ? Global.getEnvironmetKeyValue(
                                    "PortalCountryCode"
                                  )
                                  : userInfo.nationalityCode
                              )
                            ).name
                            : "---"}
                        </b>
                      </div>
                    </li>
                  )}
                  <li className="col-lg-6 mb-lg-0 mb-3">
                    <div className="row">
                      <label className="col-lg-4">
                        {Trans("_lblMobileNumber") + " : "}
                      </label>
                      <b className="col-lg-8">
                        {userInfo.contactInformation.phoneNumberCountryCode &&
                          userInfo.contactInformation.phoneNumberCountryCode !==
                          "undefined" &&
                          userInfo.contactInformation.phoneNumber &&
                          userInfo.contactInformation.phoneNumber !== "undefined"
                          ? userInfo.contactInformation.phoneNumberCountryCode +
                          " " +
                          userInfo.contactInformation.phoneNumber
                          : "---"}
                      </b>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="row mt-4">
                <div className="col-lg-12 text-center">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => this.props.history.push("/EditProfile")}
                  >
                    {Trans("_editProfile")}
                  </button>
                </div>
              </div>
            </React.Fragment>
          ) : showErrow ? (
            <div className="alert alert-danger">
              {Trans("_pleaseLoginToAccessProfile")}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Profile;
