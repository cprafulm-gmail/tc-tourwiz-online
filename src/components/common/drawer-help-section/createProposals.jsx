import React from 'react'
import SVGIcon from "../../../helpers/svg-icon";
import proposalsImg1 from '../../../assets/images/help-images/059_Create_Proposal.png';
import proposalsImg2 from '../../../assets/images/help-images/060_Create_ProposalCustomer.png';
import proposalsImg3 from '../../../assets/images/help-images/061_Blank_Proposal.png';
import proposalsImg4 from '../../../assets/images/help-images/062_Proposal_FlightAddManually.png';
import proposalsImg5 from '../../../assets/images/help-images/063_Proposal_TransferAddManually.png';
import proposalsImg6 from '../../../assets/images/help-images/064_Proposal_HotelAddManually.png';
import proposalsImg7 from '../../../assets/images/help-images/065_Proposal_ActivityAddManually.png';
import proposalsImg8 from '../../../assets/images/help-images/066_Proposal_Custom.png';
import proposalsImg9 from '../../../assets/images/help-images/067_Proposal_Pricing.png';
import proposalsImg10 from '../../../assets/images/help-images/068_Proposal_Terms.png';
import proposalsImg11 from '../../../assets/images/help-images/070_Proposal_Preview.png';
import proposalsImg12 from '../../../assets/images/help-images/071_Proposal_SendEmail.png';
import proposalsImg13 from '../../../assets/images/help-images/073_Proposal_SendEmailCustomer.png';
import proposalsImg14 from '../../../assets/images/help-images/072_Proposal_SendEmailSupplier.png';
import proposalsImg15 from '../../../assets/images/help-images/073_Proposal_ShareOnWhatsapp.png';
import proposalsImg16 from '../../../assets/images/help-images/074_Proposal_GenerateInvoice.png';
import proposalsImg17 from '../../../assets/images/help-images/075_Proposal_ThankYou.png';
import proposalsImg18 from '../../../assets/images/help-images/076_Proposal_ViewRes.png';
import proposalsImg19 from '../../../assets/images/help-images/078_Invoice.png';
import proposalsImg20 from '../../../assets/images/help-images/077_Voucher.png';
import { Link } from 'react-router-dom';

function CreateProposals() {
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
            <div class="px-2 rounded-3 tw-addon-services" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Proposal Module</h4>
              </blockquote>
              <p>TourWiz is a powerful platform designed to simplify the proposal creation process for tour operators, travel agents, and other travel professionals. With TourWiz, you can easily build multi-day proposals with rich content in just a few clicks and share them with your clients via various channels such as PDF, link, email, WhatsApp, and more.</p>
              <p>What's more, TourWiz is incredibly user-friendly. You don't need any technical or design skills to use it. The interface is intuitive and easy to navigate, so you can create beautiful proposals in minutes.</p>
              <p>Overall, TourWiz is the perfect solution for travel professionals looking to streamline their proposal creation process and provide their clients with an exceptional travel experience.</p>
              <h4 id="proposal-builder-powerful-features" className='text-primary'>Proposal builder powerful features</h4>
              <hr />
              <ul className="list-unstyled">
                <li>Built-in content database of Flights, Hotels, Activities and Transfers</li>
                <li>Set up your own rates at service level or package level</li>
                <li>Add your own services</li>
                <li>Auto-calculation of total price based on items added</li>
                <li>Add terms & conditions, inclusions and exclusions</li>
                <li>Share proposals with rich content as a web link or PDF</li>
                <li>Show itemized pricing and/or package pricing</li>
                <li>Add attachments to proposals (e.g. vouchers/booking confirmation files)</li>
                <li>Copy and reuse proposals for other customers</li>
                <li>Import existing proposals from Excel with one click</li>
                <li>Send proposals & quotes to suppliers for availability check with single click</li>
                <li>Set Book before dates to confirm booking before payment to supplier becomes due</li>
              </ul>
              <h4 id="create-an-proposal" className='text-primary'>Create an Proposal</h4>
              <hr />
              <p>Creating an proposal in TourWiz is a straightforward and intuitive process. Here is a step-by-step guide to creating an proposal using TourWiz:</p>
              <p>Sign in to your TourWiz account and click on the <strong className='text-primary'>Proposals</strong> tab in the top navigation bar. Click on the <strong className='text-primary'>Create Proposal</strong> button from the menu.</p>
              <img
                src={proposalsImg1}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="proposal-options" className='text-primary'>Proposal Options:</h4>
              <hr />
              <p>TourWiz's proposal builder feature provides various options for displaying prices, images, and package pricing to travel advisers. Here's a closer look at these features:</p>
              <ul className="list-unstyled">
                <li>
                  <strong className='text-primary'>Show Total Prices:</strong> Users can choose to display only the total price of the proposal, for all services and fees, to provide clients with a clear understanding of the cost of their trip.
                </li>
                <li>
                  <strong className='text-primary'>Show Itemized Prices:</strong> Users can also choose to display itemized prices for each service included in the proposal, allowing clients to see the breakdown of costs for each aspect of their trip.
                </li>
                <li>
                  <strong className='text-primary'>Show Flight Prices:</strong> When including flights in the proposal, users can choose to display flight prices separately from other services, allowing clients to see the cost of flights compared to other aspects of the trip.
                </li>
                <li>
                  <strong className='text-primary'>Show Images:</strong> TourWiz's integrated supplier database includes a wide range of images for hotels, activities, and other services. Users can choose to display images for each service in the proposal, giving clients a visual representation of the different aspects of their trip.
                </li>
                <li>
                  <strong className='text-primary'>Enable Package Pricing:</strong> TourWiz's proposal builder also allows travel advisers to create package pricing options, where multiple services are combined into a single price. This can be a useful option for clients who want a more streamlined booking experience and prefer to have all services included in a single payment.
                </li>
              </ul>
              <p>By providing these options for displaying prices and images, as well as enabling package pricing, TourWiz's proposal builder allows travel advisers to create customized and visually appealing proposals that meet their clients' unique needs and preferences.</p>
              <h4 id="proposal-customer-selection" className='text-primary'>Proposal Customer Selection</h4>
              <hr />
              <p>After accessing the Create Proposal screen, you will need to select the customer for whom you want to create the proposal. You have two options for customer selection: you can either choose an existing customer or create a new one.</p>
              <p>If you are creating an proposal for an existing customer, simply search for their name or email in the search field. Once you have located the correct customer, their information will automatically populate the relevant fields.</p>
              <p>Alternatively, if you are creating an proposal for a new customer, click on the<strong className='text-primary'> Add Customer</strong> button. This will open a new window where you can enter the customer's details, including their name, email, and phone number. After entering the required information, click on the &quot;Create Customer&quot; button to save the customer's details. The new customer will be added to your company's customer list, and their information will automatically populate the relevant fields in the proposal form.</p>
              <img
                src={proposalsImg2}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Give your proposal a title and select the proposal dates as per customer's request. Upload header image for the Proposal. This will help you keep track of your proposals and make it easier to find them later. Now click on the Create Proposal button. At this point you have created an proposal for the selected customer with no services added yet.</p>
              <img
                src={proposalsImg3}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-proposal-items" className='text-primary'>Adding Proposal Items</h4>
              <hr />
              <p>TourWiz's proposal builder feature allows users to add a variety of services to their proposal, including flights, transfers, hotels, activities, and more. In addition, users can add custom services such as rail, visa, forex, bus, and rent a car to their proposal.</p>
              <p>TourWiz provides users with the convenience of searching for item details directly from the built-in content database of Flights, Hotels, Activities, and Transfers. Users can easily access this database and search for relevant information such as flight details, hotel amenities, activity descriptions, and transfer schedules. Once they have found the desired item, they can add it directly to the proposal and update the pricing or any other necessary details.</p>
              <p>In addition to the built-in content database, TourWiz also allows users to manually add item details to the proposal based on their specific requirements. This feature is particularly useful when dealing with custom services or when the required item details are not available in the database.</p>
              <p>With the ability to search for item details online and manually add item details, TourWiz provides users with the flexibility and customization options needed to create tailored proposals for their clients.</p>
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"air" + "new"} width="28" type="fill"></SVGIcon> Flight</div></h4>
              <hr />
              <p>When creating an proposal in TourWiz, users can easily add and customize these services to create a personalized travel experience for their customers. For example, when adding a <strong className="text-primary">flight</strong> to the proposal, users can enter the flight details, including the departure &amp; arrival airports, airline, flight number, departure and arrival date & times, class, stop details and any additional information.</p>
              <img
                src={proposalsImg4}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"transfers" + "new"} width="28" type="fill"></SVGIcon> Transfers</div></h4>
              <hr />
              <p>Similarly, user can add any necessary <strong className="text-primary">transfer</strong> details, activity details or any other service details like rail, visa, forex, bus, and rent a car to their proposal with appropriate information requested by customer. When adding a transfer to the proposal, users can enter the transfer details, including the Pick-up Location, Drop-off Location, Pick-up Time, Vehicle Type (eg. Bus, Sedan), No of Guests, transfer image and any additional information.</p>
              <img
                src={proposalsImg5}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"hotel" + "new"} width="28" type="fill"></SVGIcon> Hotel</div></h4>
              <hr />
              <p>Similarly, when adding a <strong className="text-primary">hotel</strong>, users can search for and select a hotel from TourWiz's integrated supplier database, and add details such as the check-in and check-out dates, room type, hotel image and any special requests.</p>
              <img
                src={proposalsImg6}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"activity" + "new"} width="28" type="fill"></SVGIcon> Activity</div></h4>
              <hr />
              <p>Similarly, when adding a <strong className="text-primary">activity</strong>, users can search for and select a activity from TourWiz's integrated supplier database, and add details such as the activity name, location, duration, number of guest, activity type, date, activity image and any special requests.</p>
              <img
                src={proposalsImg7}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"custom" + "new"} width="28" type="fill"></SVGIcon> Custom Item (Rail, Visa, Forex, Rent a Car etc)</div></h4>
              <hr />
              <p>Finally, you can add any customized service like visa, rail, forex, bus, rent a car etc in the proposal by choosing custom service option, with location, name, dates, custom image and any special requests.</p>
              <img
                src={proposalsImg8}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once you are satisfied with your proposal, you can share it with your customer by sending them an email, web link, PDF, or print. You can also collaborate with your customer in real-time, making any necessary changes and adjustments along the way.</p>
              <p>Overall, TourWiz's proposal builder feature makes it easy for travel advisers to create customized proposals for their clients, saving time and ensuring a personalized travel experience that meets their clients' needs and preferences.</p>
              <h4 id="adding-proposal-item-pricing" className='text-primary'>Adding Proposal Item Pricing</h4>
              <hr />
              <p>TourWiz simplifies the pricing process for all services by applying standard rules that are automatically applied based on the business rules of real-time booking. To prevent confusion with different approaches for different services, TourWiz allows users to set up pricing for any service in the same way.</p>
              <p>When creating an proposal in TourWiz, the user has the option to show the total price with or without any price breakup. In cases where the user wishes to show only the total price, they need to enter the sell price and the system will automatically calculate the total amount based on the tax configuration set up.</p>
              <p>In cases where the user wants to remove the default tax calculation amount, they can simply remove any price breakup amounts from the pricing section and update the service pricing. This ensures that the final total amount is accurately calculated based on the user's pricing configuration.</p>
              <p>By providing a simplified and standardized pricing approach for all services, TourWiz ensures that users can easily manage their proposal pricing and provide transparent pricing to their clients.</p>
              <h4 id="pricing-structure-1" className='text-primary'>Pricing Structure</h4>
              <hr />
              <p>Proposal pricing in TourWiz involves several components and calculations to determine the total amount to be charged to the client. Here's an explanation of the various pricing elements:</p>
              <p><strong className="text-primary">1. Supplier Currency:</strong> The currency in which the supplier's prices are listed. It could be the local currency of the destination or a commonly used international currency.</p>
              <p><strong className="text-primary">2. Conversion Rate:</strong> If the supplier's prices are listed in a different currency than the user's default currency, a conversion rate is applied to convert the prices into the user's currency for consistent display and calculation.</p>
              <p><strong className="text-primary">3. Supplier Cost Price:</strong> The base cost price of the services provided by the supplier. It represents the price at which the travel adviser procures the services from the supplier.</p>
              <p><strong className="text-primary">4. Supplier Tax:</strong> Any taxes or fees levied by the supplier, such as service tax or local taxes, which are added to the supplier cost price.</p>
              <p><strong className="text-primary">5. Agent Cost Price:</strong> The total cost price incurred by the travel adviser, including the supplier cost price and supplier tax. It reflects the actual cost of the services to the travel adviser.</p>
              <p><strong className="text-primary">6. Agent Markup:</strong> An additional amount added by the travel adviser to cover their profit margin or service fee. It is typically expressed as a percentage or fixed amount and is added on top of the agent cost price.</p>
              <p><strong className="text-primary">7. Discount:</strong> A reduction in the sell price, either offered by the travel adviser as a promotional offer or negotiated with the client for a specific reason.</p>
              <p><strong className="text-primary">8. Processing Fee:</strong> An additional fee charged by the travel adviser to cover administrative or processing costs associated with booking and managing the proposal.</p>
              <p><strong className="text-primary">9. Tax Category:</strong> Tax categories in India are divided into Central Goods and Services Tax (CGST), State Goods and Services Tax (SGST), and Integrated Goods and Services Tax (IGST), depending on the interstate or intrastate nature of the transaction.</p>
              <p><strong className="text-primary">10. CGST Price:</strong> The amount of CGST tax applicable to the proposal, based on the tax rates set by the government.</p>
              <p><strong className="text-primary">11. SGST Price:</strong> The amount of SGST tax applicable to the proposal, based on the tax rates set by the state government.</p>
              <p><strong className="text-primary">12. IGST Price:</strong> The amount of IGST tax applicable to the proposal, for interstate transactions.</p>
              <p><strong className="text-primary">13. Customized Tax Price:</strong> Additional taxes or fees that are specific to the proposal and not covered by CGST, SGST, or IGST.</p>
              <p><strong className="text-primary">14. Sell Price:</strong> Sell Price, calculated as the sum of agent cost price, agent markup, processing fee, GST price (CGST + SGST + IGST), minus any applicable discounts, and minus customized tax price.</p>
              <p><strong className="text-primary">15. Total Amount:</strong> The final price to be charged to the client, calculated as the sum of agent cost price, agent markup, processing fee, GST price, customized tax price, and minus any discounts.</p>
              <p>These pricing elements and calculations in TourWiz ensure transparency and accuracy in determining the cost of the proposal for the client, taking into account various costs, taxes, markups, and discounts associated with the services provided.</p>
              <img
                src={proposalsImg9}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="price-guidelines-1" className='text-primary'>Price Guidelines</h4>
              <hr />
              <p>In TourWiz, when the user enters only the sell price without any price breakup, the system applies automatic calculations based on the customized tax setup. The GST (Goods and Services Tax) percentage will be applied according to the following rules:</p>
              <ol>
                <li><p>If the user has entered a processing fee, the GST percentage will be applied to the processing fee amount.</p>
                </li>
                <li><p>If the user has not entered a processing fee, the GST percentage will be applied to the sell price amount.</p>
                </li>
              </ol>
              <p>Additionally, any custom tax setup defined in the Tax Configuration page will be calculated on all amounts except the GST amount. This allows for flexibility in applying specific taxes or fees based on the user's configuration.</p>
              <p>By automatically applying the appropriate GST percentage and considering the custom tax setup, TourWiz ensures accurate calculations of taxes and fees for the sell price, processing fee, and other relevant amounts in the proposal. This helps users maintain compliance with tax regulations and provides transparency in pricing for their clients.</p>
              <h4 id="proposal-terms-conditions" className='text-primary'>Proposal Terms & Conditions</h4>
              <hr />
              <p>Proposal Terms &amp; Conditions are the rules and regulations that agent can apply to the tour proposal being offered to the customer. These terms and conditions are an agreement between the travel company and the customer and outline the rights, responsibilities, and obligations of both parties.</p>
              <p>The Terms &amp; Conditions section is included in the proposal document and can be customized by the travel company according to their policies. This section typically covers the following points:</p>
              <ol>
                <li>Payment and Cancellation Policy: This section includes information on the payment schedule, cancellation fees, and refund policy. It also outlines any penalties that may be applied in case of cancellations.
                </li>
                <li>Travel Insurance: This section provides information on the importance of travel insurance and whether it is included in the proposal or not.
                </li>
                <li>Travel Documentation: This section outlines the documents that are required to travel, such as passports, visas, and any other required permits.
                </li>
                <li>Health and Safety: This section includes information on the health and safety measures that need to be taken while traveling, such as vaccinations, medical conditions, and emergency contact information.
                </li>
                <li>Tour Proposal: This section provides details about the proposal, including the destinations, modes of transportation, accommodation, and activities.
                </li>
                <li>Liability and Responsibility: This section outlines the travel company's liability and responsibility in case of any accidents, injuries, or loss of property during the trip.
                </li>
                <li>Changes and Amendments: This section provides information on the travel company's policy regarding changes and amendments to the proposal, such as changes in dates, destinations, or services.
                </li>
              </ol>
              <p>Including a well-defined and clear set of Terms & Conditions in the proposal document can help avoid any misunderstandings or disputes between the travel company and the customer.</p>
              <img
                src={proposalsImg10}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Any terms and conditions that are added to an proposal will be displayed on various platforms such as booking vouchers, email previews, shared proposal web links, and so on. This ensures that customers are fully aware of the terms and conditions of the proposal they are booking and can make an informed decision.</p>
              <h4 id="preview-proposal" className='text-primary'>Preview Proposal</h4>
              <hr />
              <p>TourWiz allows users to preview the proposal before sending it to their clients. This preview feature provides a complete view of the proposal, including all the added services and their pricing details, so that users can ensure accuracy and completeness before sending it to the clients.</p>
              <p>The preview option in TourWiz also allows users to make any necessary changes or updates to the proposal, such as adding or removing services, updating pricing details, or modifying the proposal options, before finalizing it.</p>
              <img
                src={proposalsImg11}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>By previewing the proposal, users can also get a feel for the overall flow of the proposal, ensuring that it meets the desired travel objectives and provides a satisfactory experience for their clients.</p>
              <p>Overall, the preview feature in TourWiz helps users ensure the quality and accuracy of the proposal before presenting it to their clients, thus improving the overall satisfaction and trust of their clients in the travel planning process.</p>
              <h4 id="send-proposal" className='text-primary'>Send Proposal</h4>
              <hr />
              <p>TourWiz allows users to send the proposal to their clients via email. Once the proposal has been created and previewed, users can easily send it to their clients by entering the client's email address and sending it directly from the TourWiz platform.</p>
              <img
                src={proposalsImg12}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>When sending the proposal, users can customize the email message to include any relevant details or personalized messages for the client.</p>
              <img
                src={proposalsImg13}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Overall, TourWiz's email feature provides a convenient and efficient way for users to send proposals to their clients and ensure that the travel planning process is seamless and enjoyable for everyone involved.</p>
              <h4 id="send-proposal-to-supplier" className='text-primary'>Send Proposal to Supplier</h4>
              <hr />
              <p>TourWiz allows users to send the proposal to suppliers via email as well. Once the proposal has been created and previewed, users can easily send it to the relevant suppliers by entering their email address and sending it directly from the TourWiz platform.</p>
              <p>When sending the proposal to suppliers, users can customize the email message to include any relevant details or instructions for the supplier.</p>
              <img
                src={proposalsImg14}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="share-on-whatsapp-1" className='text-primary'>Share on Whatsapp</h4>
              <hr />
              <p>TourWiz provides the ability for users to share proposal web links on WhatsApp, making it easy to communicate with clients and share proposal information.</p>
              <p>To share an proposal web link on WhatsApp, users can follow these steps:</p>
              <ol>
                <li>Navigate to the proposal for which you want to share the web link.</li>
                <li>Click on the <strong className="text-primary"> Share on Whatsapp</strong> button.</li>
                <li>The WhatsApp application will open automatically with the proposal web link pre-populated in the message field and with customer's mobile number which was associated with the proposal.</li>
                <li>Add any additional message or context to the message if needed.</li>
                <li>Click on the <strong className="text-primary"> Send</strong> button to share the proposal web link with the recipient.</li>
              </ol>
              <img
                src={proposalsImg15}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once the recipient receives the message, they can simply click on the proposal web link to view the proposal details in their web browser.</p>
              <p>Sharing proposal web links on WhatsApp can be a convenient way to communicate with clients, as it allows them to easily access proposal information on their mobile devices.</p>
              <h4 id="generate-invoice-1" className='text-primary'>Generate Invoice</h4>
              <hr />
              <p>Once you have finalized the customer's request and they have agreed to book the proposal, you can proceed with generating an invoice from the TourWiz application. As TourWiz is currently a B2B offline booking management platform, the agent would have already made the actual booking either from available booking platforms or directly with the supplier. Generating an invoice on TourWiz completes the booking flow.</p>
              <p>When the user clicks on the <strong className="text-primary">Generate Invoice</strong> button, the system will navigate to the cart page. Here, all the proposal items will be displayed for review, and the user will be prompted to enter the customer details. The customer details may include first name, last name, birth date, passport details, and any other necessary information. Once the user has reviewed the details and entered the customer information, they can click on the <strong className="text-primary">Continue</strong> button.</p>
              <img
                src={proposalsImg16}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>At this point, all the proposal items will be booked with the provided details on the TourWiz application. The system will automatically generate the invoice and vouchers associated with the bookings. On the thank you page, the system will display the booking details, including the booking reference number, pricing information, proposal reference number, and any other relevant information.</p>
              <img
                src={proposalsImg17}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>On the thank you page, users will also have the option to view the reservation details and print the invoice and vouchers by clicking on the &quot;Details &amp; Print View&quot; button. This will take the user to the view reservation page, where all the booking details will be displayed.</p>
              <img
                src={proposalsImg18}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>By providing a seamless process for generating invoices and booking details, TourWiz streamlines the post-booking workflow and ensures that users have all the necessary information readily available for their clients.</p>
              <h4 id="invoice" className='text-secondary'>Invoice</h4>
              <hr />
              <p>TourWiz provides a convenient way for travel agents to generate booking invoices automatically once a booking is done. The booking invoice includes important details such as customer information, proposal details, price breakdown, booking reference number, and GST information.</p>
              <p>The booking invoice will be automatically populated with the relevant customer and proposal details. The price breakdown will show the cost of each service, along with any applicable taxes and fees. The booking reference number and GST information will also be included in the invoice.</p>
              <p>Additionally, TourWiz allows the user to send the invoice to the customer via email directly from the booking invoice page. The agent can add any necessary comments or information before sending the invoice to the customer.</p>
              <img
                src={proposalsImg19}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="invoice" className='text-secondary'>Voucher</h4>
              <hr />
              <p>Once a booking is made through TourWiz, the system generates a voucher for each service or item in the proposal. The voucher contains details such as the name and contact information of the supplier, the booking reference number, the service or item booked, the date and time of the booking, and any additional notes or instructions.</p>
              <p>Users can access the vouchers from the booking details page, where they can view, print, or email the vouchers to the customer. The vouchers can be customized with the user's logo and branding, and can also include additional information such as the customer's name, address, and other details.</p>
              <p>The vouchers can be printed or emailed to the customer as a PDF attachment or as a web link that the customer can view online. The vouchers can also be printed or emailed to the supplier as a confirmation of the booking.</p>
              <p>Overall, the voucher feature in TourWiz helps to streamline the booking process and provide a professional and organized system for managing bookings and communicating with customers and suppliers.</p>
              <img
                src={proposalsImg20}
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

export default CreateProposals;