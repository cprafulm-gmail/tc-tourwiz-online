import React from 'react'
import ClaimYourWebsiteImg1 from '../../../assets/images/help-images/100_ClaimWebsiteLink.png';
import ClaimYourWebsiteImg2 from '../../../assets/images/help-images/094_ClaimWebsite.png';
import ClaimYourWebsiteImg3 from '../../../assets/images/help-images/095_ClaimedWebsite.png';
import ClaimYourWebsiteImg4 from '../../../assets/images/help-images/093_CMSWebsite.png';
import ClaimYourWebsiteImg5 from '../../../assets/images/help-images/096_PackageDetails.png';
import ClaimYourWebsiteImg6 from '../../../assets/images/help-images/097_SharePackageCMS.png';
import ClaimYourWebsiteImg7 from '../../../assets/images/help-images/113_ShareLink.png';
import ClaimYourWebsiteImg8 from '../../../assets/images/help-images/098_InquirySentCMS.png';
import ClaimYourWebsiteImg9 from '../../../assets/images/help-images/099_CMSInquiryCRM.png';
import ClaimYourWebsiteImg10 from '../../../assets/images/help-images/101_Website_SubDomainMenu.png';
import ClaimYourWebsiteImg11 from '../../../assets/images/help-images/102_EnterSubdomain.png';
import ClaimYourWebsiteImg12 from '../../../assets/images/help-images/103_CheckAvailability.png';
import ClaimYourWebsiteImg13 from '../../../assets/images/help-images/104_SubDomainChanged.png';
import ClaimYourWebsiteImg14 from '../../../assets/images/help-images/104_SubDomainChanged.png';

import { Link } from 'react-router-dom';

function ClaimYourWebsite() {
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
                <h4 id="log-in-to-tourwiz-application">Claim Your Website</h4>
              </blockquote>
              <p>Get your own mobile-friendly CMS-based website at a fraction of the cost of getting it developed outside! Showcase your packages and deals to customers, allow them to send inquiries, view itineraries, invoices, bookings and even make payments against invoices online!</p>
              <ul className="list-unstyled">
                <li>Ready templates to choose from</li>
                <li>Easily customizable with your logo, branding and content</li>
                <li>No additional hosting charges</li>
                <li>Mapping with your own domain</li>
                <li>CMS based website with your branding</li>
                <li>Easily Manage your own website content</li>
                <li>Inquirable Fixed Packages</li>
                <li>Hot Deals and Promotions</li>
                <li>Clients can submit inquiries and you get inquiry in your CRM</li>
                <li>Customers can view itineraries, Proposals, packages, invoices and bookings online</li>
              </ul>
              <h4 id="how-to-get-cms-website" className='text-primary'>How to get CMS Website?</h4>
              <hr />
              <p>Once you register with TourWiz, you can have your own customizable <strong className='text-primary'>CMS Website</strong> with your own branding, logo, and content.</p>
              <p><strong className='text-primary'>Navigation:</strong></p>
              <p>After logging in to TourWiz, you will land on the dashboard. To reach the dashboard, simply follow these steps:</p>
              <ol>
                <li>Look for the navigation menu on the left-hand side of the screen.</li>
                <li>Click on the <strong className='text-primary'>Dashboard</strong> option to proceed.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg1}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Claiming Your Website</strong></p>
              <p>To claim your website in TourWiz, follow these steps:</p>
              <ol>
                <li>On the dashboard, find the <strong className='text-primary'>Claim Your Website</strong> link or navigate to the <strong className='text-primary'>Claim Website</strong> menu.</li>
                <li>Click on the link or menu to proceed with the website claiming process.</li>
                <li>Once you reach on the Claim Website page, you will see the default website URL mentioned on the page.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg2}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>To claim your website, follow these steps:</strong></p>
              <ol>
                <li>After reviewing the default website URL, click on the &quot;Proceed&quot; button to initiate the claiming process.</li>
                <li>Follow any additional instructions or prompts provided by TourWiz to complete the claiming process.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg3}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Accessing the CMS Website URL:</strong></p>
              <p>Once the claiming process is successfully completed, TourWiz will provide you with a CMS website URL. To access it, follow these steps:</p>
              <ol>
                <li>Look for the CMS website URL displayed on the screen after the claiming process is finished.</li>
                <li>Click on the provided URL to access your CMS website.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg4}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="how-to-get-cms-website" className='text-primary'>Exploring Marketplace Packages and Your Own Packages:</h4>
              <hr />
              <p>Upon accessing your CMS website, you will have access to all the available Marketplace packages as well as your own packages, deals, and other offerings. Here's how to navigate and explore them:</p>
              <ol>
                <li>Browse through the different sections and pages of your website to locate the package listings.</li>
                <li>On the website, you will find the Marketplace packages, which include various tours and services offered by different suppliers.</li>
                <li>Additionally, you can explore and manage your own packages, deals, and other customized offerings from your website's CMS.</li>
              </ol>
              <p><strong className='text-primary'>Viewing Package Details:</strong></p>
              <p>For any package or deal, you can view its details. Here's how:</p>
              <ol>
                <li>Click on the desired package from the list of available packages.</li>
                <li>The system will display the package details, including the overview, itinerary, inclusions, exclusions, terms and condition and any additional information.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg5}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Sharing Packages with Customers:</strong></p>
              <hr />
              <p>To share a package with your customers, follow these steps:</p>
              <ol>
                <li>While viewing the package details, locate the <strong className='text-primary'>Share package</strong> button.</li>
                <li>Click on the button, and the web link of the package will be automatically copied to your clipboard.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg6}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Choosing a Sharing Method:</strong></p>
              <p>Once you have copied the package link, you can share it with your customers through various platforms such as WhatsApp, Facebook, email, or any other preferred method.</p>
              <ol>
                <li>Open the desired platform or communication channel.</li>
                <li>Paste the copied package link into the message or post field.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg7}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Customer Inquiry Submission:</strong></p>
              <p>When a customer opens the shared package link, they will have the ability to send an inquiry directly. Here's how it works:</p>
              <ol>
                <li>The customer views the package details by clicking on the shared package link.</li>
                <li>Within the package details page, the customer can find the &quot;Send Inquiry&quot; button.</li>
                <li>After filling out the basic requirement, the customer can submit an inquiry regarding the package.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg8}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Managing Inquiries in TourWiz CRM:</strong></p>
              <p>Once a customer sends an inquiry, you will receive it in your TourWiz CRM. The CRM system automatically captures and stores inquiries for easy management. Here's how to handle inquiries:</p>
              <ol>
                <li>Log in to your TourWiz account and navigate to the Inquiries section.</li>
                <li>Locate the <strong className='text-primary'> Manage Inquiries</strong> menu within the Inquiries.</li>
                <li>Here, you will find all the inquiries submitted by customers.</li>
                <li>You can communicate with the customer and supplier, negotiate deals, and manage the entire process through the TourWiz CRM.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg9}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Closing Note:</strong></p>
              <p>TourWiz provides a comprehensive platform that allows you to claim and manage your website seamlessly. By utilizing the CMS, you can access both the Marketplace packages and your own offerings, enabling you to provide a wide range of tour options to your customers. Enjoy the flexibility and convenience of TourWiz's website management features to enhance your tour business effectively.</p>
              <h4 id="how-to-get-cms-website" className='text-primary'>How to change sub domain for CMS Website?</h4>
              <hr />
              <p>We offer complete flexibility when it comes to the domain name for your website. Choose your preferred option to get started. You can always switch later.</p>
              <p>Once you claim your CMS website then you will get a default website link. For ex: <a href="https://amigotravels801.yourtripplans.com" className='text-primary'>https://amigotravels801.yourtripplans.com</a></p>
              <p>If you want to change the sub domain of your website like <strong className='text-primary ml-1'>https://amigotravels.yourtripplans.com</strong> then you have to follow the below steps.</p>
              <p><strong className='text-primary'>Navigating to the Manage Website Menu:</strong></p>
              <p>To access the Manage Website menu in TourWiz, follow these steps:</p>
              <ol>
                <li>On the TourWiz dashboard, look for the navigation menu on the left-hand side of the screen.</li>
                <li>Click on the <strong className='text-primary'>Manage Website</strong> option to proceed.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg10}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Choosing a Subdomain:</strong></p>
              <p>To select a subdomain for your website, follow these steps:</p>
              <ol>
                <li>Within the Manage Website menu, locate the <strong className='text-primary'>Option 2</strong> section.</li>
                <li>In the text box provided, enter the subdomain of your choice.</li>
                <li>Make sure to follow any specified guidelines or restrictions for the subdomain.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg11}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Choosing a Subdomain:</strong></p>
              <p>To select a subdomain for your website, follow these steps:</p>
              <ol>
                <li>Within the Manage Website menu, locate the <strong className='text-primary'> Option 2</strong> section.</li>
                <li>In the text box provided, enter the subdomain of your choice.</li>
                <li>Make sure to follow any specified guidelines or restrictions for the subdomain.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg12}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Checking Subdomain Availability:</strong></p>
              <p>To check if the subdomain is available, follow these steps:</p>
              <ol>
                <li>After entering your desired subdomain in the text box, click on the &quot;Check Availability&quot; button.</li>
                <li>The system will perform a check to determine if the subdomain is available for use.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg13}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Proceeding with Subdomain Selection:</strong></p>
              <hr />
              <p>If the subdomain you entered is available, follow these steps:</p>
              <ol>
                <li>Upon checking the availability, if the subdomain is indeed available, the system will display a &quot;Proceed&quot; button.</li>
                <li>Click on the &quot;Proceed&quot; button to continue with the process.</li>
                <li>Once you click on the &quot;Proceed&quot; button, the system will initiate the process.</li>
                <li>After the process completes, your website domain will be updated as per the subdomain you selected.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg14}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>Closing Note:</strong></p>
              <p>TourWiz provides the flexibility to customize your website domain by selecting a subdomain of your choice. By following the steps outlined above, you can seamlessly change your website domain to better suit your preferences and branding. Enjoy the enhanced control over your website's identity within the TourWiz platform.</p>
              <h4 id="how-to-get-cms-website" className='text-primary'>How to Host Website on your domain?</h4>
              <hr />

              <p>You already have a domain and would like us to host your CMS website there, All you need to do is provide us with the information. This option will allow us to map your website to your own domain.</p>
              <p>If you need any assistance with your custom domain setup, please send us a message <a href="https://www.tourwizonline.com/contact-us" target="_blank">here</a> or at <a href="mailto:sales@tourwizonline.com" class="text-primary">sales@tourwizonline.com</a></p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimYourWebsite;