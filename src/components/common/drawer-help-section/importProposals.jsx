import React from 'react'
import importProposals from '../../../assets/images/help-images/084_Imported_Proposal.png';
import { Link } from 'react-router-dom';

function ImportProposals() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Import Proposals</h4>
              </blockquote>
              <p>The Import Proposal functionality allows users to import a list of proposals into the TourWiz system in bulk. This feature can be useful for companies that have a large number of proposals to create or update, as it can save time and reduce errors.</p>
              <p>To import proposals, users must first prepare a CSV file with the required information for each proposal. For your reference we have already provided sample CSV file template which can be downloaded and modified for importing proposals. The CSV file should contain all the columns and its appropriate values described in the sample template file.</p>
              <p>Once the CSV file is prepared, users can navigate to Proposals &gt; Import Proposals and select the file to upload. The system will automatically map the columns in the CSV file to the appropriate fields in the system.</p>
              <img
                src={importProposals}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>After the import process is completed, users can view the imported proposals in the Proposals section. The system will automatically assign a unique Proposal Reference Number to each imported proposal. Users can also filter and search for imported proposals using various filter options available in the system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImportProposals;