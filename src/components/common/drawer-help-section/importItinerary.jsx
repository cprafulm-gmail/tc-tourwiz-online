import React from 'react'
import ImportItinerariesImg from '../../../assets/images/help-images/049_Import_Itinerary.png';
import { Link } from 'react-router-dom';

function ImportItineraries() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Import Itineraries</h4>
              </blockquote>
              <p>The Import Itinerary functionality allows users to import a list of itineraries into the TourWiz system in bulk. This feature can be useful for companies that have a large number of itineraries to create or update, as it can save time and reduce errors.</p>
              <p>To import itineraries, users must first prepare a CSV file with the required information for each itinerary. For your reference we have already provided sample CSV file template which can be downloaded and modified for importing itineraries. The CSV file should contain all the columns and its appropriate values described in the sample template file.</p>
              <p>Once the CSV file is prepared, users can navigate to Itineraries &gt; Import Itineraries and select the file to upload. The system will automatically map the columns in the CSV file to the appropriate fields in the system.</p>
              <img
                src={ImportItinerariesImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>After the import process is completed, users can view the imported itineraries in the Itineraries section. The system will automatically assign a unique Itinerary Reference Number to each imported itinerary. Users can also filter and search for imported itineraries using various filter options available in the system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportItineraries;