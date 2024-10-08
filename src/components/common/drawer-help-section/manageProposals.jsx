import React from 'react'
import proposalListImg1 from '../../../assets/images/help-images/079_ProposalList.png';
import proposalListImg2 from '../../../assets/images/help-images/080_Copy_Proposal.png';
import proposalListImg3 from '../../../assets/images/help-images/081_Delete_Proposals.png';
import proposalListImg4 from '../../../assets/images/help-images/082_Export_Proposals.png';
import proposalListImg5 from '../../../assets/images/help-images/083_Import_Proposal.png';
import { Link } from 'react-router-dom';

function ManageProposals() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Manage Proposals</h4>
              </blockquote>
              <p>TourWiz provides users with an proposal list that displays all created proposals in one place. The proposal list can be filtered by various parameters such as proposal title, customer name, email, phone, status and date range.</p>
              <p>The proposal list provides users with a quick overview of all their created proposals, including the proposal title, start date, end date of proposal, duration of proposal, customer name, email, phone and created date.</p>
              <img
                src={proposalListImg1}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Users can click on any proposal in the list to view the details of that proposal, including the services included, pricing details, and customer information.</p>
              <h4 id="copy-proposal" className='text-primary'>Copy Proposal</h4>
              <hr />
              <p>To copy an proposal for another customer in TourWiz, you can follow these steps:</p>
              <ol>
                <li>Go to the Proposal list page.</li>
                <li>Find the proposal you want to copy and click on the &quot;Copy&quot; button.</li>
                <li>A pop-up window will appear where you can select the customer you want to copy the proposal for.</li>
                <li>Select the customer from the list and click on the &quot;Copy Proposal&quot; button.</li>
                <li>The proposal will be copied to the selected customer's account.</li>
              </ol>
              <img
                src={proposalListImg2}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>You can also add new customer while copying the proposal by selecting Add Customer option and providing required customer details during the process of copying proposal. You can then make any necessary changes to the proposal for the new customer.</p>
              <h4 id="delete-proposal" className='text-primary'>Delete Proposal</h4>
              <hr />
              <p>To delete an proposal in TourWiz:</p>
              <ol>
                <li>Go to the &quot;Manage Proposals&quot; page in TourWiz.</li>
                <li>Find the proposal you want to delete and click on the &quot;Delete&quot; icon located for that proposal.</li>
                <li>Proceed for the deletion by clicking on the &quot;Confirm&quot; button in the confirmation dialog box.</li>
              </ol>
              <img
                src={proposalListImg3}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Note: Deleting an proposal will permanently remove it from the TourWiz system and cannot be undone. Any associated bookings or invoices will also be deleted. Therefore, it is recommended to double-check before deleting any proposal.</p>
              <h4 id="export-proposal" className='text-primary'>Export Proposal</h4>
              <hr />
              <p>The Export Proposal feature allows users to export a list of proposals from the TourWiz system in bulk. This feature is useful for companies that need to process large amounts of data or generate reports for analysis purposes.</p>
              <p>To export proposals, users must first navigate to the Proposals section and apply any filters they want to use to narrow down the list of proposals to be exported. Once the desired proposals are displayed, users can select the Export option from the menu and choose the file format in which to export the data.</p>
              <ol>
                <li>Go to the <strong> Manage Proposals</strong> page in TourWiz.</li>
                <li>Apply any filters to display the desired set of proposals in the list.</li>
                <li>Look for an <strong> Export Proposals</strong> button located at the top of the proposal list.</li>
                <li>Click on the <strong> Export Proposals</strong> button.</li>
                <li>Once the export is completed, the file will be saved to the downloads folder on your computer or device.</li>
              </ol>
              <img
                src={proposalListImg4}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>The exported file will contain the relevant information from the proposal list, such as proposal title, customer details, proposal item details, pricing, and all other fields. You can use the exported file for record-keeping, analysis, or sharing the proposal information with others.</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageProposals;