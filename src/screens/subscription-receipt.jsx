import React, { Component } from "react";
import Loader from "../components/common/loader";
import Amount from "../helpers/amount";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import * as Global from "../helpers/global";
import moment from "moment";
import * as DropdownList from "../helpers/dropdown-list";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class SubscriptionReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        city: "",
        state: "",
        country: "",
        providerType: "",
        agencyName: "",
        address: "",
        postalCode: "",
      },
      isLoading: false,
      isprint: false,
    };
  }
  componentDidMount() {
    this.getData()
  }
  getData = () => {
    const { userInfo: { agentID, userID } } = this.props;
    const reqOBJ = {
    };
    let reqURL = "admin/user/details";
    this.setState({ isLoading: true });
    apiRequester_unified_api(reqURL, reqOBJ, function (resonsedata) {
      let data = resonsedata.response[0]
      this.setState({
        data: data,
        isLoading: false,
      })
    }.bind(this), "GET");
  }
  Rs = (amount) => {
    var words = new Array();
    words[0] = 'Zero';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    var op;
    amount = amount.toString();
    var atemp = amount.split('.');
    var number = atemp[0].split(',').join('');
    var n_length = number.length;
    var words_string = '';
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      var value = '';
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + ' ';
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += 'Crores ';
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += 'Lakhs ';
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += 'Thousand ';
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += 'Hundred ';
        } else if (i == 6 && value != 0) {
          words_string += 'Hundred ';
        }
      }
      words_string = words_string.split(' ').join(' ');
    }
    return words_string;
  }
  RsPaise = (n) => {
    let portalCurrency = Global.getEnvironmetKeyValue("portalCurrencyCode");
    let { currencyName, decimalCurrencyName } = DropdownList.CurrencyList.find(x => x.ISOCode === portalCurrency);

    var nums = n.toString().split('.')
    var whole = this.Rs(nums[0])
    if (nums[1] == null) nums[1] = 0;
    if (nums[1].length == 1) nums[1] = nums[1] + '0';
    if (nums[1].length > 2) {
      nums[1] = nums[1].substring(2, nums[1].length - 1)
    }
    if (nums.length == 2) {
      if (nums[0] <= 9) {
        nums[0] = nums[0] * 10
      } else {
        nums[0] = nums[0]
      };
      var fraction = this.Rs(nums[1])
      var op = '';
      if (whole == '' && fraction == '') {
        op = 'Zero only';
      }
      if (whole == '' && fraction != '') {
        op = ' ' + fraction + ' ' + decimalCurrencyName + ' only';
      }
      if (whole != '' && fraction == '') {
        op = currencyName + ' ' + whole + ' only';
      }
      if (whole != '' && fraction != '') {
        op = currencyName + ' ' + whole + 'and ' + fraction + ' ' + decimalCurrencyName + ' only';
      }
      var amt = n;
      if (amt > 999999999.99) {
        op = 'Oops!!! The amount is too big to convert';
      }
      if (isNaN(amt) == true) {
        op = 'Error : Amount in number appears to be incorrect. Please Check.';
      }
      return op;
    }
  }
  generatePDF = (type) => {
    this.setState({
      isprint: true
    }, () => this.doHtml2canvas(type));
  }
  doHtml2canvas = (type) => {
    html2canvas(document.querySelector("#preview"), {
      logging: false,
      useCORS: true,
      width: 788,
      height: 790,
      windowWidth: 1366,
      scale: 1,
    })
      .then((canvas) => {
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 212;
        var pageHeight = 495;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        if (imgHeight > imgWidth)
          doc = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
        var position = 0; // give some top padding to first page

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        //heightLeft -= pageHeight;

        // while (heightLeft >= 0) {
        //   position += heightLeft - imgHeight; // top padding for other pages
        //   doc.addPage();
        //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        //   heightLeft -= pageHeight;
        // }
        if (type === "print") {
          doc.autoPrint();
          window.open(doc.output('bloburl'), '_blank');
        }
        else {
          const { transactionToken } = this.props.paymenthistory;
          doc.save("Receipt_" + transactionToken + '.pdf');
        }
      })
      .then(() => {
        this.setState({
          isprint: false
        });
      })
  }
  render() {
    let { isLoading, data, isprint } = this.state;
    let { paymenthistory } = this.props;
    let gmtTimeDifference = (new Date()).getTimezoneOffset() * -1;
    return (
      <React.Fragment>
        {isLoading &&
          <Loader />
        }
        {!isLoading &&
          <React.Fragment>
            <div className="container-fluid" id="preview">
              <div className="row  pt-4">
                <div className="col-lg-6 text-primary">
                  <h6>CLTech Solutions Private Limited</h6>
                </div>
                <div className="col-lg-6 text-secondary" style={{ textAlign: "right" }}>
                  <button
                    data-html2canvas-ignore
                    className="btn btn-sm btn-outline-primary border mr-2"
                    onClick={() => this.generatePDF("pdf")}
                  >
                    Download PDF
                  </button>
                  <button
                    data-html2canvas-ignore
                    className="btn btn-sm btn-outline-primary border mr-2"
                    onClick={() => this.generatePDF("print")}
                  >
                    Print
                  </button>
                </div>
              </div>
              <hr className="border border-primary" />
              <div className="row">
                <div className="col-lg-6 pl-3">
                  <div>
                    <small className="h6">From : </small>
                    <p className="lh-sm">CLTech Solutions Private Limited
                      <br />301,Baleshwar Avenue,
                      <br /> Opp. Rajpath Club,
                      <br />S.G. Road, Satellite,
                      <br />Ahmedabad - 380015
                    </p>
                    <span className="" style={{ fontWeight: "bold" }}>GST Registration No : </span>24AAJCC2604C1ZB
                    <br /><span className="" style={{ fontWeight: "bold" }}>PAN Number : </span>AAJCC2604C1
                    <br /><span className="" style={{ fontWeight: "bold" }}>Transaction ID : </span>{paymenthistory.transactionToken}
                    <br /><span className="" style={{ fontWeight: "bold" }}>Payment Mode : </span>{paymenthistory.paymentGateway}
                    <br /><span className="" style={{ fontWeight: "bold" }}>Payment Date : </span>
                    <React.Fragment>
                      {moment(paymenthistory.paymentDate).add(gmtTimeDifference, 'minutes')
                        .format(Global.getEnvironmetKeyValue("DisplayDateFormate") + " hh:mm A")
                      }</React.Fragment>
                  </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="" style={{ textAlign: "right" }}>
                    <small className="h6">To : </small>
                    <p className="lh-sm">{data.agencyName}
                      <br />{data.address},
                      <br />{data.city} - {data.pin},
                      <br />{data.state} , {data.country}.
                    </p>
                    {data.gstNo !== "" &&
                      <React.Fragment>
                        <span className="" style={{ fontWeight: "bold" }}>GST Registration No : </span>
                      </React.Fragment>}
                    {data.gstNo === ""
                      ? ""
                      : <React.Fragment>
                        {data.gstNo} < br />
                      </React.Fragment>}
                    {data.panNo !== "" &&
                      <React.Fragment>
                        <span className="" style={{ fontWeight: "bold" }}>PAN Number : </span>
                      </React.Fragment>}
                    {data.panNo === ""
                      ? ""
                      : <React.Fragment>
                        {data.panNo}<br />
                      </React.Fragment>}
                    <span className="" style={{ fontWeight: "bold" }}>Email : </span>{data.customerCareEmail === "" ? "-" : data.customerCareEmail}
                    <br /><span className="" style={{ fontWeight: "bold" }}>Mobile No : </span>{data.phoneNumber === "" ? "-" : data.phoneNumber}
                    <br />
                    {data?.websiteURL &&
                      <span className="" style={{ fontWeight: "bold" }}>Website : </span>} <a
                        href={data?.websiteURL}
                        target="_blank"
                      >
                      {data.websiteURL === "" ? "" : data.websiteURL}
                    </a>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-lg-12 d-flex justify-content-center">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Sr.</th>
                        <th scope="col" colSpan="3" style={{ width: "100%" }}>Details</th>
                        <th scope="col">Subscription Fee</th>
                        <th scope="col">Discount</th>
                        {paymenthistory.gstAmount > 0 && <th scope="col">GST</th>}
                        <th scope="col">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td colSpan="3" style={{ width: "100%" }}>
                          <span style={{ fontWeight: "bold" }}>Plan Details</span> : {paymenthistory.planDetails}
                          <br />Plan Start Date : {moment(paymenthistory.startDate).format("DD/MM/YYYY")}
                          <br />Plan End Date   : {moment(paymenthistory.endDate).format("DD/MM/YYYY")}
                        </td>
                        <td>
                          <Amount amount={paymenthistory.subscriptionFee}
                            currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR"
                              ? "USD"
                              : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                        </td>
                        <td>
                          <Amount amount={paymenthistory.discountAmount}
                            currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR"
                              ? "USD"
                              : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                        </td>
                        {paymenthistory.gstAmount > 0 &&
                          <td>
                            <Amount amount={paymenthistory.gstAmount}
                              currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR"
                                ? "USD"
                                : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                          </td>}
                        <td>
                          <Amount amount={paymenthistory.totalPaymentAmount}
                            currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR"
                              ? "USD"
                              : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="6"><span style={{ fontWeight: "bold" }}>Total</span></td>
                        {paymenthistory.gstAmount > 0 &&
                          <td>
                            <span style={{ fontWeight: "bold" }}>
                              <Amount amount={paymenthistory.gstAmount}
                                currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR"
                                  ? "USD"
                                  : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                            </span>
                          </td>}
                        <td>
                          <span style={{ fontWeight: "bold" }}>
                            <Amount amount={paymenthistory.totalPaymentAmount}
                              currencyCode={Global.getEnvironmetKeyValue("portalCurrencyCode") !== "INR"
                                ? "USD"
                                : Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="8">
                          <span style={{ fontWeight: "bold" }}>Amount in Words:</span><br />
                          <span style={{ fontWeight: "bold" }}>
                            {this.RsPaise(Number(paymenthistory.totalPaymentAmount) > 0 ? Number(paymenthistory.totalPaymentAmount) : Number(0))}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-12">
                  <p>This is a computer generated receipt and does not require signature.</p>
                </div>
              </div>
            </div>
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default SubscriptionReceipt;
