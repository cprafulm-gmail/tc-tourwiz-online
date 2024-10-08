import React from 'react'
import LoginImg from '../../../assets/images/help-images/signin.png';
import { Link } from 'react-router-dom';

function Login() {
  const css = `
  .tw-addon-services{
    text-align: left !important;
    padding-left: 0.5rem !important;
  } 
  `
  return (
    <div className='row help-content-item'>
      <style>{css}</style>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2  rounded-3 tw-addon-services" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Log in to TourWiz application</h4>
              </blockquote>
              <p>When you run the TourWiz application for the first time and opens the login page system will prompt you to enter your login information in the fields.</p>
              <p>Email address is the account address, for example demotravels@gmail.com. Enter the password for your account. Verify captcha and click the Sign In button. If you need any assistance with your registered email address or password, please send us a
                <Link className='text-primary' target='_blank' to="/contact-us">message here</Link> or at <a href="mailto:sales@tourwizonline.com" class="text-primary">sales@tourwizonline.com</a></p>
              <p>To access your TourWiz account with the Freemium plan, log in to your account. After logging in, you will be taken to the dashboard page, where you can view a summary of your account information.</p>
              <img
                src={LoginImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;