import React, { Component } from "react";
import { apiRequester } from "../services/requester";
import * as Global from "../helpers/global";
import { Trans } from "../helpers/translate";
import HtmlParser from "../helpers/html-parser";
import VoucherInvoice from "../screens/voucher-invoice";
import BookToConfirm from "../components/common/book-to-confirm";
import Config from "../config.json"

class BookingBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Getting All Types of Booking
  getBookings = (filters, pageCount) => {
    var reqURL = "api/v1/" + this.state.page;
    var reqOBJ = {
      Request: {
        Data: this.state.type,
        filtersIndex: filters && [{ item: filters }],
        PageInfoIndex: [
          {
            Item: {
              CurrentPage: pageCount && pageCount,
              PageLength: this.state.pageLength
            }
          }
        ]
      }
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 30)
          this.setState({
            isLoginError: true
          });
        else
          this.setState({
            results: data.response,
            isLoading: !this.state.isLoading,
            isShow: [],
            supplierBRNDetails: []
          });
      }.bind(this)
    );
  };

  // Filtering Results
  filterResults = (filters, type) => {
    this.setState({ type: type, isLoading: !this.state.isLoading }, () =>
      this.getBookings(filters)
    );
  };

  // Pagination Results
  paginationResults = (pageCount, pageLength) => {
    let filters = this.state.results.appliedFiltersIndex[0].item;

    this.setState(
      {
        pageLength,
        isLoading: !this.state.isLoading
      },
      () => this.getBookings(filters, pageCount)
    );
  };

  // Redirect to View Booking Page
  redirectToDetails = (mode, irn, brn) => {
    let brns = [];
    brn
      ? brns.push(btoa(brn))
      : irn.map(item => {
        return brns.push(btoa(item.bookingRefNo));
      });
    brns = brns.join("||");

    this.props.history.push(
      `/ViewBooking/${mode}/${irn[0].itineraryRefNo}/${brns}/${btoa(JSON.stringify({ portalAgentID: irn[0].portalAgentID }))}`
    );
  };

  // Redirect to View Voucher Page
  redirectToVoucher = (mode, itineraryID, bookingID, businessName) => {
    let isShowVoucherInPopup = Global.getEnvironmetKeyValue(
      "ShowVoucherInPopup",
      "cobrand"
    );
    if (!isShowVoucherInPopup) {
      let portalURL = window.location.origin;
      if (Config.codebaseType === "tourwiz-customer" && window.location.origin.toLowerCase().indexOf(process.env.REACT_APP_DEFAULTB2CPORTAL) > -1) {
        portalURL = window.location.origin.toLowerCase() + '/' + window.location.pathname.split('/')[1];
      }
      var win = window.open(
        `${portalURL}/Voucher/${mode}/${businessName}/${itineraryID}/${bookingID}`,
        "_blank"
      );
      win.focus();
    } else {
      this.setState({
        showPopup: true,
        popupTitle: Trans("_" + mode),
        popupSizeClass: "modal-lg",
        popupContent: (
          <React.Fragment>
            <VoucherInvoice
              mode={mode}
              itineraryid={itineraryID}
              bookingid={bookingID}
              businessName={businessName}
            />
          </React.Fragment>
        )
      });
    }
  };

  //Getting BRN from URL and Call getBookingDetails Multiple times
  getBookingItems = () => {
    let brn = this.props.match.params.brn;
    brn = brn.split("||");
    brn.map(item => {
      return this.getBookingDetails(atob(item));
    });
  };

  // Getting Booking Details based on IRN and BRN
  getBookingDetails = arg => {
    let reqURL = "api/v1/mybookings/details";
    let reqOBJ = {
      Request: {
        itineraryRefNo: this.props.match.params.irn,
        bookingRefNo: arg
      }
    };
    if (this.props.match.params.data) {
      reqOBJ.Request.portalAgentID = JSON.parse(atob(this.props.match.params.data)).portalAgentID;
    }
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 0) {
          let results = [...this.state.results];
          results.push(data);

          // Show acknowledge message to end user for Book to confim flow.
          if (
            this.props.match.params.mode &&
            this.props.match.params.mode === "view_fromConfirm"
          ) {
            this.setState({
              showPopup: true,
              popupTitle:
                data.response.bookingStatusID === "12" ||
                  data.response.bookingStatusID === "10"
                  ? Trans("_ooops")
                  : Trans("_success"),
              popupContent:
                data.response.bookingStatusID === "12" ||
                  data.response.bookingStatusID === "10"
                  ? Trans("_ooopsSomeThingWentWrongAfterBooking")
                  : Trans("_bookToConfirmSuccessMessage"),
              results,
              isLoading: false,
              isError: false
            });
          } else
            this.setState({
              results,
              isLoading: false,
              isError: false
            });
        } else
          this.setState({
            isLoading: false,
            isError: true
          });
      }.bind(this)
    );
  };

  // View Booking Page View Pring
  getPrint = () => {
    window.print();
  };

  // Navigate to Bookings Page
  getList = () => {
    this.props.history.push(`/Bookings`);
  };

  // Show and Hide Offline Modify and Cancel Popup
  handleOfflineCancelModify = () => {
    this.setState({
      isOfflineCancelModify: !this.state.isOfflineCancelModify
    });
  };

  // Show Online Cancel Popup and getting Fare Details
  handleOnlineCancel = (callback, booking, mode) => {
    if (typeof callback !== 'function') {
      this.setState({
        isOnlineCancel: !this.state.isOnlineCancel
      });
    }

    let res = this.state.results[0].response;
    let reqURL = "api/v1/mybookings/cancel/fares";
    let reqOBJ = {
      Request: { Itinerary: res, Travellers: res.travellerDetails }
    };

    apiRequester(reqURL, reqOBJ, data => {
      this.setState({
        onlineCancelationFare: data.response,
        isErrorResponseInonlineCancelationFare: data.status.code === 1
      }, () => {
        if (typeof callback === 'function') {
          callback(booking, mode);
        }
      });
    });
  };

  // On Confirm Sending Online Cancelation Request
  handleCancelConfirm = (req) => {
    let cancellationCharges = this.state.cancellationCharges;
    cancellationCharges.errorMessages = {};
    if (this.state.results[0].response.isOfflineBooking
      && cancellationCharges.totalCancellationCharge === 0
      && cancellationCharges.refundAmount === -1) {
      cancellationCharges.refundAmount = this.state.results[0].response.businessObject.displayRateInfo.find(x => x.purpose === "10").amount;
    }
    if (Number(cancellationCharges.refundAmount) < 0 || Number(cancellationCharges.totalCancellationCharge) < 0) {
      let { cancellationCharges } = this.state;
      if (Number(cancellationCharges.refundAmount) < 0) {
        cancellationCharges.errorMessages.refundAmount = "Refund amount should not be less than 0.";
      }
      if (Number(cancellationCharges.totalCancellationCharge) < 0) {
        cancellationCharges.errorMessages.totalCancellationCharge = "Total Cancellation Charge should not be less than 0.";
      }
      this.setState({ cancellationCharges });
      return;
    }
    cancellationCharges.errorMessages = {};
    this.setState({
      cancellationCharges,
      isLocadingButton: true
    });
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    if (cancellationCharges.totalCancellationCharge === 0 && cancellationCharges.refundAmount === 0) {

      let cancellationCharge = this.state.onlineCancelationFare
        ? this.state.onlineCancelationFare.find(x => x.purpose === "11").amount
        : "";
      let refundAmount = this.state.onlineCancelationFare
        ? this.state.onlineCancelationFare.find(x => x.purpose === "12").amount
        : "";
      cancellationCharges.totalCancellationCharge = cancellationCharge;
      cancellationCharges.refundAmount = refundAmount;
    }
    const env = JSON.parse(localStorage.getItem("environment"));
    let business = this.state.results[0].response.businessObject.business;
    if (business === "transfers" || business === "custom" || business === "package") business = "activity";
    let generalTaxes = [];
    if (env.customTaxConfigurations && env.customTaxConfigurations
      .find(x => x.business.toLowerCase() === business.toLowerCase())) {
      generalTaxes = env.customTaxConfigurations
        .find(x => x.business.toLowerCase() === business.toLowerCase())
        .taxes.filter(tax => tax.isShowOnUI && Number(tax.purpose) >= 160 && Number(tax.purpose) <= 164)
        .map(item => { return { "name": item.name, "purpose": item.purpose } })
        .sort((a, b) => (a.purpose > b.purpose) ? 1 : ((b.purpose > a.purpose) ? -1 : 0));
    }

    let CancellationRates = [{
      "amount": cancellationCharges.totalCancellationCharge,
      "description": "Cancellation Amount",
      "currencyCode": portalCurrency,
      "purpose": "11",
    },
    {
      "amount": cancellationCharges.refundAmount,
      "description": "RefundAmount",
      "purpose": "12",
      "currencyCode": portalCurrency,
    },
    {
      "amount": cancellationCharges.cancellationFees,
      "description": "CancellationFees",
      "purpose": "156",
      "isInclusiveTax": cancellationCharges.isInclusive,
      "currencyCode": portalCurrency,
    },
    {
      "amount": cancellationCharges.CGST,
      "description": "CGST",
      "purpose": "157",
      "currencyCode": portalCurrency,
    },
    {
      "amount": cancellationCharges.SGST,
      "description": "SGST",
      "purpose": "158",
      "currencyCode": portalCurrency,
    },
    {
      "amount": cancellationCharges.IGST,
      "description": "IGST",
      "purpose": "159",
      "currencyCode": portalCurrency,
    }
    ];
    generalTaxes.map(item => {
      CancellationRates.push({
        "amount": cancellationCharges["tax" + item.purpose],
        "description": item.name,
        "purpose": item.purpose,
        "currencyCode": portalCurrency,
      });
    });

    CancellationRates.push({
      "amount": cancellationCharges.additionalCharge,
      "description": "AdditionalCharge",
      "purpose": "165",
      "currencyCode": portalCurrency,
    });

    CancellationRates.push({
      "amount": cancellationCharges.supplierCancellationCharge,
      "description": "CancellationChargeWithoutCancellationFee",
      "purpose": "166",
      "currencyCode": portalCurrency,
    });

    const EnableCancellationFeeFlowForOnlineCancellation = Global.getEnvironmetKeyValue("EnableCancellationFeeFlowForOnlineCancellation", "cobrand") !== null &&
      Global.getEnvironmetKeyValue("EnableCancellationFeeFlowForOnlineCancellation", "cobrand") === "true"

    let res = this.state.results[0].response;
    let reqURL = "api/v1/mybookings/cancel";
    let reqOBJ = {
      Request: { Itinerary: res, Travellers: res.travellerDetails, CancellationRates },
      flags: {
        EnableCancellationFeeFlowForOnlineCancellation: EnableCancellationFeeFlowForOnlineCancellation,
      }
    };

    apiRequester(reqURL, reqOBJ, data => {
      if (req) {
        this.updateOfflineBooking(req);
      }
      else {
        if (data.status.code === 1) {
          this.handleOnlineCancel()
          this.setState({
            isOnlineCancel: req ? true : !this.state.isOnlineCancel,
            isCommentPopup: false,
            showPolicyPopup: true,
            popupTitle: Trans("_ooops"),
            popupContent: Trans("_ooopsSomeThingWentWrongAfterBooking")
          });
        }
        this.setState({
          isOnlineCancel: req ? this.state.isOnlineCancel : !this.state.isOnlineCancel,
          isLocadingButton: false,
          isCommentPopup: false,
          isLoading: true,
          results: []
        }, () => this.getBookingItems());
      }
    });
  };

  // Offline Cancel and Modify Request and Update View Reservation
  changeBookingStatus = changeReq => {
    let mode = this.props.match.params.mode;
    var reqURL = "api/v1/mybookings/" + mode + "request";
    var reqOBJ = {
      Request: changeReq
    };
    apiRequester(reqURL, reqOBJ, () => {
      this.setState({
        results: [],
        isLoading: true
      });
      this.handleOfflineCancelModify();
      this.handleShowOfflineModifyCancleSuccess();
      this.getBookingItems();
    });
  };

  // Showing Policy on Ofline Modify and Cancel Popup
  handleShowTerms = () => {
    this.setState({
      showPolicyPopup: true,
      popupTitle: Trans("_termsAndConditions"),
      popupContent: (
        <HtmlParser
          text={(Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== null && Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") !== "") ? Global.getEnvironmetKeyValue("SIGNUPTERMS", "cobrand") : Trans("_noPolicyFound")}
        />
      )
    });
  };

  handleShowOfflineModifyCancleSuccess = () => {
    this.setState({
      showPolicyPopup: true,
      popupTitle: Trans("_titleModifyCancleReservation"),
      popupContent: Global.getEnvironmetKeyValue("portalId") === "15594" ?
        //BookItNow portal
        <React.Fragment>
          <div className="col-md-12 col-sx-12">
            <p className="text-success">
              You're Change/ Cancellation request has been successfully sent to our Operation Team to action.
            </p>
            <p className="text-success">
              <em>Thank you for your request. We will respond to it via email as soon as possible.</em>
            </p>
          </div>
        </React.Fragment>
        : (
          <React.Fragment>
            <div className="col-md-12 col-sx-12">
              <p className="text-success">
                <strong>{Trans("_modifyCancelSuccessLabel")}</strong>
              </p>
              <p className="text-success">
                <em>{Trans("_modifyRequestLine1Label")}</em>
              </p>
              <p className="text-success">{Trans("_modifyRequestLine2Label")}</p>
              <p>
                <small>{Trans("_modifyRequestLine3Label")}</small>
                <small>
                  {Trans("_modifyRequestLine4Label").replace(
                    "##ProviderPhone##",
                    Global.getEnvironmetKeyValue("portalPhone")
                  )}
                </small>
                <small>
                  {Trans("_modifyRequestLine7Label").replace(
                    "##ProviderPhone##",
                    Global.getEnvironmetKeyValue("portalPhone")
                  )}
                </small>
                <small>
                  {Trans("_modifyRequestLine5Label").replace(
                    "##AgentEmail##",
                    Global.getEnvironmetKeyValue("customerCareEmail")
                  )}
                </small>
              </p>
              <p className="text-success">{Trans("_modifyRequestLine6Label")}</p>
            </div>
          </React.Fragment>
        )
    });
  };

  // Hiding Policy on Ofline Modify and Cancel Popup
  handleHideTerms = () => {
    this.setState({
      showPolicyPopup: false,
      popupTitle: "",
      popupContent: null
    });
  };

  //Add comment
  handleAddComment = (comment, itineraryID, bookingID) => {
    var reqURL = "api/v1/mybookings/details/Comment";
    var reqOBJ = {
      "request": {
        "ItineraryID": itineraryID,
        "BookingID": bookingID,
        "Comment": comment
      }
    }
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          results: [],
          isLoading: true
        }, () => this.getBookingItems());
      }.bind(this)
    );
  }

  // Hiding Policy on Ofline Modify and Cancel Popup
  handleHidePopup = () => {
    this.setState({
      showPopup: false,
      popupTitle: "",
      popupContent: null
    });
  };

  getManualOfflinePopup = (showOnlineCancellationOption, booking, mode) => {
    if (showOnlineCancellationOption) {
      this.setState({
        showOnlineCancellationOption: showOnlineCancellationOption,
        mode: mode,
        isCommentPopup: true,
        offlineComment: null
      });
      this.handleOnlineCancel(this.getOfflineComments, booking, mode);
    }
    else {
      this.getOfflineComments(booking, mode);
    }
  }
  // Getting Offline Bookings
  getOfflineComments = (booking, mode) => {
    this.setState({
      mode: mode,
      isCommentPopup: true,
      offlineComment: null
    });

    var reqURL = "api/v1/mybookings/changerequest/details";
    var reqOBJ = {
      Request: {
        Key: booking.bookingID,
        Value: booking.businessID
      }
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          offlineComment: {
            details: booking,
            comments: data.response
          }
        });
      }.bind(this)
    );
  };

  // Show and Hide Offline Booking Comments Popup
  hideCommentPopup = () => {
    this.setState({
      isCommentPopup: !this.state.isCommentPopup
    });
  };
  updateOfflineBookingManual = req => {
    if (this.state.showOnlineCancellationOption)
      this.handleCancelConfirm(req);
    else {
      this.updateOfflineBooking(req);
    }
  }

  updateOfflineBooking = req => {
    var reqURL = "api/v1/mybookings/changerequest";
    var reqOBJ = {
      Request: req
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.hideCommentPopup();
        window.alert(Trans("_yourCommentHasBeenAddedSuccessfully"));
        this.setState({
          isLoading: !this.state.isLoading
        });
        let filters = this.state.results.appliedFiltersIndex[0].item;
        this.getBookings(filters);
      }.bind(this)
    );
  };

  // Failer Transaction Show and Hide Details
  handleDetails = id => {
    let ids = this.state.isShow;
    ids.includes(id) ? (ids = ids.filter(x => x !== id)) : ids.push(id);
    this.setState({
      isShow: ids
    });
  };

  handleGDSInfo = (gdsEventlogID, gdsInvocationErrosMessage) => {
    this.setState({
      showPopup: true,
      popupHeader: Trans("_GDSErrorInformation"),
      popupContent: <React.Fragment>
        <div class="row ml-2 mr-2">
          <span>{Trans("_GDSReferenceCode")} : <b>{gdsEventlogID}</b></span>
          <span>{Trans("_GDSeWalletError")} : <b>{gdsInvocationErrosMessage}</b></span>
        </div>
      </React.Fragment>
    });
  }
  handleFailedBookings = (booking, mode) => {
    this.setState({
      mode,
      failedBookingDetails: booking,
      isFailedBookingPopup: !this.state.isFailedBookingPopup,
      viewBookingDetails: ""
    });

    let reqURL = "api/v1/mybookings/details";
    let reqOBJ = {
      Request: {
        itineraryRefNo: booking.itineraryRefno,
        itineraryPaymentTransactionID: booking.itineraryPaymentTransactionID
      }
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          viewBookingDetails: data.response
        });
      }.bind(this)
    );
  };

  hideFailedBookingPopup = () => {
    this.setState({
      isFailedBookingPopup: !this.state.isFailedBookingPopup
    });
  };

  handleFailedBookingUpdate = (booking, mode) => {
    var reqURL =
      "api/v1/mytransactions/" + (mode === "confirm" ? "modify" : "cancel");
    var reqOBJ = {
      Request:
        mode === "confirm"
          ? {
            ItineraryRefNo: booking.itineraryRefno,
            ItineraryPaymentTransactionID:
              booking.itineraryPaymentTransactionID,
            BookingRefNo: booking.BookingRefNo
          }
          : {
            ItineraryRefNo: booking.itineraryRefno,
            ItineraryPaymentTransactionID:
              booking.itineraryPaymentTransactionID,
            ProviderName: booking.providerName,
            Amount: booking.paymentAmount,
            CancellationAmount: booking.CancellationAmount
          }
    };

    apiRequester(reqURL, reqOBJ, data => {
      this.hideFailedBookingPopup();
      this.setState({
        isLoading: !this.state.isLoading
      });
      let filters = this.state.results.appliedFiltersIndex[0].item;
      this.getBookings(filters);
    });
  };

  // Issue Documents
  handleIssueDocuments = (booking, mode) => {
    this.setState({
      mode,
      issueDocumentsDetails: booking,
      isIssueDocumentsPopup: !this.state.isIssueDocumentsPopup,
      issueDocumentsBalance: ""
    });

    var reqURL = "api/v1/holdbookings/getbalance";
    var reqOBJ = {
      Request: {
        agentID: booking.agentID,
        userID: booking.userID
      }
    };

    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        this.setState({
          issueDocumentsBalance: data.response
        });
      }.bind(this)
    );
  };

  hideIssueDocumentsPopup = () => {
    this.setState({
      isIssueDocumentsPopup: !this.state.isIssueDocumentsPopup
    });
  };

  handleIssueDocumentsUpdate = (booking, mode) => {
    var reqURL = "api/v1/holdbookings/" + mode;
    var reqOBJ = {
      Request: booking
    };

    apiRequester(reqURL, reqOBJ, () => {
      this.hideIssueDocumentsPopup();
      this.setState({
        isLoading: !this.state.isLoading
      });
      let filters = this.state.results.appliedFiltersIndex[0].item;
      this.getBookings(filters);
    });
  };

  // Book to confirm
  ShowBookToConfirmPopup = () => {
    //Get payment mode Details
    if (
      this.props.match.params.mode === "view" &&
      this.props.match.params.brn.indexOf("||") === -1
    )
      this.renderPaymentGateWays();
  };

  renderPaymentGateWays = () => {
    let reqURL = "api/v1/cart";
    let reqOBJ = {
      Request: atob(this.props.match.params.brn)
    };
    apiRequester(
      reqURL,
      reqOBJ,
      function (data) {
        if (data.status.code === 0) {
          this.setState({
            showPopup: true,
            popupTitle: Trans("_confirmbooking"),
            popupSizeClass: "modal-lg",
            popupContent: (
              <BookToConfirm
                paymentGatewayCharges={data.response.paymentGatewayCharges}
                selectedPaymentMode={
                  Object.keys(data.response.paymentGatewayCharges)[0]
                }
                match={this.props.match}
                paymentInfo={this.getPaymentInformation}
              />
            )
          });
        }
      }.bind(this)
    );
  };

  getPaymentInformation = () => {

    if (Global.getEnvironmetKeyValue("portalId") === "15594") {
      return <div className="row" >
        <div className="col-6">
          <h6 className="bg-light p-3 border font-weight-bold text-capitalize m-0">
            <div className="d-inline-block">
              <label
                className=""

              >
                USD (Making Payments outside USA)
              </label>
            </div>
          </h6>
          <div className="border p-3 mb-3">
            <div className="row">
              <div className="col-12">
                <div className="bg-light p-3">
                  <div className="row mb-2">
                    <span className="col-12">
                      TransferWise
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-12">
                      19 W 24th Street, New York NY 10010, United States Account holder -Bookitnow PTE. LTD.
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-12">
                      Swift Code - CMFGUS33
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-8">
                      Account number – 8310929433 USD
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-8">
                      &nbsp;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="col-6">
          <h6 className="bg-light p-3 border font-weight-bold text-capitalize m-0">
            <div className="d-inline-block">
              <label
                className=""

              >
                (Making Payments INSIDE USA)
              </label>
            </div>
          </h6>
          <div className="border p-3 mb-3">
            <div className="row">
              <div className="col-12">
                <div className="bg-light p-3">
                  <div className="row mb-2">
                    <span className="col-12">
                      TransferWise
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-12">
                      19 W 24th Street, New York NY 10010, United States Account holder - Bookitnow PTE. LTD.
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-12">
                      Routing number - 084009519
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-8">
                      Account number - 9600000000370709
                    </span>
                  </div>
                  <div className="row mb-2">
                    <span className="col-8">
                      Account type - Checking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  }

  getTaxOptions() {
    const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
      && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
    if (IsGSTApplicable) {
      return [
        { value: "CGSTSGST", label: "CGST/SGST" },
        { value: "IGST", label: "IGST" },
      ]
    }
  }

  handleCancellationCharges = (e) => {
    const IsGSTApplicable = Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand")
      && Global.getEnvironmetKeyValue("IsGSTApplicable", "cobrand").toLowerCase() === "true";
    let value = e.target.value;
    if ((value.toString().match(/[.]/g) || []).length > 1)
      return;
    if ((e.target.value === "" || isNaN(value))
      && e.target.name !== "isInclusive" && e.target.name !== "taxType") {
      value = 0;
    }
    let { cancellationCharges } = this.state;
    if (e.target.name === "isInclusive") {
      cancellationCharges[e.target.name] = !cancellationCharges.isInclusive;
    }
    else if (e.target.name === "taxType") {
      cancellationCharges[e.target.name] = value;
      if (cancellationCharges[e.target.name] === "IGST") {
        cancellationCharges.CGST = 0;
        cancellationCharges.SGST = 0;
      }
      else {
        cancellationCharges.IGST = 0;
      }
    }
    else if (e.target.name !== "taxOption") {
      if (value.toString().endsWith(".")) {
        cancellationCharges[e.target.name] = value;
        this.setState({ cancellationCharges });
        return;
      }
      else
        cancellationCharges[e.target.name] = parseFloat(value);
    }
    else
      cancellationCharges[e.target.name] = value;

    let onlineCancelationFare = this.state.onlineCancelationFare
    let cancellationCharge = onlineCancelationFare
      ? onlineCancelationFare.find(x => x.purpose === "11").amount
      : "";
    let refundAmount = onlineCancelationFare
      ? onlineCancelationFare.find(x => x.purpose === "12").amount
      : "";
    if (this.state.results[0].response.isOfflineBooking) {
      let totalBookingAmount = this.state.results[0].response.businessObject.displayRateInfo.find(x => x.purpose === "10").amount;
      refundAmount = totalBookingAmount - cancellationCharges.supplierCancellationCharge;
    }
    else {
      cancellationCharges.supplierCancellationCharge = cancellationCharge;
    }
    if (IsGSTApplicable
      && ((e.target.name === "cancellationFees" && cancellationCharges.taxPercentage > 0)
        || (e.target.name === "isInclusive" && cancellationCharges.taxPercentage > 0)
        || (e.target.name === "taxType" && cancellationCharges.taxPercentage > 0))) {
      let data = this.porcessTaxInfo(cancellationCharges.cancellationFees, cancellationCharges, cancellationCharges.taxPercentage)
      cancellationCharges.CGST = data.CGST;
      cancellationCharges.SGST = data.SGST;
      cancellationCharges.IGST = data.IGST;
    }
    else if (IsGSTApplicable
      && (e.target.name === "taxPercentage" || e.target.name === "cancellationFees")
      && cancellationCharges.taxPercentage > 0 && cancellationCharges.cancellationFees > 0) {
      let data = this.porcessTaxInfo(cancellationCharges.cancellationFees, cancellationCharges, cancellationCharges.taxPercentage)
      cancellationCharges.CGST = data.CGST;
      cancellationCharges.SGST = data.SGST;
      cancellationCharges.IGST = data.IGST;
    }
    else if (e.target.name === "CGST" || e.target.name === "SGST" || e.target.name === "IGST") {
      cancellationCharges.taxPercentage = 0;
    }

    cancellationCharges.refundAmount = refundAmount;
    cancellationCharges.totalCancellationCharge = cancellationCharge
      + cancellationCharges.additionalCharge
      + cancellationCharges.cancellationFees
      + (cancellationCharges.isInclusive ? 0 : cancellationCharges.CGST)
      + (cancellationCharges.isInclusive ? 0 : cancellationCharges.SGST)
      + (cancellationCharges.isInclusive ? 0 : cancellationCharges.IGST)
      + cancellationCharges.tax160 + cancellationCharges.tax161 + cancellationCharges.tax162
      + cancellationCharges.tax163 + cancellationCharges.tax164
      + (this.state.results[0].response.isOfflineBooking ? cancellationCharges.supplierCancellationCharge : 0);

    cancellationCharges.refundAmount = refundAmount - (cancellationCharges.additionalCharge
      + cancellationCharges.cancellationFees
      + (cancellationCharges.isInclusive ? 0 : cancellationCharges.CGST)
      + (cancellationCharges.isInclusive ? 0 : cancellationCharges.SGST)
      + (cancellationCharges.isInclusive ? 0 : cancellationCharges.IGST)
      + cancellationCharges.tax160 + cancellationCharges.tax161 + cancellationCharges.tax162
      + cancellationCharges.tax163 + cancellationCharges.tax164);
    cancellationCharges.totalCancellationCharge = this.removeNNumber(cancellationCharges.totalCancellationCharge);
    cancellationCharges.refundAmount = this.removeNNumber(cancellationCharges.refundAmount);
    this.setState({ cancellationCharges });
  }

  removeNNumber = (input) => {
    if (Number(input).toString().indexOf('.') === -1)
      return Number(input);
    else if (Number(input).toString().split('.')[1].length > 2)
      return Number(Number(input).toFixed(2));
    else
      return Number(Number(input).toFixed(2));
  }
  porcessTaxInfo = (baseAmount, data, taxPercentage) => {
    let taxType = data.taxType;
    if (!isNaN(Number(baseAmount) > 0) && Number(baseAmount) <= 0)
      return { amountWithoutGST: 0, CGST: 0, SGST: 0, IGST: 0 };

    if (!isNaN(Number(baseAmount) > 0) && taxType) {
      if (data.isInclusive) {
        data.IGST = baseAmount - (baseAmount * (100 / (100 + taxPercentage)));
        data.IGST = Number(data.IGST.toFixed(2));
        if (taxType === "CGSTSGST") {
          data.CGST = Number((data.IGST / 2).toFixed(2));
          data.SGST = Number((data.IGST / 2).toFixed(2));
          data.IGST = 0;
        }
        else {
          data.CGST = 0;
          data.SGST = 0;
        }
      }
      else {
        data.IGST = Number((baseAmount * (taxPercentage / 100)).toFixed(2));
        if (taxType === "CGSTSGST") {
          data.CGST = Number((data.IGST / 2).toFixed(2));
          data.SGST = Number((data.IGST / 2).toFixed(2));
          data.IGST = 0;
        }
        else {
          data.CGST = 0;
          data.SGST = 0;
        }
      }
    }
    //data.amountForGST = baseAmount;
    if (data.isInclusive) {
      data.amountWithoutGST = baseAmount - data.CGST - data.SGST - data.IGST;
      data.amountWithoutGST = Number(data.amountWithoutGST.toFixed(2));
    } else
      data.amountWithoutGST = 0;
    return data;
  }
}

export default BookingBase;
