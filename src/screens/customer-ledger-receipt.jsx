import React, { Component } from "react";
import Loader from "../components/common/loader";
import Amount from "../helpers/amount";
import { apiRequester_unified_api } from "../services/requester-unified-api";
import * as Global from "../helpers/global";
import * as DropdownList from "../helpers/dropdown-list";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Datecomp from "../helpers/date";

class CustomerLedgerReceipt extends Component {
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
    this.pdfRef = React.createRef();
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    this.getData()
  }

  handleResize(type) {
    const pdfElement = this.pdfRef.current;
    const pdfContainerWidth = pdfElement.offsetWidth;
    const pdfContainerHeight = pdfElement.offsetHeight;

    // Adjust the PDF content layout based on the new container dimensions
    // ...

    // Generate the updated PDF
    this.generatePDF(type);
  }

  getData = () => {
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
      scale: 1,
    })
      .then((canvas) => {
        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 200;
        var pageHeight = 495;
        var imgHeight = 200;
        var heightLeft = imgHeight;
        var doc = new jsPDF();
        // if (imgHeight > imgWidth)
        //   doc = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
        // var position = 0;

        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        if (type === "print") {
          doc.autoPrint();
          window.open(doc.output('bloburl'), '_blank');
        }
        else {
          const { invoiceNumber } = this.props.paymenthistory;
          doc.save("Receipt_" + invoiceNumber + '.pdf');
        }
      })
      .then(() => {
        this.setState({
          isprint: false
        });
      })
  }
  render() {
    let customerInfo = JSON.parse(sessionStorage.getItem("customer-info"));
    let { isLoading, data, isprint } = this.state;
    let { paymenthistory } = this.props;

    return (
      <React.Fragment>
        {isLoading &&
          <Loader />
        }
        {!isLoading &&
          <React.Fragment>
            <div className="container-fluid" id="preview" ref={this.pdfRef}>
              <div className="row  pt-4">
                <div className="col-lg-6 text-primary">
                  {/* <h6>CLTech Solutions Private Limited</h6> */}
                  <h6 className="text-uppercase">{data.agencyName}</h6>
                </div>
                <div className="col-lg-6 text-secondary" style={{ textAlign: "right" }}>
                  <button
                    data-html2canvas-ignore
                    className="btn btn-sm btn-outline-primary border mr-2"
                    onClick={() => this.handleResize("pdf")}
                  >
                    Download PDF
                  </button>
                  <button
                    data-html2canvas-ignore
                    className="btn btn-sm btn-outline-primary border mr-2"
                    onClick={() => this.handleResize("print")}
                  >
                    Print
                  </button>
                </div>
              </div>
              <hr className="border border-primary" />
              <div className="row">
                <div className="col-lg-6">
                  <div className="">
                    <small className="h6">From : </small>
                    <p className="lh-sm">{data.agencyName}
                      <br />{data.address},
                      <br />{data.city} - {data.pin},
                      <br />{data.state} , {data.country}.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="" style={{ textAlign: "right" }}>
                    <small className="h6">To : </small>
                    <p className="lh-sm">{customerInfo.displayName}
                      <br />{customerInfo.address + ', ' + customerInfo.city + ', ' + customerInfo.countryName},
                      {/* <br />{data.city} - {data.pin},
                      <br />{data.state} , {data.country}. */}
                    </p>

                  </div>
                </div>
              </div>
              <div className="row mt-0">
                <div className="col-lg-12">
                  <span className="" style={{ fontWeight: "bold" }}>Payment date : </span><Datecomp date={paymenthistory.paymentDate} />
                </div>
              </div>

              <div className="row mt-0">
                <div className="col-lg-6">
                  {data.gstNo &&
                    <React.Fragment>
                      <span className="" style={{ fontWeight: "bold" }}>GST Registration No : </span>{data.gstNo === "" ? "-" : data.gstNo}
                      <br />
                    </React.Fragment>}
                  {data.customerCareEmail &&
                    <React.Fragment>
                      <span className="" style={{ fontWeight: "bold" }}>Email : </span>{data.customerCareEmail === "" ? "-" : data.customerCareEmail}
                      <br />
                    </React.Fragment>}
                  {data.phoneNumber &&
                    <React.Fragment>
                      <span className="" style={{ fontWeight: "bold" }}>Mobile No : </span>{data.phoneNumber === "" ? "-" : data.phoneNumber}
                      <br />
                    </React.Fragment>}
                  {data?.websiteURL &&
                    <React.Fragment>
                      <span className="" style={{ fontWeight: "bold" }}>Website : </span>
                      <a
                        href={data?.websiteURL}
                        target="_blank"
                      >
                        {data.websiteURL === "" ? "" : data.websiteURL}
                      </a>
                    </React.Fragment>}
                </div>
                <div className="col-lg-6 " style={{ textAlign: "right" }}>
                  {customerInfo.gstNumber && <React.Fragment>
                    <span className="" style={{ fontWeight: "bold" }}>GST Registration No : </span>{customerInfo.gstNumber === "" ? "-" : customerInfo.gstNumber}
                    <br />
                  </React.Fragment>}
                  {customerInfo.panNumber &&
                    <React.Fragment>
                      <span className="" style={{ fontWeight: "bold" }}>PAN Number : </span>{customerInfo.panNumber === "" ? "-" : customerInfo.panNumber}
                      <br />
                    </React.Fragment>}
                  {customerInfo?.contactInformation?.email && <React.Fragment>
                    <span className="" style={{ fontWeight: "bold" }}>Email : </span>{customerInfo.contactInformation.email === "" ? "-" : customerInfo.contactInformation.email}
                    <br />
                  </React.Fragment>}
                  {customerInfo?.contactInformation?.email && <React.Fragment>
                    <span className="" style={{ fontWeight: "bold" }}>Mobile No : </span>{customerInfo.contactInformation.phoneNumber === "" ? "-" : customerInfo.contactInformation.phoneNumber}
                  </React.Fragment>}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-lg-12 d-flex justify-content-center">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Sr.</th>
                        <th scope="col" colSpan="3" style={{ width: "100%" }}>Details</th>
                        <th scope="col" className="text-nowrap">Paid Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td colSpan="3" style={{ width: "100%" }}>
                          <span>Booking</span> : {paymenthistory.business}
                          {paymenthistory.invoiceNumber &&
                            <>
                              <br /><span>Invoice Number : {paymenthistory.invoiceNumber} {/*{moment(paymenthistory.startDate).format("DD/MM/YYYY")}*/}</span>
                            </>}
                          {paymenthistory.paymentMode === "Cash" && paymenthistory.transactionToken !== undefined &&
                            <>
                              <br />
                              <span>Payment Mode: {paymenthistory.paymentMode}
                                <br />Transaction No  : {paymenthistory.transactionToken}
                              </span>
                            </>
                          }
                          {paymenthistory.paymentMode === "CreditCard" &&
                            <>
                              <br /><span>Payment Mode: {paymenthistory.paymentMode}</span>
                              <br /><span>Bank Name: {paymenthistory.bankName}</span>
                              <br /><span>Card No: {paymenthistory.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + paymenthistory.cardLastFourDigit : "---"}</span>
                            </>
                          }
                          {paymenthistory.paymentMode === "DebitCard" &&
                            <>
                              <br /><span>Payment Mode: {paymenthistory.paymentMode}</span>
                              <br /><span>Bank Name: {paymenthistory.bankName}</span>
                              <br /><span>Card No: {paymenthistory.cardLastFourDigit ? "xxxx-xxxx-xxxx-" + paymenthistory.cardLastFourDigit : "---"}</span>
                            </>
                          }
                          {paymenthistory.paymentMode === "Online" && paymenthistory.transactionToken !== undefined &&
                            <>
                              <br />
                              <span>Payment Mode: {paymenthistory.paymentMode}
                                <br />Transaction No  : {paymenthistory.transactionToken}
                              </span>
                            </>
                          }
                          {paymenthistory.paymentMode === "Cheque" &&
                            <>
                              <br /><span>Payment Mode: {paymenthistory.paymentMode}</span>
                              <br /><span >Cheque No: {paymenthistory.chequeNumber}</span>
                              <br /><span>Bank: {paymenthistory.bankName}</span>
                            </>
                          }
                        </td>
                        <td>
                          <Amount amount={paymenthistory.paidAmount}
                            currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4"><span style={{ fontWeight: "bold" }}>Total</span></td>
                        <td>
                          <span style={{ fontWeight: "bold" }}>
                            <Amount amount={paymenthistory.paidAmount}
                              currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="6">
                          <span style={{ fontWeight: "bold" }}>Amount in Words:  </span>
                          <span className="font-weight-normal">
                            {this.RsPaise(Number(paymenthistory.paidAmount) > 0 ? Number(paymenthistory.paidAmount) : Number(0))}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <span><b>Net Amount:   </b>
                            <Amount amount={paymenthistory.totalItemAmount}
                              currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                          </span>
                        </td>
                        <td colSpan="3">
                          <span><b>Due Amount:   </b>
                            <Amount amount={paymenthistory.dueAmount}
                              currencyCode={Global.getEnvironmetKeyValue("portalCurrencySymbol")} />
                          </span>
                        </td>
                      </tr>
                      {paymenthistory.comment !== "" &&
                        <tr>
                          <td colSpan="6">
                            <span><b>Comments:</b>  {paymenthistory.comment}</span>
                          </td>
                        </tr>
                      }
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

export default CustomerLedgerReceipt;
