import React from 'react'
import ManageInquiriesImg from '../../../assets/images/help-images/012_Inquiry_Filter.png';
import ManageInquiriesImg1 from '../../../assets/images/help-images/024_Inquiry_Action.png';
import ManageInquiriesImg2 from '../../../assets/images/help-images/011_Inquiry_ActivityLogs.png';
import { Link } from 'react-router-dom';

function ManageInquiries() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2  rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Manage Inquiry List & Filter options</h4>
              </blockquote>
              <p>The Manage Inquiries page provides users with a comprehensive list of all inquiries that have been created, and the filters available allow users to quickly and easily search for specific inquiries based on various criteria. The filters include inquiry type, customer name, email, phone number, inquiry source, trip type, booking source, inquiry number, created date, start date, follow-up date, and priority. This makes it easy for users to find the inquiries they are looking for and manage them efficiently.</p>
              <img
                src={ManageInquiriesImg}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>The action menu against each inquiry in the Manage Inquiries page provides several options to the user:</p>
              <img
                src={ManageInquiriesImg1}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p><strong className='text-primary'>View Inquiry:</strong> This option allows the user to view the details of the inquiry in the popup.</p>
              <p><strong className='text-primary'>Edit Inquiry:</strong> This option allows the user to modify the details of the inquiry.</p>
              <p><strong className='text-primary'>Add Itinerary:</strong> This option allows the user to create an itinerary associated with the inquiry.</p>
              <p><strong className='text-primary'>Add Proposal:</strong> This option allows the user to create a proposal associated with the inquiry.</p>
              <p><strong className='text-primary'>Add Package:</strong> This option allows the user to create a Package associated with the inquiry.</p>
              <p><strong className='text-primary'>Delete:</strong> This option allows the user to delete the inquiry if it is no longer required.</p>
              <p><strong className='text-primary'>Activity Log:</strong> This option allows the user to review the key information about the activities and modifications related to the inquiry.</p>
              <p>In addition to these options, the user can also view the details of the inquiry by clicking on the inquiry title.</p>
              <p>Furthermore, users can export the list of inquiries to a CSV file for offline viewing or analysis by clicking on the &quot;Export&quot; button. This can be helpful for generating reports or tracking the progress of inquiries over time.</p>
              <h4 id="inquiry-activity-logs" className='text-primary'>Inquiry Activity Logs</h4>
              <hr />
              <p>Activity logs are a valuable feature that allows you to track important updates and changes made to an inquiry. These logs capture and display key information about the activities and modifications related to the inquiry.</p>
              <p>The activity logs will provide a chronological record of significant events, such as changes to the follow-up date, employee assignment updates, and instances where an email was sent to the customer. This transparency allows you to have a comprehensive overview of the inquiry's history and the actions taken by various users involved in the process.</p>
              <p>By reviewing the activity logs, you can easily track the progress and any notable changes made to the inquiry, ensuring a clear and documented trail of events for reference and accountability.</p>
              <img
                src={ManageInquiriesImg2}
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

export default ManageInquiries;