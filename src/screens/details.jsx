import React from "react";
import DetailsHeader from "./../components/details/details-header";
import ImageSlider from "../components/details/image-slider";
import OverView from "../components/details/overview";
import Amenities from "../components/details/amenities";
import AllAmenities from "../components/details/all-amenities";
import JumpMenu from "../components/details/jump-menu";
import Rooms from "../components/details/rooms";
import Schedule from "../components/details/schedule";
import DetailsLoading from "../components/details/details-loading";
import ModelPopup from "../helpers/model";
import SearchWidget from "../components/search/search-widget";
import InclusionsExcusions from "../components/details/inclusions-excusions";
import ResultBase from "../base/result-base";
import ChangeDatesOccupancy from "../components/common/change-dates-occupancy";
import MapComponent from "../components/common/MapComponent";
import { Trans } from "../helpers/translate";
import CartIcon from "../components/common/cart-icon";
import * as Global from "../helpers/global";
import RulesRegulations from "../components/details/rules-regulations";
import ItineraryDetails from "./../components/details/itenary-details";
import { StickyContainer, Sticky } from 'react-sticky';
import Config from "../config.json";
import PackageSelection from "../components/quotation/package-selection";

class Details extends ResultBase {
  constructor(props) {
    super(props);
    this.state = {
      businessName: this.props.match.params.businessName,
      isLoading: true,
      details: null,
      showPopup: false,
      popupContent: null,
      PolicyHTML: null,
      isBtnLoading: false,
      isBtnLoadingFor: null,
      token: null,
      changeOccupancy_pax: this.getchangeOccupancy_pax(
        this.props.match.params.businessName
      ),
      changeOccupancy_dates: {
        checkInDate: this.props.match.params.checkInDate,
        checkOutDate: this.props.match.params.checkOutDate,
      },
      changeOccupancy_paxIsValid: "valid",
    };
  }

  componentDidMount() {
    let currentLang =
      localStorage.getItem("lang") === null
        ? "en-US"
        : localStorage.getItem("lang");
    var GoogleMapKey = "";
    if (Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") !== null && Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand") !== "") {
      GoogleMapKey = Global.getEnvironmetKeyValue("GoogleMapKey", "cobrand");
    }
    else {
      GoogleMapKey = Config.GoogleMapKey;
    }
    if (currentLang !== "en-US") {
      const script = document.createElement("script");

      script.src = "https://maps.googleapis.com/maps/api/js?key=" + GoogleMapKey + "&libraries=places&language=" + currentLang.split("-")[0] + "&region=" + currentLang.split("-")[1] + "";
      script.async = true;

      document.body.appendChild(script);
    }
    else {
      const script = document.createElement("script");

      script.src = "https://maps.googleapis.com/maps/api/js?key=" + GoogleMapKey + "&libraries=places";
      script.async = true;

      document.body.appendChild(script);
    }
    window.scrollTo(0, 0);
    //if (this.state.businessName === "transfers" || (localStorage.getItem("isUmrahPortal") && this.state.businessName === "hotel"))
    if (this.props.match.params.friendlyurl === "false")
      this.getDetailsFromToken()
    else if (this.props.match.params.friendlyurl === "true")
      this.getDetails();
    this.props.history.listen((location, action) => {
      this.setState({
        callModifySearch: true,
      });
    });
  }

  componentDidUpdate() {
    if (this.state.callModifySearch) {
      this.setState({
        callModifySearch: false,
        isLoading: true,
      });
      //if (this.state.businessName === "transfers" || (localStorage.getItem("isUmrahPortal") && this.state.businessName === "hotel"))
      if (localStorage.getItem("IsFromDetailsPage")) {
        this.getDetails();
      }
      else
        this.getDetailsFromToken();
      // else
      //   this.getDetails();
    }
  }

  render() {
    const { details, isLoading, businessName } = this.state;
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    return (
      <React.Fragment>
        <StickyContainer>
          {Global.getEnvironmetKeyValue("isCart") !== null &&
            Global.getEnvironmetKeyValue("isCart") && (
              <CartIcon isDisplay={1} {...this.props} />
            )}

          <Sticky>
            {({
              style
            }) => (
              <div className="hight-z-index modifyHeader" style={style}>
                <SearchWidget
                  history={this.props.history}
                  match={this.props.match}
                  getResults={this.getResults}
                  location={this.props.location}
                  mode={"modify"}
                />
              </div>
            )}
          </Sticky>

          {isLoading ? (
            <DetailsLoading />
          ) : (
            <React.Fragment>
              {this.state.details ? (
                <div className="container">
                  {isLoading ? (
                    <DetailsLoading />
                  ) : (
                    <React.Fragment>
                      <DetailsHeader
                        {...details}
                        backToSearchURL={this.props.match.url
                          .replace(
                            "/" + this.props.match.url.split("/")[1],
                            "/Results"
                          )
                          .replace("/" + this.props.match.params.id, "")
                          .replace("/" + this.props.match.params.provider, "")}
                      />
                      <Sticky topOffset={155}>
                        {({
                          style, isSticky
                        }) => (
                          <div className="hight-z-index" style={{ ...style, top: `60px`, backgroundColor: `#fff`, zIndex: "98" }}>
                            <JumpMenu {...details} />
                          </div>
                        )}
                      </Sticky>
                      {isCRSRoomSelectionFlowEnable && this.state.businessName === "package" &&
                        <div className="row">
                          <div className="col-lg-6">
                            {<ImageSlider
                              {...details}
                              businessName={this.state.businessName}
                            />}
                          </div>
                          <div className="col-lg-6">
                            <PackageSelection {...details}
                              isBtnLoading={this.state.isBtnLoading}
                              handleCart={this.redirectToCart}
                            />
                          </div>
                        </div>
                      }
                      {!isCRSRoomSelectionFlowEnable && this.state.businessName === "package" &&
                        <ImageSlider
                          {...details}
                          businessName={this.state.businessName}
                        />
                      }

                      <OverView
                        {...details}
                        businessName={this.state.businessName}
                      />
                      {this.state.businessName === "hotel" &&
                        details.amenities &&
                        this.GetAminitiesLength(details.amenities) > 0 && (
                          <AllAmenities {...details} />
                        )}

                      {this.state.businessName === "hotel" &&
                        <ChangeDatesOccupancy
                          //variables
                          businessName={this.state.businessName}
                          paxInfo={this.state.changeOccupancy_pax}
                          dates={this.state.changeOccupancy_dates}
                          paxIsValid={this.state.changeOccupancy_paxIsValid}
                          dateIsValid={"valid"}
                          totalNoOfAdult={
                            this.state.businessName === "hotel"
                              ? localStorage.getItem("isUmrahPortal") ? 0 : this.props.match.params.roomDetails
                                .split("|")
                                .find((element) =>
                                  element.startsWith("totalNoOfAdult=")
                                )
                                .replace("totalNoOfAdult=", "")
                              : 0
                          }
                          totalNoOfChild={
                            this.state.businessName === "hotel"
                              ? localStorage.getItem("isUmrahPortal") ? 0 : this.props.match.params.roomDetails
                                .split("|")
                                .find((element) =>
                                  element.startsWith("totalNoOfChild=")
                                )
                                .replace("totalNoOfChild=", "")
                              : 0
                          }
                          isShowPaxInfoPopup={this.state.isShowPaxInfoPopup}
                          //events
                          handleDateChange={this.changeOccupancy_setDate}
                          handlePax={this.changeOccupancy_setPax}
                          ShowHidePaxInfoPopup={this.ShowHidePaxInfoPopup}
                          changeDatesAndPaxAction={this.changeDatesAndPaxAction}
                          isTripDirectionRoundtrip={this.state.businessName === "transfers" && this.getFilterValue("TripType") === "roundtrip" ? true : false}
                        />
                      }

                      {businessName === "hotel" ? (
                        <Rooms
                          {...details}
                          handleCart={this.redirectToCart}
                          showRoomTerms={this.showRoomTerms}
                          showPriceFarebreakup={this.showPriceFarebreakup}
                          handleShowPolicyPopup={this.handleShowPolicyPopup}
                          isBtnLoading={this.state.isBtnLoading}
                        />
                      ) : (!isCRSRoomSelectionFlowEnable || (isCRSRoomSelectionFlowEnable && businessName !== "package")) ? (
                        <Schedule
                          {...details}
                          handleCart={this.redirectToCart}
                          showRoomTerms={this.showRoomTerms}
                          showPriceFarebreakup={this.showPriceFarebreakup}
                          handleShowPolicyPopup={this.handleShowPolicyPopup}
                          isBtnLoading={this.state.isBtnLoading}
                        />
                      ) : ""}
                      {businessName === "hotel" && <Amenities {...details} />}

                      {(businessName === "activity" ||
                        businessName === "transfers" ||
                        businessName === "package") && (
                          <React.Fragment>
                            <InclusionsExcusions {...details} />
                            {businessName === "package" && (
                              <ItineraryDetails {...details} />
                            )}
                            <RulesRegulations {...details} />
                          </React.Fragment>
                        )}

                      {(businessName === "hotel" ||
                        businessName === "activity" ||
                        businessName === "transfers" ||
                        businessName === "package") &&
                        this.getMapDataForListPage(details).length > 0 && (
                          <MapComponent
                            places={this.getMapDataForListPage(details)}
                            getInfoWindowString={this.getMapInfoWindowString}
                            cityName={this.props.match.params.locationName}
                            businessName={businessName}
                            defaultZoom={14}
                            page={"detail"}
                          />
                        )}
                    </React.Fragment>
                  )}
                </div>
              ) : (
                <div className="text-center m-5">
                  <h5>
                    {Trans("_detail" + this.state.businessName + "NotAvailable")}
                  </h5>
                </div>
              )}

              {this.state.showPopup ? (
                <ModelPopup
                  header={this.state.popupHeader}
                  content={this.state.popupContent}
                  handleHide={this.handleHidePopup}
                />
              ) : null}
            </React.Fragment>
          )}
        </StickyContainer>
      </React.Fragment>
    );
  }
}

export default Details;
