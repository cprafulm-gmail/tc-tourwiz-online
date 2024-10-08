import React from 'react'
import importInquiriesImg from '../../../assets/images/help-images/013_Import_Inquiry.png';
import importInquiriesImg1 from '../../../assets/images/help-images/014_Import_Inquiry_Success.png';
import { Link } from 'react-router-dom';

function ImportInquiries() {
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
                <h4 id="log-in-to-tourwiz-application">Import Inquiry</h4>
              </blockquote>
              <p>The Import Inquiry functionality allows users to import a list of inquiries into the system in bulk. This feature can be useful for companies that have a large number of inquiries to process, as it can save time and reduce errors.</p>
              <p>To import inquiries, users must first prepare a CSV file with the required information for each inquiry. The CSV file should contain the following columns:</p>
              <ul className="list-unstyled">
                <li>Inquiry Type</li>
                <li>Customer Name</li>
                <li>Customer Email</li>
                <li>Customer Phone</li>
                <li>Inquiry Priority</li>
                <li>Inquiry Source</li>
                <li>Inquiry Status</li>
                <li>Inquiry Dates</li>
                <li>Inquiry Budget</li>
                <li>Adult, Child, Infant count</li>
                <li>Follow-up Date and Time</li>
              </ul>
              <img
                src={importInquiriesImg}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once the CSV file is prepared, users can navigate to Inquiries &gt; Import Inquiries and select the file to upload. The system will automatically map the columns in the CSV file to the appropriate fields in the system.</p>
              <p>Users can also choose to send an email to the customer associated with each inquiry by providing the<strong> Send Email</strong> column value as Yes or No. This will send an email to the customer with all the details of the inquiry.</p>
              <p>After the import process is completed, users can view the imported inquiries in the Manage Inquiries section. The system will automatically assign a unique Inquiry Number to each imported inquiry.</p>
              <img
                src={importInquiriesImg1}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>If there are any errors in the import process, the system will display a detailed error message, and users can correct the errors in the CSV file and re-upload it.</p>
              <p>It is important to note that the Import Inquiry functionality requires a certain level of technical expertise, as users must be able to prepare a CSV file with the required information and understand the mapping of columns to fields in the system. Therefore, it is recommended that users familiarize themselves with the requirements and test the import process with a small number of inquiries before importing a large batch of inquiries.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportInquiries;