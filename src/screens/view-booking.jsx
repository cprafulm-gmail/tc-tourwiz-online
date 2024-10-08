import React from "react";
import { Trans } from "../helpers/translate";
import BookingBase from "../base/booking-base";
import ViewBookingLoading from "../components/loading/view-booking-loading";
import ViewReservationDetails from "../components/view/view-reservation-details";
import ViewItemDetails from "../components/view/view-item-details";
import ViewPolicyDetails from "../components/view/view-policy-details";
import ViewFareDetails from "../components/view/view-fare-details";
import ViewCancellationFareDetails from "../components/view/view-cancellation-fare-details";
import BookedByDetails from "../components/view/view-booked-by-details";
import ViewTravellersDetails from "../components/view/view-travellers-details";
import ViewTravellerAirsDetails from "../components/view/view-travellers-air-details";
import ViewRoomDetails from "../components/view/view-room-details";
import ViewItemDetailsActivity from "../components/view/view-item-details-activity";
import ViewOtherDetailstransfers from "../components/view/view-other-details-transfers";
import ViewOtherDetailsvehicle from "../components/view/view-other-details-vehicle";
import ViewAirDetails from "../components/view/view-air-details";
import OfflineCancelModify from "../components/booking-management/offline-cancel-modify";
import ViewCancelModifyComments from "../components/view/view-cancel-modify-comments";
import OnlineCancel from "../components/booking-management/online-cancel";
import OnlineCancelWithFees from "../components/booking-management/online-cancel-with-fees";
import OfflineBookingComments from "../components/booking-management/offline-booking-comments-manual";
import ViewSpecialRequest from "../components/view/hotel-special-request";
import ViewTransportationDetails from "../components/view/view-transportation-details";
import ViewGroundserviceDetails from "../components/view/view-groundservice-details";
import ViewAddComment from "../components/view/view-add-comment";
import HtmlParser from "../helpers/html-parser";
import ModelPopup from "../helpers/model";
import Amount from "../helpers/amount";
import SVGICon from "../helpers/svg-icon";
import * as Global from "../helpers/global";
import ResultItemAirFareRule from "../components/results/result-item-air-fare-rule";
import ViewCreditNote from "../components/view/view-creditnote";
import ViewDebitNote from "../components/view/view-debitnote";

class ViewBooking extends BookingBase {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isLoading: true,
      isOfflineCancelModify: false,
      isOnlineCancel: false,
      isError: false,
      onlineCancelationFare: null,
      onlineCancelConfirm: null,
      showPolicyPopup: false,
      showPopup: false,
      popupTitle: "",
      popupContent: null,
      popupSizeClass: "",
      isLocadingButton: false,
      isCommentPopup: false,
      offlineComment: null,
      cancellationCharges: {
        supplierCancellationCharge: 0,
        additionalCharge: 0,
        cancellationFees: 0,
        taxType: "CGSTSGST",
        taxPercentage: 18,
        isInclusive: false,
        CGST: 0,
        SGST: 0,
        IGST: 0,
        tax160: 0,
        tax161: 0,
        tax162: 0,
        tax163: 0,
        tax164: 0,
        totalCancellationCharge: 0,
        refundAmount: -1,
        errorMessages: {},
      },
      isErrorResponseInonlineCancelationFare: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getBookingItems();
  }

  handleShowPopup = (mode, result) => {
    this.setState({
      showPopup: true,
      popupTitle:
        mode === "TermsAndConditions"
          ? Trans("_termsAndConditions")
          : Trans("_bookingTermsPopupTitle"),
      popupContent:
        mode === "TermsAndConditions" ? (
          <HtmlParser
            text={
              Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== null &&
                Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== ""
                ? Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand")
                : Trans("_noPolicyFound")
            }
          />
        ) : (
          <div>
            <ul className="list-unstyled m-0 small">
              {result[0].item[0].fareRuleList !== undefined ? (
                result[0].item[0].fareRuleList.map((rule, ruleKey) => {
                  return (
                    <React.Fragment key={ruleKey}>
                      {/* {ruleKey === 0 && (
        <li>
          <h6 className="d-block">
            {this.props.items[
              activeTab === "price" || activeTab === "onword" ? 0 : 1
            ].item[itemKey].locationInfo.fromLocation.name +
              " - " +
              this.props.items[
                activeTab === "price" || activeTab === "onword"
                  ? 0
                  : 1
              ].item[itemKey].locationInfo.toLocation.name +
              " (" +
              this.props.items[
                activeTab === "price" || activeTab === "onword"
                  ? 0
                  : 1
              ].item[itemKey].code +
              ")"}
          </h6>
        </li>
      )} */}
                      <li key={ruleKey}>
                        <span className="d-block">
                          <HtmlParser text={rule.key} />
                        </span>
                        <span className="d-block">
                          <HtmlParser text={rule.value} />
                        </span>
                        <br />
                      </li>
                    </React.Fragment>
                  );
                })
              ) : (
                <li>
                  <span className="d-block">{Trans("_noPolicyFound")}</span>
                </li>
              )}
            </ul>
          </div>
        ),
    });
  };

  getPopupData = (data) => {
    return (
      <ResultItemAirFareRule
        items={data}
        fareRules={data
          .map((item) => {
            return item.item.map((i) => {
              return { item: i.fareRuleList };
            });
          })
          .flat()}
        activeTab={"price"}
      />
    );
  };
  handleHidePopup = () => {
    this.setState({
      showPopup: false,
      popupTitle: "",
      popupContent: null,
    });
  };
  creditNotePopup = () => {
    this.setState({
      showPopup: true,
      popupTitle: "Credit Note",
      popupSizeClass: "modal-xl",
      popupContent: (
        <React.Fragment>
          <ViewCreditNote
            {...this.props}
            {...this.state}
          />
        </React.Fragment>
      )
    })
  }
  debitNotePopup = () => {
    this.setState({
      showPopup: true,
      popupTitle: "Debit Note",
      popupSizeClass: "modal-xl",
      popupContent: (
        <React.Fragment>
          <ViewDebitNote
            {...this.props}
            {...this.state}
          />
        </React.Fragment>
      )
    })
  }
  render() {
    const {
      results,
      isLoading,
      isOfflineCancelModify,
      isOnlineCancel,
      onlineCancelationFare,
      isErrorResponseInonlineCancelationFare,
      onlineCancelConfirm,
      showPolicyPopup,
      isCommentPopup,
      offlineComment,
    } = this.state;
    const { userInfo } = this.props;
    const mode = this.props.match.params.mode;
    let portalType = Global.getEnvironmetKeyValue("portalType");
    return (
      <React.Fragment>
        {this.state.isError && (
          <div className="reservation">
            <div className="title-bg pt-3 pb-3 mb-3">
              <div className="container">
                <h1 className="text-white m-0 p-0 f30 d-inline-block">
                  <SVGICon
                    name="list-ul"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGICon>
                  {Trans("_myViewReservation")}
                </h1>
              </div>
            </div>
            <div className="container">
              <div className="alert alert-danger">
                {Trans("_ooopsSomeThingWentWrongAfterBooking")}
              </div>
            </div>
          </div>
        )}
        {!this.state.isError && (
          <div className="reservation">
            <div className="title-bg pt-3 pb-3 mb-3">
              <div className="container">
                <h1 className="text-white m-0 p-0 f30 d-inline-block">
                  <SVGICon
                    name="list-ul"
                    width="24"
                    height="24"
                    className="mr-3"
                  ></SVGICon>
                  {Trans("_myViewReservation")}
                </h1>
                <button
                  className="btn btn-secondary btn-sm mr-2 float-right"
                  onClick={this.getList}
                >
                  <SVGICon
                    name="angle-pointing-to-left"
                    className="mr-2"
                  ></SVGICon>
                  {Trans("_btnBack")}
                </button>
              </div>
            </div>
            <div className="container">
              {!isLoading ? (
                <div className="row">
                  {localStorage.getItem("portalType") === "B2C" &&
                    localStorage.getItem("isUmrahPortal") === "true" &&
                    this.props.match.params.brn.indexOf("||") > -1 &&
                    results[0].response.umrahVisaFee && (
                      <div class="col-12">
                        <h5 className="text-primary mb-3">
                          {Trans("_umrahReservation")}
                        </h5>

                        <div className="card shadow-sm mb-3">
                          <div className="card-header">
                            <h5 className="m-0 p-0">
                              {Trans("_visaInformation")}
                            </h5>
                          </div>

                          <div className="card-body">
                            <ul className="list-unstyled p-0 m-0">
                              {results[0].response?.umrahMutamerRequestID && (
                                <li className="row">
                                  <label className="col-lg-3">
                                    <a
                                      className="btn btn-sm btn-primary"
                                      href={
                                        "https://poc.sejeltech.com/eservices3-DEV/VisaForm/mutamervisa/processing?" +
                                        results[0].response.umrahMutamerRequestID.split(
                                          "?"
                                        )[1]
                                      }
                                      target="_blank"
                                    >
                                      <SVGICon
                                        name="visaprocess"
                                        className="fa-2x mr-2 text-success"
                                        width="24"
                                        height="24"
                                      ></SVGICon>
                                      {Trans("_completeVisaProcess")}
                                    </a>
                                  </label>
                                </li>
                              )}

                              {!results[0].response?.umrahMutamerRequestID && (
                                <li className="row">
                                  <label className="col-lg-12 text-primary">
                                    Due to technical difficulties we could not
                                    process your Visa Application. <br />
                                    Please contact customer support team using{" "}
                                    {Global.getEnvironmetKeyValue(
                                      "customerCareEmail"
                                    )}{" "}
                                    or{" "}
                                    {Global.getEnvironmetKeyValue(
                                      "portalPhone"
                                    )}
                                    .
                                  </label>
                                </li>
                              )}

                              <div class="border table-responsive">
                                <table class="table offline-booking-table m-0">
                                  <thead>
                                    <tr>
                                      <th class="align-middle bg-light text-nowrap">
                                        {Trans("_mutamerName")}
                                      </th>
                                      <th class="align-middle bg-light text-nowrap">
                                        {Trans("_documentNumber")}
                                      </th>
                                      <th class="align-middle bg-light text-nowrap">
                                        {Trans("_mutamerVisaFee")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results[0].response.travellerDetails.map(
                                      (item, index) => {
                                        return (
                                          <tr>
                                            <td>
                                              {item.details.firstName}{" "}
                                              {item.details.lastName}
                                            </td>
                                            <td>
                                              {item.details.documentNumber}
                                            </td>
                                            <td>
                                              <Amount
                                                amount={
                                                  results[0].response
                                                    .umrahVisaFee /
                                                  results[0].response
                                                    .travellerDetails.length
                                                }
                                              />
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  <div className="col-12">
                    {results &&
                      results.map((item, key) => {
                        const result = item.response;
                        const resultFareBreakup = item.fareBreakup;
                        const business = result.businessObject.business;
                        const {
                          showOnlineModificationOption,
                          showOnlineCancellationOption,
                          showManualCancellationOption,
                        } = item.flags;
                        return (
                          <React.Fragment key={key}>
                            <h5 className="text-primary mb-3 viewreservation-title">
                              {Trans("_reservationDetails") + " - "}
                              {business === "air"
                                ? result.businessDetails
                                : business === "transportation"
                                  ? result.businessObject.stopInfo[0].item[0].name
                                  : result.businessObject.name.replaceAll("&amp;", "&")}
                              {mode === "cancel" &&
                                result.bookingStatusID === "1" && (<>
                                  {showManualCancellationOption ?
                                    <button
                                      className="btn btn-primary btn-sm ml-2 pull-right"
                                      onClick={() =>
                                        this.getManualOfflinePopup(showOnlineCancellationOption, result, "view")
                                      }
                                    >
                                      {Trans("_cancelBooking")}
                                    </button> : <button
                                      className="btn btn-primary btn-sm ml-2 pull-right"
                                      onClick={
                                        showOnlineCancellationOption
                                          ? this.handleOnlineCancel
                                          : this.handleOfflineCancelModify
                                      }
                                    >
                                      {Trans("_cancelBooking")}
                                    </button>}</>

                                )}
                              {mode === "modify" &&
                                result.bookingStatusID === "1" && (
                                  <button
                                    className="btn btn-primary btn-sm ml-2 pull-right"
                                    onClick={
                                      showOnlineModificationOption
                                        ? this.handleOnlineCancel
                                        : this.handleOfflineCancelModify
                                    }
                                  >
                                    {Trans("_modifyBooking")}
                                  </button>
                                )}
                              {(mode === "view" ||
                                mode === "view_fromConfirm") &&
                                result.bookingStatusID === "1" && (
                                  <button
                                    className="btn btn-primary btn-sm mr-2 float-right"
                                    onClick={() =>
                                      this.redirectToVoucher(
                                        "voucher",
                                        result.itineraryID,
                                        result.bookingID,
                                        result.businessObject.business
                                      )
                                    }
                                  >
                                    <SVGICon
                                      name="print"
                                      className="mr-2"
                                    ></SVGICon>
                                    {Trans("_btnPrint")}
                                  </button>
                                )}
                              {localStorage.getItem("portalType") !== "B2C" && result.bookingStatusID === "7" && result.businessObject.creditNoteNumber &&
                                <button
                                  className="btn btn-primary btn-sm mr-2 float-right hide-notes"
                                  onClick={() => this.creditNotePopup()
                                  }
                                >
                                  Credit Note
                                </button>}
                              {localStorage.getItem("portalType") !== "B2C" && result.bookingStatusID === "7" && result.businessObject.debitNoteNumber &&
                                <button
                                  className="btn btn-primary btn-sm mr-2 float-right hide-notes"
                                  onClick={() => this.debitNotePopup()
                                  }
                                >
                                  Debit Note
                                </button>}
                              {(mode === "view" ||
                                mode === "view_fromConfirm") &&
                                (result.bookingStatusID === "10" ||
                                  result.bookingStatusID === "12") && (
                                  <button
                                    className="btn btn-primary btn-sm ml-2 pull-right"
                                    onClick={this.ShowBookToConfirmPopup}
                                  >
                                    {Trans("_confirmbooking")}
                                  </button>
                                )}
                            </h5>

                            <ViewReservationDetails
                              {...result}
                              handleShowTerms={this.handleShowPopup}
                              handleShowBookingTerms={this.handleBookingPopup}
                            />
                            {business === "hotel" ? (
                              <React.Fragment>
                                <ViewItemDetails {...result} />
                                <ViewRoomDetails {...result} />
                              </React.Fragment>
                            ) : null}
                            {business === "activity" ||
                              business === "transfers" ||
                              business === "package" ? (
                              <ViewItemDetailsActivity {...result} />
                            ) : null}
                            {business === "air" ? (
                              <ViewAirDetails
                                items={result.businessObject.items}
                                isOfflineBooking={result.isOfflineBooking}
                              />
                            ) : null}
                            {business === "transportation" ? (
                              <ViewTransportationDetails
                                {...result.businessObject}
                              />
                            ) : null}
                            {business === "groundservice" ? (
                              <ViewGroundserviceDetails {...result} />
                            ) : null}
                            {business === "transfers"
                              && result.businessObject.vendors.filter(x => x.type === "operator").length > 0
                              && result.businessObject.vendors.filter(x => x.type === "operator")[0].item.name !== "ManualTransferBookingProvider" ? (
                              <ViewOtherDetailstransfers {...result} />
                            ) : null}

                            {business === "vehicle" ? (
                              <ViewOtherDetailsvehicle {...result} />
                            ) : null}

                            {business !== "air" ? (
                              <ViewTravellersDetails {...result} />
                            ) : (
                              <ViewTravellerAirsDetails {...result} />
                            )}
                            {business === "hotel" &&
                              result.comments.length > 0 && (
                                <ViewSpecialRequest
                                  specialRequest={result.comments[0].value}
                                />
                              )}
                            <ViewFareDetails fareBreakup={resultFareBreakup} />
                            {result.businessObject.cancellationCharges && result.businessObject.cancellationCharges.length > 0 &&
                              <ViewCancellationFareDetails fareBreakup={result.businessObject.cancellationCharges} />
                            }

                            {(portalType === "B2B" || portalType === "BOTH") &&
                              result.bookedByDetails && (
                                <BookedByDetails {...result} />
                              )}
                            <ViewPolicyDetails {...result} />
                            {isOfflineCancelModify && (
                              <OfflineCancelModify
                                {...result}
                                mode={
                                  mode === "view_fromConfirm" ? "view" : mode
                                }
                                userInfo={userInfo}
                                handleOfflineCancelModify={
                                  this.handleOfflineCancelModify
                                }
                                handleChangeBookingStatus={
                                  this.changeBookingStatus
                                }
                                handleShowTerms={this.handleShowTerms}
                              />
                            )}
                            {isCommentPopup && (
                              <OfflineBookingComments
                                offlineComment={offlineComment}
                                mode={"add"}
                                hideCommentPopup={this.hideCommentPopup}
                                /* updateOfflineBooking={this.updateOfflineBooking} */
                                updateOfflineBookingManual={this.updateOfflineBookingManual}
                                onlineCancelationFare={onlineCancelationFare}
                              />
                            )}
                            {isOnlineCancel && (
                              <React.Fragment>
                                {Global.getEnvironmetKeyValue("EnableCancellationFeeFlowForOnlineCancellation", "cobrand") !== null &&
                                  Global.getEnvironmetKeyValue("EnableCancellationFeeFlowForOnlineCancellation", "cobrand") === "true" ?
                                  <OnlineCancelWithFees
                                    mode={
                                      mode === "view_fromConfirm" ? "view" : mode
                                    }
                                    onlineCancelationFare={onlineCancelationFare}
                                    isErrorResponseInonlineCancelationFare={isErrorResponseInonlineCancelationFare}
                                    onlineCancelConfirm={onlineCancelConfirm}
                                    handleOnlineCancel={this.handleOnlineCancel}
                                    handleCancelConfirm={this.handleCancelConfirm}
                                    isLocadingButton={this.state.isLocadingButton}
                                    taxOptions={this.getTaxOptions()}
                                    data={{ taxType: "CGSTSGST" }}
                                    bookingData={result}
                                    handleCancellationCharges={this.handleCancellationCharges}
                                    cancellationCharges={this.state.cancellationCharges}
                                    business={business}
                                  /> :
                                  <OnlineCancel
                                    mode={
                                      mode === "view_fromConfirm" ? "view" : mode
                                    }
                                    onlineCancelationFare={onlineCancelationFare}
                                    onlineCancelConfirm={onlineCancelConfirm}
                                    handleOnlineCancel={this.handleOnlineCancel}
                                    handleCancelConfirm={this.handleCancelConfirm}
                                    isLocadingButton={this.state.isLocadingButton}
                                  />
                                }
                              </React.Fragment>
                            )}

                            <ViewCancelModifyComments {...result} />

                            {showPolicyPopup && (
                              <ModelPopup
                                header={this.state.popupTitle}
                                content={this.state.popupContent}
                                handleHide={this.handleHideTerms}
                              />
                            )}

                            {(portalType === "B2B" ||
                              portalType === "BOTH") && (
                                <ViewAddComment
                                  itineraryID={result.itineraryID}
                                  bookingID={result.bookingID}
                                  handleAddComment={this.handleAddComment}
                                />
                              )}
                          </React.Fragment>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <ViewBookingLoading />
              )}
            </div>
          </div>
        )}
        {this.state.showPopup ? (
          <ModelPopup
            header={this.state.popupTitle}
            content={this.state.popupContent}
            handleHide={this.handleHidePopup}
            sizeClass={this.state.popupSizeClass}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default ViewBooking;
