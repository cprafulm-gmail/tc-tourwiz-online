import React from 'react'
import createItineraryImg from '../../../assets/images/help-images/028_Create_Itinerary.png';
import customerSelectionImg from '../../../assets/images/help-images/029_Create_ItineraryCustomer.png';
import blankItineraryImg from '../../../assets/images/help-images/030_Blank_Itinerary.png';
import flightManuallyImg from '../../../assets/images/help-images/032_Itinerary_FlightAddManually.png';
import transferManuallyImg from '../../../assets/images/help-images/033_Itinerary_TransferAddManually.png';
import hotelManuallyImg from '../../../assets/images/help-images/034_Itinerary_HotelAddManually.png';
import activityManuallyImg from '../../../assets/images/help-images/035_Itinerary_ActivityAddManually.png';
import customManuallyImg from '../../../assets/images/help-images/036_Itinerary_Custom.png';
import pricingStructureImg from '../../../assets/images/help-images/037_Itinerary_Pricing.png';
import itineraryTermsImg from '../../../assets/images/help-images/056_Itinerary_Terms.png';
import itineraryPreviewImg from '../../../assets/images/help-images/038_Itinerary_Preview.png';
import ItinerarySendEmailImg from '../../../assets/images/help-images/039_Itinerary_SendEmail.png';
import ItineraryCustomerSendEmailImg from '../../../assets/images/help-images/040_Itinerary_SendEmailCustomer.png';
import ItinerarySupplierSendEmailImg from '../../../assets/images/help-images/041_Itinerary_SendEmailSupplier.png';
import ItineraryShareOnWhatsAppImg from '../../../assets/images/help-images/057_Itinerary_ShareOnWhatsapp.png';
import ItineraryGenrateInvoiceImg from '../../../assets/images/help-images/042_Itinerary_GenerateInvoice.png';
import ItineraryThankYouImg from '../../../assets/images/help-images/043_Itinerary_ThankYou.png';
import ItineraryViewResImg from '../../../assets/images/help-images/044_Itinerary_ViewRes.png';
import ItineraryInvoiceImg from '../../../assets/images/help-images/046_Invoice.png';
import ItineraryVoucherImg from '../../../assets/images/help-images/045_Voucher.png';
import SVGIcon from "../../../helpers/svg-icon";
import { Link } from 'react-router-dom';

function CreateItineraries() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Create an Itinerary</h4>
              </blockquote>
              <p>Creating an itinerary in TourWiz is a straightforward and intuitive process. Here is a step-by-step guide to creating an itinerary using TourWiz:</p>
              <p>Sign in to your TourWiz account and click on the <strong className='text-primary'>Itineraries</strong> tab in the top navigation bar. Click on the <strong className='text-primary'>Create Itinerary</strong> button from the menu.</p>
              <img
                src={createItineraryImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="ItineraryOptions" className='text-primary'>Itinerary Options</h4>
              <hr />
              <p>TourWiz's itinerary builder feature provides various options for displaying prices, images, and package pricing to travel advisers. Here's a closer look at these features:</p>
              <ol>
                <li><strong className='text-primary'>Show Total Prices:</strong> Users can choose to display only the total price of the itinerary, for all services and fees, to provide clients with a clear understanding of the cost of their trip.</li>
                <li><strong className='text-primary'>Show Itemized Prices:</strong> Users can also choose to display itemized prices for each service included in the itinerary, allowing clients to see the breakdown of costs for each aspect of their trip.</li>
                <li><strong className='text-primary'>Show Flight Prices:</strong> When including flights in the itinerary, users can choose to display flight prices separately from other services, allowing clients to see the cost of flights compared to other aspects of the trip.</li>
                <li><strong className='text-primary'>Show Images:</strong> TourWiz's integrated supplier database includes a wide range of images for hotels, activities, and other services. Users can choose to display images for each service in the itinerary, giving clients a visual representation of the different aspects of their trip.</li>
                <li><strong className='text-primary'>Enable Package Pricing:</strong> TourWiz's itinerary builder also allows travel advisers to create package pricing options, where multiple services are combined into a single price. This can be a useful option for clients who want a more streamlined booking experience and prefer to have all services included in a single payment.</li>
              </ol>
              <p>By providing these options for displaying prices and images, as well as enabling package pricing, TourWiz's itinerary builder allows travel advisers to create customized and visually appealing itineraries that meet their clients' unique needs and preferences.</p>
              <h4 id="itinerary-customer-selection" className='text-primary'>Itinerary Customer Selection</h4>
              <hr />
              <p>After accessing the Create Itinerary screen, you will need to select the customer for whom you want to create the itinerary. You have two options for customer selection: you can either choose an existing customer or create a new one.</p>
              <p>If you are creating an itinerary for an existing customer, simply search for their name or email in the search field. Once you have located the correct customer, their information will automatically populate the relevant fields.</p>
              <p>Alternatively, if you are creating an itinerary for a new customer, click on the<strong className='text-primary'> Add Customer</strong> button. This will open a new window where you can enter the customer's details, including their name, email, and phone number. After entering the required information, click on the<strong className='text-primary'> Create Customer</strong> button to save the customer's details. The new customer will be added to your company's customer list, and their information will automatically populate the relevant fields in the itinerary form.</p>
              <img
                src={customerSelectionImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Give your itinerary a title and select the itinerary dates as per customer's request. Upload header image for the Itinerary. This will help you keep track of your itineraries and make it easier to find them later. Now click on the Create Itinerary button. At this point you have created an itinerary for the selected customer with no services added yet.</p>
              <img
                src={blankItineraryImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-primary'>Adding Itinerary Items</h4>
              <hr />
              <p>TourWiz's itinerary builder feature allows users to add a variety of services to their itinerary, including flights, transfers, hotels, activities, and more. In addition, users can add custom services such as rail, visa, forex, bus, and rent a car to their itinerary.</p>
              <p>TourWiz provides users with the convenience of searching for item details directly from the built-in content database of Flights, Hotels, Activities, and Transfers. Users can easily access this database and search for relevant information such as flight details, hotel amenities, activity descriptions, and transfer schedules. Once they have found the desired item, they can add it directly to the itinerary and update the pricing or any other necessary details.</p>
              <p>In addition to the built-in content database, TourWiz also allows users to manually add item details to the itinerary based on their specific requirements. This feature is particularly useful when dealing with custom services or when the required item details are not available in the database.</p>
              <p>With the ability to search for item details online and manually add item details, TourWiz provides users with the flexibility and customization options needed to create tailored itineraries for their clients.</p>
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"air" + "new"} width="28" type="fill"></SVGIcon> Flight</div></h4>
              <hr className='m-0 p-0' />
              <p>When creating an itinerary in TourWiz, users can easily add and customize these services to create a personalized travel experience for their customers. For example, when adding a <strong className='text-primary'>flight</strong> to the itinerary, users can enter the flight details, including the departure &amp; arrival airports, airline, flight number, departure and arrival date &amp; times, class, stop details and any additional information.</p>
              <img
                src={flightManuallyImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"transfers" + "new"} width="28" type="fill"></SVGIcon> Transfers</div></h4>
              <hr className='m-0 p-0' />
              <p>Similarly, user can add any necessary <strong className='text-primary'>transfer</strong> details, activity details or any other service details like rail, visa, forex, bus, and rent a car to their itinerary with appropriate information requested by customer. When adding a transfer to the itinerary, users can enter the transfer details, including the Pick-up Location, Drop-off Location, Pick-up Time, Vehicle Type (eg. Bus, Sedan), No of Guests, transfer image and any additional information.</p>
              <img
                src={transferManuallyImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"hotel" + "new"} width="28" type="fill"></SVGIcon> Hotel</div></h4>
              <hr className='m-0 p-0' />
              <p>Similarly, when adding a <strong className='text-primary'>hotel</strong>, users can search for and select a hotel from TourWiz's integrated supplier database, and add details such as the check-in and check-out dates, room type, hotel image and any special requests.</p>
              <img
                src={hotelManuallyImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"activity" + "new"} width="28" type="fill"></SVGIcon> Activity</div></h4>
              <hr className='m-0 p-0' />
              <p>Similarly, when adding a <strong className='text-primary'>activity</strong>, users can search for and select a activity from TourWiz's integrated supplier database, and add details such as the activity name, location, duration, number of guest, activity type, date, activity image and any special requests.</p>
              <img
                src={activityManuallyImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name="customnew" width="28" type="fill"></SVGIcon> Custom Item (Rail, Visa, Forex, Rent a Car etc)</div></h4>
              <hr className='m-0 p-0' />
              <p>Finally, you can add any customized service like visa, rail, forex, bus, rent a car etc in the itinerary by choosing custom service option, with location, name, dates, custom image and any special requests.</p>
              <img
                src={customManuallyImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once you are satisfied with your itinerary, you can share it with your customer by sending them an email, web link, PDF, or print. You can also collaborate with your customer in real-time, making any necessary changes and adjustments along the way.</p>
              <p>Overall, TourWiz's itinerary builder feature makes it easy for travel advisers to create customized itineraries for their clients, saving time and ensuring a personalized travel experience that meets their clients' needs and preferences.</p>
              <h4 id="adding-itinerary-items-pricing" className='text-primary'>Adding Itinerary Items Pricing</h4>
              <hr />
              <p>TourWiz simplifies the pricing process for all services by applying standard rules that are automatically applied based on the business rules of real-time booking. To prevent confusion with different approaches for different services, TourWiz allows users to set up pricing for any service in the same way.</p>
              <p>When creating an itinerary in TourWiz, the user has the option to show the total price with or without any price breakup. In cases where the user wishes to show only the total price, they need to enter the sell price and the system will automatically calculate the total amount based on the tax configuration set up.</p>
              <p>In cases where the user wants to remove the default tax calculation amount, they can simply remove any price breakup amounts from the pricing section and update the service pricing. This ensures that the final total amount is accurately calculated based on the user's pricing configuration.</p>
              <p>By providing a simplified and standardized pricing approach for all services, TourWiz ensures that users can easily manage their itinerary pricing and provide transparent pricing to their clients.</p>
              <h4 id="adding-itinerary-items-pricing-structure" className='text-secondary'>Pricing Structure</h4>
              <hr className='m-0 p-0' />
              <p>Itinerary pricing in TourWiz involves several components and calculations to determine the total amount to be charged to the client. Here's an explanation of the various pricing elements:</p>
              <p><strong className='text-primary'>1. Supplier Currency:</strong> The currency in which the supplier's prices are listed. It could be the local currency of the destination or a commonly used international currency.</p>
              <p><strong className='text-primary'>2. Conversion Rate:</strong> If the supplier's prices are listed in a different currency than the user's default currency, a conversion rate is applied to convert the prices into the user's currency for consistent display and calculation.</p>
              <p><strong className='text-primary'>3. Supplier Cost Price:</strong> The base cost price of the services provided by the supplier. It represents the price at which the travel adviser procures the services from the supplier.</p>
              <p><strong className='text-primary'>4. Supplier Tax:</strong> Any taxes or fees levied by the supplier, such as service tax or local taxes, which are added to the supplier cost price.</p>
              <p><strong className='text-primary'>5. Agent Cost Price:</strong> The total cost price incurred by the travel adviser, including the supplier cost price and supplier tax. It reflects the actual cost of the services to the travel adviser.</p>
              <p><strong className='text-primary'>6. Agent Markup:</strong> An additional amount added by the travel adviser to cover their profit margin or service fee. It is typically expressed as a percentage or fixed amount and is added on top of the agent cost price.</p>
              <p><strong className='text-primary'>7. Discount:</strong> A reduction in the sell price, either offered by the travel adviser as a promotional offer or negotiated with the client for a specific reason.</p>
              <p><strong className='text-primary'>8. Processing Fee:</strong> An additional fee charged by the travel adviser to cover administrative or processing costs associated with booking and managing the itinerary.</p>
              <p><strong className='text-primary'>9. Tax Category:</strong> Tax categories in India are divided into Central Goods and Services Tax (CGST), State Goods and Services Tax (SGST), and Integrated Goods and Services Tax (IGST), depending on the interstate or intrastate nature of the transaction.</p>
              <p><strong className='text-primary'>10. CGST Price:</strong> The amount of CGST tax applicable to the itinerary, based on the tax rates set by the government.</p>
              <p><strong className='text-primary'>11. SGST Price:</strong> The amount of SGST tax applicable to the itinerary, based on the tax rates set by the state government.</p>
              <p><strong className='text-primary'>12. IGST Price:</strong> The amount of IGST tax applicable to the itinerary, for interstate transactions.</p>
              <p><strong className='text-primary'>13. Customized Tax Price:</strong> Additional taxes or fees that are specific to the itinerary and not covered by CGST, SGST, or IGST.</p>
              <p><strong className='text-primary'>14. Sell Price:</strong> Sell Price, calculated as the sum of agent cost price, agent markup, processing fee, GST price (CGST + SGST + IGST), minus any applicable discounts, and minus customized tax price.</p>
              <p><strong className='text-primary'>15. Total Amount:</strong> The final price to be charged to the client, calculated as the sum of agent cost price, agent markup, processing fee, GST price, customized tax price, and minus any discounts.</p>
              <p>These pricing elements and calculations in TourWiz ensure transparency and accuracy in determining the cost of the itinerary for the client, taking into account various costs, taxes, markups, and discounts associated with the services provided.</p>
              <img
                src={pricingStructureImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items-pricing-guidline" className='text-secondary'>Pricing Guidelines</h4>
              <hr className='m-0 p-0' />
              <p>In TourWiz, when the user enters only the sell price without any price breakup, the system applies automatic calculations based on the customized tax setup. The GST (Goods and Services Tax) percentage will be applied according to the following rules:</p>
              <ol>
                <li><p>If the user has entered a processing fee, the GST percentage will be applied to the processing fee amount.</p>
                </li>
                <li><p>If the user has not entered a processing fee, the GST percentage will be applied to the sell price amount.</p>
                </li>
              </ol>
              <p>Additionally, any custom tax setup defined in the Tax Configuration page will be calculated on all amounts except the GST amount. This allows for flexibility in applying specific taxes or fees based on the user's configuration.</p>
              <p>By automatically applying the appropriate GST percentage and considering the custom tax setup, TourWiz ensures accurate calculations of taxes and fees for the sell price, processing fee, and other relevant amounts in the itinerary. This helps users maintain compliance with tax regulations and provides transparency in pricing for their clients.</p>
              <h4 id="itinerary-terms--conditions" className='text-primary'>Itinerary Terms & Conditions</h4>
              <hr />
              <p>Itinerary Terms &amp; Conditions are the rules and regulations that agent can apply to the tour itinerary being offered to the customer. These terms and conditions are an agreement between the travel company and the customer and outline the rights, responsibilities, and obligations of both parties.</p>
              <p>The Terms &amp; Conditions section is included in the itinerary document and can be customized by the travel company according to their policies. This section typically covers the following points:</p>
              <ol>
                <li><p>Payment and Cancellation Policy: This section includes information on the payment schedule, cancellation fees, and refund policy. It also outlines any penalties that may be applied in case of cancellations.</p>
                </li>
                <li><p>Travel Insurance: This section provides information on the importance of travel insurance and whether it is included in the itinerary or not.</p>
                </li>
                <li><p>Travel Documentation: This section outlines the documents that are required to travel, such as passports, visas, and any other required permits.</p>
                </li>
                <li><p>Health and Safety: This section includes information on the health and safety measures that need to be taken while traveling, such as vaccinations, medical conditions, and emergency contact information.</p>
                </li>
                <li><p>Tour Itinerary: This section provides details about the itinerary, including the destinations, modes of transportation, accommodation, and activities.</p>
                </li>
                <li><p>Liability and Responsibility: This section outlines the travel company's liability and responsibility in case of any accidents, injuries, or loss of property during the trip.</p>
                </li>
                <li><p>Changes and Amendments: This section provides information on the travel company's policy regarding changes and amendments to the itinerary, such as changes in dates, destinations, or services.</p>
                </li>
              </ol>
              <p>Including a well-defined and clear set of Terms &amp; Conditions in the itinerary document can help avoid any misunderstandings or disputes between the travel company and the customer.</p>
              <img
                src={itineraryTermsImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="preview-itinerary" className='text-primary'>Preview Itinerary</h4>
              <hr />
              <p>TourWiz allows users to preview the itinerary before sending it to their clients. This preview feature provides a complete view of the itinerary, including all the added services and their pricing details, so that users can ensure accuracy and completeness before sending it to the clients.</p>
              <p>The preview option in TourWiz also allows users to make any necessary changes or updates to the itinerary, such as adding or removing services, updating pricing details, or modifying the itinerary options, before finalizing it.</p>
              <img
                src={itineraryPreviewImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>By previewing the itinerary, users can also get a feel for the overall flow of the itinerary, ensuring that it meets the desired travel objectives and provides a satisfactory experience for their clients.</p>
              <p>Overall, the preview feature in TourWiz helps users ensure the quality and accuracy of the itinerary before presenting it to their clients, thus improving the overall satisfaction and trust of their clients in the travel planning process.</p>
              <h4 id="send-itinerary" className='text-primary'>Send Itinerary</h4>
              <hr />
              <p>TourWiz allows users to send the itinerary to their clients via email. Once the itinerary has been created and previewed, users can easily send it to their clients by entering the client's email address and sending it directly from the TourWiz platform.</p>
              <img
                src={ItinerarySendEmailImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>When sending the itinerary, users can customize the email message to include any relevant details or personalized messages for the client.</p>
              <img
                src={ItineraryCustomerSendEmailImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Overall, TourWiz's email feature provides a convenient and efficient way for users to send itineraries to their clients and ensure that the travel planning process is seamless and enjoyable for everyone involved.</p>
              <h4 id="send-itinerary-to-supplier" className='text-primary'>Send Itinerary to Supplier</h4>
              <hr />
              <p>TourWiz allows users to send the itinerary to suppliers via email as well. Once the itinerary has been created and previewed, users can easily send it to the relevant suppliers by entering their email address and sending it directly from the TourWiz platform.</p>
              <p>When sending the itinerary to suppliers, users can customize the email message to include any relevant details or instructions for the supplier.</p>
              <img
                src={ItinerarySupplierSendEmailImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="share-on-whatsapp" className='text-primary'>Share on Whatsapp</h4>
              <hr />
              <p>TourWiz provides the ability for users to share itinerary web links on WhatsApp, making it easy to communicate with clients and share itinerary information.</p>
              <p>To share an itinerary web link on WhatsApp, users can follow these steps:</p>
              <ol>
                <li>Navigate to the itinerary for which you want to share the web link.</li>
                <li>Click on the<strong className='text-primary'> Share on Whatsapp</strong> button.</li>
                <li>The WhatsApp application will open automatically with the itinerary web link pre-populated in the message field and with customer's mobile number which was associated with the itinerary.</li>
                <li>Add any additional message or context to the message if needed.</li>
                <li>Click on the<strong className='text-primary'> Send</strong> button to share the itinerary web link with the recipient.</li>
                <img
                  src={ItineraryShareOnWhatsAppImg}
                  className='border border-1 border-primary mb-4'
                  alt=""
                  style={{ width: "100%" }}
                />
              </ol>
              <p>Once the recipient receives the message, they can simply click on the itinerary web link to view the itinerary details in their web browser.</p>
              <p>Sharing itinerary web links on WhatsApp can be a convenient way to communicate with clients, as it allows them to easily access itinerary information on their mobile devices.</p>
              <h4 id="generate-invoice" className='text-primary'>Generate Invoice</h4>
              <hr />
              <p>Once you have finalized the customer's request and they have agreed to book the itinerary, you can proceed with generating an invoice from the TourWiz application. As TourWiz is currently a B2B offline booking management platform, the agent would have already made the actual booking either from available booking platforms or directly with the supplier. Generating an invoice on TourWiz completes the booking flow.</p>
              <p>When the user clicks on the <strong className='text-primary'>Generate Invoice</strong> button, the system will navigate to the cart page. Here, all the itinerary items will be displayed for review, and the user will be prompted to enter the customer details. The customer details may include first name, last name, birth date, passport details, and any other necessary information. Once the user has reviewed the details and entered the customer information, they can click on the <strong className='text-primary'> Continue</strong> button.</p>
              <img
                src={ItineraryGenrateInvoiceImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>At this point, all the itinerary items will be booked with the provided details on the TourWiz application. The system will automatically generate the invoice and vouchers associated with the bookings. On the thank you page, the system will display the booking details, including the booking reference number, pricing information, itinerary reference number, and any other relevant information.</p>
              <img
                src={ItineraryThankYouImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>On the thank you page, users will also have the option to view the reservation details and print the invoice and vouchers by clicking on the <strong className='text-primary'>Details & Print View</strong> button. This will take the user to the view reservation page, where all the booking details will be displayed.</p>
              <img
                src={ItineraryViewResImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>By providing a seamless process for generating invoices and booking details, TourWiz streamlines the post-booking workflow and ensures that users have all the necessary information readily available for their clients.</p>
              <h4 id="invoice" className='text-primary'>Invoice</h4>
              <hr />
              <p>TourWiz provides a convenient way for travel agents to generate booking invoices automatically once a booking is done. The booking invoice includes important details such as customer information, itinerary details, price breakdown, booking reference number, and GST information.</p>
              <p>The booking invoice will be automatically populated with the relevant customer and itinerary details. The price breakdown will show the cost of each service, along with any applicable taxes and fees. The booking reference number and GST information will also be included in the invoice.</p>
              <p>Additionally, TourWiz allows the user to send the invoice to the customer via email directly from the booking invoice page. The agent can add any necessary comments or information before sending the invoice to the customer.</p>
              <img
                src={ItineraryInvoiceImg}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="voucher" className='text-primary'>Voucher</h4>
              <hr />
              <p>Once a booking is made through TourWiz, the system generates a voucher for each service or item in the itinerary. The voucher contains details such as the name and contact information of the supplier, the booking reference number, the service or item booked, the date and time of the booking, and any additional notes or instructions.</p>
              <p>Users can access the vouchers from the booking details page, where they can view, print, or email the vouchers to the customer. The vouchers can be customized with the user's logo and branding, and can also include additional information such as the customer's name, address, and other details.</p>
              <p>The vouchers can be printed or emailed to the customer as a PDF attachment or as a web link that the customer can view online. The vouchers can also be printed or emailed to the supplier as a confirmation of the booking.</p>
              <p>Overall, the voucher feature in TourWiz helps to streamline the booking process and provide a professional and organized system for managing bookings and communicating with customers and suppliers.</p>
              <img
                src={ItineraryVoucherImg}
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

export default CreateItineraries;