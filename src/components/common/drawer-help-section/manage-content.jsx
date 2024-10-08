import React from 'react'
import ClaimYourWebsiteImg16 from '../../../assets/images/help-images/105_ManageWebsite_Header.png';
import ClaimYourWebsiteImg17 from '../../../assets/images/help-images/106_ManageWebsite_TextContent.png';
import ClaimYourWebsiteImg18 from '../../../assets/images/help-images/107_ManageWebsite_Locations.png';
import ClaimYourWebsiteImg19 from '../../../assets/images/help-images/108_ManageWebsite_AddLocations.png';
import ClaimYourWebsiteImg20 from '../../../assets/images/help-images/109_ManageWebsite_ListDealPackage.png';
import ClaimYourWebsiteImg21 from '../../../assets/images/help-images/110_ManageWebsite_AddDealPackage.png';
import ClaimYourWebsiteImg22 from '../../../assets/images/help-images/111_ManageWebsite_BannerImage.png';
import { Link } from 'react-router-dom';

function ManageContent() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">How to Manage Content of CMS Website?</h4>
              </blockquote>
              <p>To manage the content of your CMS website, follow these steps:</p>
              <p><strong className='text-primary'>Navigating to the Manage Content menu:</strong></p>
              <p>To access the Manage Content sub menu in TourWiz, follow these steps:</p>
              <ol>
                <li>On the TourWiz dashboard, locate and click on the <b className='text-primary'>Manage Website</b> option.</li>
                <li>Within the Manage Website menu, look for the <b className='text-primary'>Manage Content</b> sub menu. Click on the &quot;Manage Content&quot; option to proceed.</li>
              </ol>
              <p><strong className='text-primary'>Changing Website Title, Footer, and Logo:</strong></p>
              <p>To modify the website title, footer, and logo for your website, follow these steps:</p>
              <ol>
                <li>Within the Manage Content sub menu, locate the corresponding header section.</li>
                <li>Update the website title and copyright text or upload a new logo as per your requirements.</li>
                <li>Save the changes to apply them to your website.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg16}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Modifying Page Contents:</strong></p>
              <p>To update the content of specific pages on your website, such as the About Us, Terms and Conditions, and Contact Us pages, follow these steps:</p>
              <ol>
                <li>Within the Manage Content sub menu, click on the text content module.</li>
                <li>Select required option from the <strong className='text-primary'>Select Text HTML Module</strong> drop down.</li>
                <li>Edit the content according to your desired changes.</li>
                <li>Save the modifications to update the respective pages on your website.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg17}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Adding Guides for Locations:</strong></p>
              <p>To include guides for specific locations on your website, follow these steps:</p>
              <ol>
                <li>Within the Manage Content sub menu, locate the section for managing location guides.</li>
                <li>You will see the list of locations added here.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg18}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>To Add a new Location</strong></p>
              <ol>
                <li>Click on the Create Location button.</li>
                <li>Add the necessary information and details for each location guide, such as descriptions, image and any other details like overview, how to reach, weather details, what to see etc. For this you can add multiple tabs dynamically.</li>
                <li>Save the changes to make the guides accessible on your website.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg19}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Adding Special Packages and Hot Deals:</strong></p>
              <p>To feature special packages and hot deals on your website, follow these steps:</p>
              <ol>
                <li>Within the Manage Content sub menu, find the sections dedicated to special packages and hot deals.</li>
                <li>Click on the  Add Deal or Add Package button in the relevant tab.</li>
                <li>Enter the relevant information for each package or deal, including pricing, availability, and descriptions.</li>
                <li>Save the changes to display the special packages and hot deals on your website.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg20}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <img
                src={ClaimYourWebsiteImg21}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Updating Banner Image:</strong></p>
              <p>To change the banner image displayed on your website, follow these steps:</p>
              <ol>
                <li>Within the Manage Content sub menu, locate the Banner Image section.</li>
                <li>Click on the Update Banner image button.</li>
                <li>Upload a new image that you want to use as the banner.</li>
                <li>Save the changes to update the banner image on your website.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg22}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Closing Note:</strong></p>
              <p>Through the Manage Content, TourWiz offers you the ability to customize various aspects of your website. You can modify the website title, footer, logo, page contents, social media links, add location guides, include special packages and hot deals, and update the banner image. Take advantage of these features to create a personalized and engaging website that showcases your unique offerings and captivates your audience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageContent;