import React from 'react'
import signup1 from '../../../assets/images/help-images/Signup_01.png';
import signup2 from '../../../assets/images/help-images/SignUp_02.png';
import { Link } from 'react-router-dom';
function Register() {
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
            <div class="px-2 rounded-3 tw-addon-services" >
              <blockquote>
                <h4 id="register-with-tourwiz">Register with TourWiz</h4>
              </blockquote>
              <p>To start working in TourWiz, you need to register your TourWiz account. You can sign up completely free of charge on the <Link className='text-primary' target='_blank' to="/signup">Registration page</Link>.</p>
              <h4 id="enter-your-email-address" className='text-secondary'>Enter your email address</h4>
              <p>To personalize your TourWiz experience, make sure to provide your personal and company details. After verifying your email address, you will be prompted to provide additional information such as your name, company name, and mobile number as TourWiz is a B2B platform.</p>
              <img
                src={signup1}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>To sign up for TourWiz, please follow these steps:</p>
              <ul className='list-unstyled'>
                <li>Go to the TourWiz website and click on the <strong className='text-primary'>Sign Up</strong> button.</li>
                <li>Enter your first name, last name, and company name in the appropriate fields.</li>
                <li>Select your country from the drop-down menu and choose your preferred currency in which you are operating your business.</li>
                <li>Provide a mobile number that you can be reached at, along with a password of your choice to access the TourWiz system.</li>
                <li>Verify the captcha to prove that you are not a robot.</li>
                <li>Click on the <strong className='text-primary'> Sign Up</strong> button to complete the registration process.</li>
              </ul>
              <p>Once you have successfully registered yourself on TourWiz, the system will display a <strong className='text-primary'> Welcome Aboard!</strong> message and prompt you to log in to your account for the first time.</p>
              <p>If you encounter any issues during the sign-up or login process, please contact our customer support team for assistance.</p>
              <img
                src={signup2}
                className='border border-1 border-primary  mb-4'
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

export default Register