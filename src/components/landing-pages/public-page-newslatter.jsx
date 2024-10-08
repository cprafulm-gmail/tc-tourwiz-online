import React from "react";
import TwLogo from "../../assets/images/tw/tw-mail-logo.png";
import NWLogo from "../../assets/images/tw/newsletter-logo.png";
import Form from "../../components/common/form";
import { Link } from "react-router-dom";
import { GoogleSpreadsheet } from "google-spreadsheet";

const SHEET_ID = `640967144`
const SPREADSHEET_ID = `1zR5j6B-zJBS2Of-VDpM7q8FUur7FOZG4j52ravicDHo`
const credentials = require(`./service-account.json`)
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const appendSpreadsheetOG = async (row) => {
  try {

    await doc.useServiceAccountAuth(credentials);
    await doc.createNewSpreadsheetDocument({ title: 'Tourwiz - Subscriptions' });
    //await doc.createNewSpreadsheetDocument({ title: 'This is a new doc' });
    await doc.loadInfo();
    //const newSheetzx = await doc.getSheetByName('emails');
    // const newSheet = await doc.addSheet({ title: 'hot new sheet!', headerValues: ['name', 'email'] });
    //const larryRow = await newSheet.addRow(row);
    const newSheet = await doc.addSheet({ title: 'Subscriptions', headerValues: ['name', 'email'] });
    const sheet = doc.sheetsByIndex[0];
    const result = await sheet.addRow(row);

  } catch (e) {
  }
};
const appendSpreadsheet = async (row) => {
  try {
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const sheet = doc.sheetsById[SHEET_ID];
    const result = await sheet.addRow(row);
  } catch (e) {
  }
};
class NewsLatter extends Form {
  state = {
    data: {
      name: "",
      email: "",
    },
    isButtonLoding: false,
    errors: {},
    isNewsLatterSubmited: false,
  };

  sendNewsLatterEmail = () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    let data = this.state.data;
    this.setState({ isNewsLatterSubmited: true }, () => this.handlenewsLatterEmail());
  };

  handlenewsLatterEmail = () => {
    this.setState({ isButtonLoding: true });
    let htmlBody = document.getElementById("emailHTML").outerHTML;
    let textBody = "";
    let reqOBJ = {
      name: this.state.data?.name,
      toemail: this.state.data?.email
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/cms/page/newsletter/send";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      this.state.data?.email && appendSpreadsheet(this.state.data);
      var fadeTarget = document.getElementById("thankyoumsg");
      fadeTarget.style.display = "block";
      var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
        } else {
          clearInterval(fadeEffect);
        }
      }, 2000);
      this.setState({ isButtonLoding: false, data: { name: "", email: "" } });
    };
  };


  validate = () => {
    const errors = {};
    const { data } = this.state;
    if (!this.validateFormData(data.name, "require"))
      errors.name = "Required";
    else if (!this.validateFormData(data.name, "alpha_space"))
      errors.name = "Required";

    if (!this.validateFormData(data.email, "require"))
      errors.email = "Required";
    else if (!this.validateFormData(data.email, "email"))
      errors.email = "Required";

    return Object.keys(errors).length === 0 ? null : errors;
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isNewsLatterSubmited, errors } = this.state;
    return (
      <div className="tw-newslatter">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 newslatter-content">
              <div>
                <h1>Sign up for our Newsletter</h1>
                <p className="mt-2">
                  Join our mailing list and get regular product news, updates <br />plus useful tips & tricks every week to help you
                  grow your travel business.
                </p>
              </div>
              <div className={errors.name === "Required" ? "col-lg-12 mt-3 p-0 required" : "col-lg-12 p-0 mt-3"}>
                {this.renderInputPlaceholder("name", "Name *")}
              </div>
              <div className={(errors.email === "Required") ? "col-lg-12 p-0 mt-3 required" : "col-lg-12 p-0 mt-3"}>
                {this.renderInputPlaceholder("email", "Email *")}
              </div>
              <div className="col-lg-12 text-center mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.sendNewsLatterEmail}
                >
                  {this.state.isButtonLoding && (
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                  )}
                  Sign up
                </button>
              </div>
              <div className="thankyou thankyou-success" id="thankyoumsg" style={{ display: "none" }}>
                Thank you for subscribing</div>
              {isNewsLatterSubmited && (
                <div style={{ display: "none" }}>
                  <div id="emailHTML">
                    <div className="tw-mail-body">
                      <table style={{ paddingRight: "0px", paddingLeft: "0px", fontSize: "12px", paddingBottom: "0px", margin: "0px", color: "#3f3f3f", paddingTop: "0px", backgroundColor: "#ffffff", fontFamily: "Montserrat, sans-serif" }} cellSpacing="0" cellPadding="0" border="0">
                        <tbody>
                          <tr>
                            <td align="center">
                              <table style={{ margin: "20px", width: "600px", textAlign: "left" }} cellSpacing="4" cellPadding="0" border="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <table style={{ width: "100%", height: "100%" }} cellSpacing="0" cellPadding="0" border="0">
                                        <tbody>
                                          <tr>
                                            <td style={{ background: "#fff", border: "1px solid #CCCCCC" }}>
                                              <table>
                                                <tr>
                                                  <td>
                                                    <Link title="TourWiz" alt="TourWiz" to="https://www.tourwizonline.com">
                                                      <img title="TourWiz" alt="TourWiz" src={TwLogo} border="0" style={{ width: "200px" }} />
                                                    </Link>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <table style={{ padding: "20px", background: "#fff", width: "100%" }} cellSpacing="2" cellPadding="0" border="0">
                                        <tbody>
                                          <tr>
                                            <td style={{ padding: "5px", background: "#e7f0ff", width: "25%", color: "#326db5", textAlign: "right", fontSize: "12px" }}>
                                              Name
                                            </td>
                                            <td style={{ padding: "5px", background: "#e5e5e5", color: "#333333", fontSize: "12px" }}>
                                              {this.state.data?.name}
                                            </td>
                                          </tr>

                                          <tr>
                                            <td style={{ padding: "5px", background: "#e7f0ff", width: "25%", color: "#326db5", textAlign: "right", fontSize: "12px" }}>
                                              Email
                                            </td>
                                            <td style={{ padding: "5px", background: "#e5e5e5", color: "#333333", fontSize: "12px" }}>
                                              <a style={{ fontWeight: "bold", color: "#29506f", textDecoration: "none" }} href={"mailto:" + this.state.data?.email}>{this.state.data?.email}</a>
                                            </td>
                                          </tr>

                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div id="thankYouEmailHTML">
                    <div className="tw-mail-body">
                      <table style={{ paddingRight: "0px", paddingLeft: "0px", fontSize: "12px", paddingBottom: "0px", margin: "0px", color: "#3f3f3f", paddingTop: "0px", backgroundColor: "#ffffff", fontFamily: "Montserrat, sans-serif" }} cellSpacing="0" cellPadding="0" border="0">
                        <tbody>
                          <tr>
                            <td align="center">
                              <table style={{ margin: "20px", width: "600px", textAlign: "left" }} cellSpacing="4" cellPadding="0" border="0">
                                <tbody>
                                  <tr>
                                    <td>
                                      <table style={{ width: "100%", height: "100%" }} cellSpacing="0" cellPadding="0" border="0">
                                        <tbody>
                                          <tr>
                                            <td style={{ background: "#fff", border: "1px solid #CCCCCC" }}>
                                              <table>
                                                <tr>
                                                  <td>
                                                    <Link title="TourWiz" alt="TourWiz" to="https://www.tourwizonline.com">
                                                      <img title="TourWiz" alt="TourWiz" src={TwLogo} border="0" style={{ width: "200px" }} />
                                                    </Link>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <table style={{ padding: "20px", background: "#f9f9f9" }} cellSpacing="0" cellPadding="0" border="0">
                                        <tbody>
                                          <tr>
                                            <td style={{ padding: "20px 20px 0px 20px" }}>Dear <b style={{ color: "#29506f" }}>{this.state.data?.name}</b>,</td>
                                          </tr>
                                          <tr>
                                            <td style={{ padding: "20px 20px 20px 20px" }}>
                                              <p>
                                                <br />
                                                Thank you for subscribing to our mailing list.
                                                <br />
                                                <br />
                                                You will now receive regular high quality content, including industry news, trends
                                                and tips that will help you grow your business, covering a wide array of topics
                                                ranging from travel technology to sales and marketing to operations. You will also
                                                be the first to hear of our special offers and product releases.
                                                <br />
                                                <br />
                                                Please be assured that your details will remain confidential and will not be shared
                                                with third-parties.
                                                <br />
                                                <br />
                                                Regards,<br />	<a style={{ fontWeight: "bold", color: "#29506f", textDecoration: "none" }} title="TourWiz" href="https://www.tourwizonline.com" target="_blank">TourWiz</a>
                                                | <a style={{ fontWeight: "bold", color: "#1e1e1e", textDecoration: "none" }} title="TourWiz" href="https://www.tourwizonline.com" target="_blank">www.tourwizonline.com</a>
                                                <br />
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsLatter;