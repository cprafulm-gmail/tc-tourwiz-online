import React from 'react'
import agencyConfigImg1 from '../../../assets/images/help-images/006_Agency_Configuration.png';
import agencyConfigImg2 from '../../../assets/images/help-images/007_Agency_Configuration.png';
import { Link } from 'react-router-dom';

function AgencyConfiguration() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="agency-configurations">Agency Configurations</h4>
              </blockquote>
              <h4 id="icon-gear-invoice-template" className='text-primary'><i class="fa fa-gear"></i>  Invoice Template</h4>
              <hr className='text-secondary' />
              <p>As you set up your TourWiz profile, you have the option to customize your invoice template design and invoice prefix from the Agency Configuration page. We currently offer two different invoice template designs, with the default being the Horizontal Invoice template. You can change the template to any of the available designs as needed. Depending on your selection, all invoices generated for your customers through the TourWiz application will be either vertical or horizontal.</p>
              <img
                src={agencyConfigImg1}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="icon-gear-invoice-number-prefix" className='text-primary'><i class="fa fa-gear"></i>  Invoice Number Prefix</h4>
              <hr className='text-secondary' />
              <p>After making a booking or creating a manual invoice directly from the system, an invoice number will be generated as either INV0000000001 or M-INV0000000001, respectively. We also allow you to set a prefix for the invoice number, which is a one-time process. Once you set the prefix, it cannot be changed again. For example, if you set the invoice prefix as <strong className="text-primary">KT</strong> the invoice numbers generated after the setup will be either KT0000000001 or M-KT0000000001.</p>
              <img
                src={agencyConfigImg2}
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

export default AgencyConfiguration;