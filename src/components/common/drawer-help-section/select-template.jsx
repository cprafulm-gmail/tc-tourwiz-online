import React from 'react'
import ClaimYourWebsiteImg15 from '../../../assets/images/help-images/112_ManageWebsite_Template.png';

function SelectTemplate() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">How to change Template of CMS Website?</h4>
              </blockquote>
              <p>TourWiz provides the flexibility to change the template of your CMS website using the available predefined templates. To apply a new template to your website, follow these steps:</p>
              <ol>
                <li>From the Dashboard, find and click on the &quot;Manage Website&quot; option.</li>
                <li>Within the Manage Website menu, look for the &quot;Select Template&quot; option. Click on the &quot;Select Template&quot; page to proceed.</li>
                <li>On the Select Template page, you will find a collection of predefined templates.</li>
                <li>Browse through the available templates and select the one you want to apply to your website.</li>
                <li>Click on the chosen template to initiate the process of changing your website's template.</li>
                <li>The system will automatically update your website's template while preserving your existing content.</li>
                <li>Once the process completes, your website will have a new design and layout based on the selected template.</li>
              </ol>
              <img
                src={ClaimYourWebsiteImg15}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>It's important to note that changing the template will only affect the visual appearance and layout of your website. Your content, including text, images, and other elements, will remain intact. This allows you to refresh the look of your website without the need to recreate or modify your existing content.</p>
              <p>Enjoy the flexibility and freedom to experiment with different templates in TourWiz, allowing you to personalize and enhance the visual appeal of your CMS website.</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectTemplate;