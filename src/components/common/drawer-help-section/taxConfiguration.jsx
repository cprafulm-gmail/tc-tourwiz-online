import React from 'react'
import taxConfigImg from '../../../assets/images/help-images/005_Tax_Configuration.png';
import { Link } from 'react-router-dom';

function TaxConfiguration() {
  const css = `
  .tw-addon-services{
    text-align: left !important;
    padding: 0px 10px !important;
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
                <h4 id="tax-configurations">Tax Configurations</h4>
              </blockquote>
              <p>When setting up your business on our platform, you have the flexibility to configure taxes in accordance with your industry standards, such as for hotels, flights, excursions, etc. During the tax setup process, you can choose the name of the tax and the percentage to be applied across the system.</p>
              <p>If your business is based in India, we offer default tax setups for four types of taxes:</p>
              <ul className="list-unstyled">
                <li>Processing Fee</li>
                <li>CGST</li>
                <li>SGST</li>
                <li>IGST</li>
              </ul>
              <p>The default percentage for CGST and SGST taxes is set at 18%, which is equally divided. As a result, the default value for both CGST and SGST taxes will be 9% and applied on the Processing Fee. However, you can change the value or percentage of GST when adding pricing for any business.</p>
              <p>If you are operating a business outside of India, no default tax setup is provided as GST is not required in such cases. However, you can make use of the custom five taxes that are available on the tax configuration page.</p>
              <p>Please note that setting up tax names is a one-time process. Once you have saved the tax names, you cannot change them. However, you can modify the percentage value of the tax as many times as needed.</p>
              <p>In addition to the default taxes, you can set up to five custom taxes, where you can specify a unique name for each tax. This name will be available throughout the system wherever tax fields are present.</p>
              <img
                src={taxConfigImg}
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

export default TaxConfiguration;