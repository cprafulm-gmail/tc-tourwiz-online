import React from 'react'
import itineraryListImg from '../../../assets/images/help-images/047_ItineraryList.png';
import itineraryListCopyItineraryImg from '../../../assets/images/help-images/048_Copy_Itinerary.png';
import itineraryListDeleteItineraryImg from '../../../assets/images/help-images/052_Delete_Itineraries.png';
import itineraryListExportItineraryImg from '../../../assets/images/help-images/050_Export_Itineraries.png';
import { Link } from 'react-router-dom';

function ManageItineraries() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2  rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Itinerary List & Filter options</h4>
              </blockquote>
              <p>TourWiz provides users with an itinerary list that displays all created itineraries in one place. The itinerary list can be filtered by various parameters such as itinerary title, customer name, email, phone, status and date range.</p>
              <p>The itinerary list provides users with a quick overview of all their created itineraries, including the itinerary title, start date, end date of itinerary, duration of itinerary, customer name, email, phone and created date.</p>
              <img
                src={itineraryListImg}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Users can click on any itinerary in the list to view the details of that itinerary, including the services included, pricing details, and customer information.</p>
              <p>To copy an itinerary for another customer in TourWiz, you can follow these steps:</p>
              <ol>
                <li>Go to the Itinerary list page.</li>
                <li>Find the itinerary you want to copy and click on the <strong className="text-primary">Copy</strong> button.</li>
                <li>A pop-up window will appear where you can select the customer you want to copy the itinerary for.</li>
                <li>Select the customer from the list and click on the <strong className="text-primary">Copy Itinerary</strong> button.</li>
                <li>The itinerary will be copied to the selected customer's account.</li>
              </ol>
              <img
                src={itineraryListCopyItineraryImg}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>You can also add new customer while copying the itinerary by selecting Add Customer option and providing required customer details during the process of copying itinerary. You can then make any necessary changes to the itinerary for the new customer.</p>
              <h4 className='text-primary' id="delete-itinerary">Delete Itinerary</h4>
              <hr />
              <p>To delete an itinerary in TourWiz:</p>
              <ol>
                <li>Go to the <strong className="text-primary">Manage Itineraries</strong> page in TourWiz.</li>
                <li>Find the itinerary you want to delete and click on the <strong className="text-primary">Delete</strong> icon located for that itinerary.</li>
                <li>Proceed for the deletion by clicking on the <strong className="text-primary">Confirm</strong> button in the confirmation dialog box.</li>
              </ol>
              <img
                src={itineraryListDeleteItineraryImg}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Note: Deleting an itinerary will permanently remove it from the TourWiz system and cannot be undone. Any associated bookings or invoices will also be deleted. Therefore, it is recommended to double-check before deleting any itinerary.</p>
              <h4 className='text-primary' id="export-itinerary">Export Itinerary</h4>
              <hr />
              <p>The Export Itinerary feature allows users to export a list of itineraries from the TourWiz system in bulk. This feature is useful for companies that need to process large amounts of data or generate reports for analysis purposes.</p>
              <p>To export itineraries, users must first navigate to the Itineraries section and apply any filters they want to use to narrow down the list of itineraries to be exported. Once the desired itineraries are displayed, users can select the Export option from the menu and choose the file format in which to export the data.</p>
              <ol>
                <li>Go to the <strong className="text-primary">Manage Itineraries</strong> page in TourWiz.</li>
                <li>Apply any filters to display the desired set of itineraries in the list.</li>
                <li>Look for an <strong className="text-primary">Export Itineraries</strong> button located at the top of the itinerary list.</li>
                <li>Click on the <strong className="text-primary">Export Itineraries</strong> button.</li>
                <li>Once the export is completed, the file will be saved to the downloads folder on your computer or device.</li>
              </ol>
              <img
                src={itineraryListExportItineraryImg}
                className='border border-1 border-primary  mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>The exported file will contain the relevant information from the itinerary list, such as itinerary title, customer details, itinerary item details, pricing, and all other fields. You can use the exported file for record-keeping, analysis, or sharing the itinerary information with others.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageItineraries;