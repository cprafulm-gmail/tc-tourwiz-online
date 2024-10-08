import React, { useState } from 'react';
import SVGIcon from "../../helpers/svg-icon";
import { Link } from "react-router-dom";
import Config from "../../config";

function SupportForm(props) {
  const css = `
  .form-banner{
    font-size: 30px;
    color: #212529;
    border-bottom: 1px solid #ced4da;
    padding: 0 0 8px;
    margin: 0 0 28px;
    display: inline-block;
    font-weight: 500;
}
.form-control
{
  background: #f2f2f2;
  border:none;
}
.forn-btn
{
  border-radius: 48px;
  padding: 8px 48px;
  font-weight: 600;
  font-size: 18px;
  margin-top: 8px;
}
.forn-btn:hover
{
  background: #f2f2f2 !important;
  border-color:#f2f2f2 !important;
  color:#fa7438 !important;
  border-radius: 48px;
  padding: 8px 48px;
  font-weight: 600;
  font-size: 18px;
  margin-top: 8px;
}
.tw-public-pages .tw-contact-details h3 {
  color: #fa7438 !important;
  font-size: 14px;
  margin: 0px 0px 12px 0px;
}
.tw-public-pages .tw-contact-details a {
  font-size: 14px;
  margin-top: 8px;
  color: #212529;
}
.tw-public-pages .tw-contact-details {
  background: #f2f2f2 !important;
  font-size: 14px;
  color: #212529;
}
.tw-public-pages .tw-contact-details:hover{
  background: #e6e6e6 !important;
}
  `;
  const { isLoginMenu, isLoggedIn, isLoginBox, userInfo } = props;
  const [userDetail, setUserDetail] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.contactInformation.email,
    phoneNumber: userInfo.contactInformation.phoneNumber,
    code: userInfo.contactInformation.homePhoneNumberCountryCode,
    businessName: "Support",
    country: "India",
    state: "gujarat",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserDetail({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.contactInformation.email,
      phoneNumber: userInfo.contactInformation.phoneNumber,
      code: userInfo.contactInformation.homePhoneNumberCountryCode,
      comments: value,
    });
  }
  const handleEnquiryEmail = () => {
    setLoading(true);
    let reqOBJ = {
      request: {
        Domain: "https://preprod.tourwizonline.com",
        FirstName: userDetail.firstName,
        LastName: userDetail.lastName,
        BusinessName: userDetail.businessName,
        Email: userDetail.email,
        Code: userDetail.code,
        Phone: userDetail.phoneNumber,
        Country: userDetail.country,
        State: userDetail.state,
        HearAboutUs: "",
        HelpText: userDetail.comments,
        IsAllowCommunications: "Yes",
        IsAllowPersonalInformation: "Yes"
      }
    };

    let reqURL = process.env.REACT_APP_UNIFIED_API_ENDPOINT + "/tw/contactus/senddetail";
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", reqURL, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(reqOBJ));
    xhttp.onreadystatechange = () => {
      console.log("Thank You");
      setLoading(false);
      setIsSubmit(true);
    };
  };
  return (<>
    {!isSubmit &&
      <div className='col-lg-8 form-bg mb-3 mt-2'>
        <style>{css}</style>
        <div className='row mx-4'>
          <div className='col-lg-12 form-banner'>
            Get in Touch
          </div>
        </div>
        <div className='row mx-1 '>
          <div className='col'>
            <label>First Name</label>
            <input type='text' name='firstName' className='form-control' placeholder='First Name *' value={userDetail.firstName} disabled />
          </div>
          <div className='col'>
            <label>Last Name</label>
            <input type='text' name='lastName' className='form-control' placeholder='Last Name *' value={userDetail.lastName} disabled />
          </div>
        </div>
        <div className='row mx-1 mt-2'>
          <div className='col-6'>
            <label>Email</label>
            <input type='text' name='email' className='form-control' placeholder='Email' value={userDetail.email} disabled />
          </div>
          <div className='col-6'>
            <label>Mobile No</label>
            <input type='text' name='phoneNumber' className='form-control' placeholder='Contact No' value={userInfo.contactInformation.homePhoneNumberCountryCode + "-" + userDetail.phoneNumber} disabled />
          </div>
        </div>
        <div className='row mx-1 mt-2'>
          <div className='col-12'>
            <label>Comments<sup className='text-danger'>*</sup></label>
            <textarea type='text' name='comments' className='form-control' value={userDetail.comments} placeholder='comments' rows="3" onChange={(e) => handleInput(e)} />
          </div>
        </div>
        <div className='row mx-1 mt-2'>
          <div className='col-12'>
            <button className='btn btn-primary forn-btn' onClick={() => handleEnquiryEmail()}>Send</button>
          </div>
        </div>
        {/* <div className='row mx-1 mt-1 tw-public-pages'>
        <div className="tw-contact-details w-100">
          <h3>Other ways to reach us</h3>
          <a href="mailto:info@tourwizonline.com" className="d-block ml-1">
            <SVGIcon
              name="envelope"
              width="16"
              height="16"
              className="mr-2"
            ></SVGIcon>
            info@tourwizonline.com
          </a>
          <a href="mailto:sales@tourwizonline.com" className="d-block ml-1 mb-3">
            <SVGIcon
              name="envelope"
              width="16"
              height="16"
              className="mr-2"
            ></SVGIcon>
            sales@tourwizonline.com
          </a>
          <a href="https://www.facebook.com/TourWiz-101869248569536" className="d-inline m-1" target="_blank">
            <SVGIcon
              name="facebook"
              width="16"
              height="16"
              className="mr-2"
            ></SVGIcon>
          </a>
          <a href="https://twitter.com/tourwizonline" className="d-inline m-1" target="_blank">
            <SVGIcon
              name="twitter"
              width="16"
              height="16"
              className="mr-2"
            ></SVGIcon>
          </a>
          <a href="https://www.linkedin.com/company/tourwiz" className="d-inline m-1" target="_blank">
            <SVGIcon
              name="linkedin"
              width="16"
              height="16"
              className="mr-2"
            ></SVGIcon>
          </a>
          <a href="https://www.instagram.com/tourwiz" className="d-inline m-1" target="_blank">
            <SVGIcon
              name="instagram"
              width="16"
              height="16"
              className="mr-2"
              type="fill"
            ></SVGIcon>
          </a>
          <a href="https://www.youtube.com/channel/UCtoC64GHCOCfYyeElj-6mNw" className="d-inline m-1" target="_blank">
            <SVGIcon
              name="you-tube"
              width="16"
              height="16"
              className="mr-2"
              type="fill"
            ></SVGIcon>
          </a>
        </div>
      </div> */}
      </div>
    }
    {isSubmit &&
      <div className="col-lg-8 mb-3 mt-2">
        <div className="tw-contact-form">
          <div className="bg-light rounded p-4 text-center">
            <h3 className="text-primary mb-4 mt-2">
              Your query has been submitted successfully. We will get
              in touch with you soon.
            </h3>

            <p>
              If you have any other queries in the meantime, please
              don't hesitate to get in touch with us at{" "}
              <a
                href="mailto:info@tourwizonline.com"
                className="text-primary"
              >
                info@tourwizonline.com
              </a>
            </p>
          </div>
        </div>
      </div>
    }
    <div className="col-lg-4 tw-public-pages mb-5">
      <div className="tw-contact-details w-100">
        <h3>Other ways to reach us</h3>
        <a href="mailto:info@tourwizonline.com" className="d-block ml-1">
          info@tourwizonline.com
        </a>
        <a href="mailto:sales@tourwizonline.com" className="d-block ml-1 mb-3">
          sales@tourwizonline.com
        </a>
        <a href="https://www.facebook.com/TourWiz-101869248569536" className="d-inline m-1" target="_blank">
          <SVGIcon
            name="facebook"
            width="16"
            height="16"
            className="mr-2"
          ></SVGIcon>
        </a>
        <a href="https://twitter.com/tourwizonline" className="d-inline m-1" target="_blank">
          <SVGIcon
            name="twitter"
            width="16"
            height="16"
            className="mr-2"
          ></SVGIcon>
        </a>
        <a href="https://www.linkedin.com/company/tourwiz" className="d-inline m-1" target="_blank">
          <SVGIcon
            name="linkedin"
            width="16"
            height="16"
            className="mr-2"
          ></SVGIcon>
        </a>
        <a href="https://www.instagram.com/tourwiz" className="d-inline m-1" target="_blank">
          <SVGIcon
            name="instagram"
            width="16"
            height="16"
            className="mr-2"
            type="fill"
          ></SVGIcon>
        </a>
        <a href="https://www.youtube.com/channel/UCtoC64GHCOCfYyeElj-6mNw" className="d-inline m-1" target="_blank">
          <SVGIcon
            name="you-tube"
            width="16"
            height="16"
            className="mr-2"
            type="fill"
          ></SVGIcon>
        </a>
      </div>
      <div className="tw-contact-details mb-4">
        <h3>Connect on whatsapp</h3>
        <a href={window.innerWidth <= 768 ? "https://wa.me/918976997102" : "https://web.whatsapp.com/send?phone=+918976997102"} className="d-inline m-1" target="_blank">
          <SVGIcon
            name="whatsapp-green"
            width="24"
            height="24"
            className="mr-2"
          ></SVGIcon><b>+91 897 699 7102</b>
        </a>
      </div>
    </div>
  </>
  )
}

export default SupportForm;