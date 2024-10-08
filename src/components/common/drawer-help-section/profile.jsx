import React from 'react'
import ProfileImg from '../../../assets/images/help-images/003_Agency_Profile.png';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="tourwiz-profile-setup">Profile Setup</h4>
              </blockquote>
              <p>To enhance your profile, include your company logo and personal and company details, including taxation and social media information. This information will be visible to your customers on their emails, invoices, and vouchers.</p>
              <p>Additionally, you have the option to add your bank details, which will appear on invoices for your customers.</p>
              <img
                src={ProfileImg}
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

export default Profile;