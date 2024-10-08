import React from 'react'
import ContentLibraryImg from '../../../assets/images/help-images/054_Content_Library.png';
import ContentLibraryImg1 from '../../../assets/images/help-images/055_Content_Library_Upload.png';
import { Link } from 'react-router-dom';

function ContentLibrary() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Content Library</h4>
              </blockquote>
              <p>The Content Library in TourWiz is a centralized repository where users can store and manage various types of media files, including images, videos, and documents. The images uploaded to the Content Library can be used while creating itineraries, proposals, and other marketing materials.</p>
              <p>By having a central location to store media files, users can easily access and reuse the images across different parts of the platform. For instance, if you have a set of high-quality images that you want to use across multiple itineraries, you can upload them to the Content Library and then simply select them from the library while creating new itineraries.</p>
              <p>Overall, the Content Library helps users save time and effort by providing a centralized location to store and manage media files, making it easier to use them in different parts of the platform.</p>
              <img
                src={ContentLibraryImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Here are the steps to upload images to the content library in TourWiz:</p>
              <ol>
                <li>Login to your TourWiz account and navigate to the Manage Itineraries &gt; Content Library page.</li>
                <li>Click on the &quot;Upload&quot; button located at the top of the page.</li>
                <li>Select the image file(s) you want to upload from your local computer or device.</li>
                <li>Click on the &quot;Upload&quot; button to add the image to your content library.</li>
              </ol>
              <img
                src={ContentLibraryImg1}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once the image is uploaded, it can be accessed and used across your TourWiz account, including in itineraries, proposals, and other marketing materials. You can also delete the images in the content library at any time.</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentLibrary;