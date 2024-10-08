import React from 'react'
import createInquiryImg1 from '../../../assets/images/help-images/016_Inquiry_Navigation.png';
import createInquiryImg2 from '../../../assets/images/help-images/008_Create_Inquiry.png';
import createInquiryImg3 from '../../../assets/images/help-images/009_Create_Inquiry_AddCustomer.png';
import createInquiryImg4 from '../../../assets/images/help-images/010_Create_Inquiry_AddCorporate.png';
import createInquiryImg5 from '../../../assets/images/help-images/025_Inquiry_Email.png';
import { Link } from 'react-router-dom';

function CreateInquiries() {
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
            <div class="px-2-4 rounded-3 tw-addon-services" >
              <blockquote>
                <h4 id="inquiry-module">Inquiry Module</h4>
              </blockquote>
              <p>TourWiz ensures you have all your inquiries and customer details at your fingertips to fulfill client needs quickly and more effectively. With our Travel CRM you can oversee your entire sales pipeline and streamline your marketing activities to maximize bookings.</p>
              <p>The Inquiry module is a valuable feature that streamlines the process of managing customer inquiries, from the beginning until they are resolved. With this module, you can easily create and track inquiries through their entire life cycle.</p>
              <ul className="list-unstyled">
                <li>Add and manage all your leads &amp; customers at one place</li>
                <li>Capture inquiries from multiple sources</li>
                <li>Build Proposals and itineraries from inquiries</li>
                <li>Use our travel database for Proposals and/or add your own services(Visa, Forex etc)</li>
                <li>Set lead status and follow up</li>
                <li>Sales Pipeline View</li>
                <li>Generate branded quotes, invoices and booking vouchers</li>
                <li>Add bookings and manage their status(booked,confirmed,canceled etc)</li>
                <li>Import your existing inquiries from Excel with one click</li>
                <li>Configure follow up dates for inquiries through a calendar view and get alerts on dashboard</li>
                <li>Travel CRM</li>
              </ul>

              <h4 id="navigation" className='text-primary'>Navigation</h4>
              <hr />
              <p>To create an inquiry, there are two options available to you. The first is to click on the<strong className='text-primary'> Add Inquiry</strong> link located on the Dashboard page. Alternatively, you can select <strong className='text-primary'> Inquiries &gt; Create Inquiry</strong> from the menu section. Regardless of which option you choose, both will direct you to the same inquiry creation screen.</p>
              <img
                src={createInquiryImg1}
                className='border border-1 border-primary mb-5'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="create-an-inquiry" className='text-primary'>Create Inquiry</h4>
              <hr />
              <p>Once you have successfully navigated to the Inquiry module, you will be directed to the<strong className='text-primary'> Create Inquiry</strong> page where you can begin creating an inquiry.</p>
              <img
                src={createInquiryImg2}
                className='border border-1 border-primary mb-5'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="customer-selection" className='text-primary'>Customer Selection</h4>
              <hr />
              <p>After accessing the Create Inquiry screen, you will need to select the customer for whom you want to create the inquiry. You have two options for customer selection: you can either choose an existing customer or create a new one.</p>
              <p>If you are creating an inquiry for an existing customer, simply search for their name or email in the search field. Once you have located the correct customer, their information will automatically populate the relevant fields.</p>
              <p>Alternatively, if you are creating an inquiry for a new customer, click on the &quot;Add Customer&quot; button. This will open a new window where you can enter the customer's details, including their name, email, and phone number. After entering the required information, click on the &quot;Create Customer&quot; button to save the customer's details. The new customer will be added to your company's customer list, and their information will automatically populate the relevant fields in the inquiry form.</p>
              <img
                src={createInquiryImg3}
                className='border border-1 border-primary mb-5'
                alt=""
                style={{ width: "100%" }}
              />
              <p>In addition to regular customers, the system allows you to create inquiries for corporate customers as well. Corporate inquiries are specifically intended for corporations to create inquiries on behalf of their employees.</p>
              <p>Creating inquiries for corporate customers follows the same process as regular customers. You can add corporate customers in the same manner as described earlier. When creating a new customer, simply select Corporate type. Enter the necessary details such as the corporate name, contact information, and any additional information relevant to the corporate customer.</p>
              <img
                src={createInquiryImg4}
                className='border border-1 border-primary mb-5'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once you have added the corporate customer, you can proceed with creating the inquiry for their employee by associating the inquiry with the respective corporate customer's account. This allows for efficient tracking and management of inquiries generated by corporations for their employees.</p>
              <h4 id="create-an-inquiry" className='text-primary'>Inquiry Type Selection</h4>
              <hr />
              <p>After selecting or adding a customer, you can specify the type of inquiry requested by the customer. This is an important step as it helps in organizing and prioritizing inquiries based on their type. The available inquiry types include Packages, Flight, Hotel, Activity, Transfers, Visa, Rail, Forex, Bus, and Rent a Car.</p>
              <p>Once you have selected the type of inquiry, you can proceed to fill in the relevant details in the appropriate fields. For example, if the inquiry is related to flight booking, you will need to provide details such as the destination, travel dates, number of passengers, and any other relevant information related to the flight booking. Similarly, for a hotel inquiry, you will need to provide details such as the check-in and check-out dates, the number of rooms required, and any other special requests related to the hotel booking.</p>
              <p>The details required for each inquiry type may vary, so it is important to ensure that you provide accurate and complete information to avoid any delays or misunderstandings in the inquiry resolution process.</p>
              <p>Based on the selected inquiry type, you can provide basic details such as location, trip type, duration, journey type, start date, end date, departure date, arrival date, Adult count, child count, infant count, and other inquiry-related requirements in the Other requirement field.</p>
              <h4 id="create-an-inquiry" className='text-primary'>Additional Inquiry Fields</h4>
              <hr />
              <p>In addition to specifying the inquiry type, you can also provide additional information related to the inquiry. This includes the inquiry source, which can be selected from options such as call center, walk-in, email, referred by, social media, or self.</p>
              <p>You can also choose the inquiry status from the available options, such as open, in progress, on hold, or resolved. This will help you keep track of the inquiry's progress.</p>
              <p>Furthermore, you can assign a customer budget to the inquiry, which will help you manage the inquiry within the specified budget. You can also provide priority to the inquiry, based on the urgency of the inquiry fulfillment.</p>
              <p>To ensure timely follow-up, you can add a follow-up date and time for the inquiry. This will notify the user on the dashboard for Today's Followups, reminding them to follow up with the customer at the specified time.</p>
              <h4 id="create-an-inquiry" className='text-primary'>Employee Assignment</h4>
              <hr />
              <p>When assigning an employee to an inquiry, you can select from a list of available employees in your company. Once an employee is assigned to an inquiry, they will receive a notification and be able to view and manage the inquiry from their dashboard. Other employees will not have access to the inquiry unless it is assigned to them.</p>
              <p>If needed, the employee assigned to the inquiry can reassign it to another employee. However, the original employee will still be able to view the inquiry's progress.</p>
              <p>When an inquiry is assigned or reassigned to an employee, both the previous and new assignee will receive an email notification with all the details of the inquiry. This ensures that everyone involved is up-to-date on the inquiry's status and any actions that need to be taken.</p>
              <h4 id="create-an-inquiry" className='text-primary'>Send Email to Customer</h4>
              <hr />
              <p>The &quot;Send Email&quot; checkbox allows you to send an email to the customer related to the inquiry with all the details. This can include information about the type of inquiry requested, the customer's request details, the assigned employee, the inquiry status, and any other relevant information.</p>
              <p>Sending regular updates to customers can improve their satisfaction with the service and build trust with the company. It can also help to reduce the number of follow-up inquiries from customers about the status of their requests.</p>
              <img
                src={createInquiryImg5}
                className='border border-1 border-primary mb-5'
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

export default CreateInquiries;