import React from 'react'
import SVGIcon from "../../../helpers/svg-icon";
import createInvoiceImg1 from '../../../assets/images/help-images/createInvoice.png';
import createInvoiceImg2 from '../../../assets/images/help-images/115_Invoice_AddCustomer.png';
import createInvoiceImg3 from '../../../assets/images/help-images/116_Blank_Invoice.png';
import createInvoiceImg4 from '../../../assets/images/help-images/117_Invoice_flight.png';
import createInvoiceImg5 from '../../../assets/images/help-images/119_Invoice_Transfer.png';
import createInvoiceImg6 from '../../../assets/images/help-images/118_Invoice_Hotel.png';
import createInvoiceImg7 from '../../../assets/images/help-images/120_Invoice_Activity.png';
import createInvoiceImg8 from '../../../assets/images/help-images/121_Invoice_Custom.png';
import createInvoiceImg9 from '../../../assets/images/help-images/122_Invoice_Pricing.png';
import createInvoiceImg10 from '../../../assets/images/help-images/123_Invoice_AddToBooking.png';
import createInvoiceImg11 from '../../../assets/images/help-images/124_Invoice_AddedToBooking.png';
import createInvoiceImg12 from '../../../assets/images/help-images/125_Invoice_AddToLedger.png';
import createInvoiceImg13 from '../../../assets/images/help-images/127_Invoice_AddedToLedger.png';
import createInvoiceImg14 from '../../../assets/images/help-images/126_Invoice_AddedToLedger.png';
import createInvoiceImg15 from '../../../assets/images/help-images/128_Invoice_AddedToAllLedger.png';
import { Link } from 'react-router-dom';

function Invoices() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="manual-invoices-help">Manual Invoices</h4>
              </blockquote>
              <p>TourWiz now offers an advanced Invoicing module that enables travel agents to create, manage, and streamline the invoicing process. This powerful feature allows you to generate professional invoices, print them if needed, and easily share them with your customers. Additionally, you can efficiently track and collect payments, ensuring a smooth financial transaction experience.</p>
              <p>TourWiz understands the need for flexibility in the invoicing process, and as such, provides a feature called Manual Invoices. This feature allows travel agents to create invoices directly without going through the typical flow of inquiry, proposal, and generating an invoice. Manual Invoices are useful when agents want to create an invoice without making bookings or when they need to bypass the standard process. Enjoy the convenience and efficiency of creating manual invoices to meet your specific business needs.</p>
              <h4 id="Creating-Manual-Invoice" className='text-primary'>Creating Manual Invoice</h4>
              <hr />
              <p>Creating an Manual Invoice in TourWiz is a straightforward and intuitive process. Here is a step-by-step guide to creating a manual invoice using TourWiz:</p>
              <p>Sign in to your TourWiz account and click on the <strong className='text-primary'>Invoices</strong> tab in the top navigation bar. Click on the <strong className='text-primary'>Create Invoice</strong> button from the menu.</p>
              <img
                src={createInvoiceImg1}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="invoice-customer-selection" className='text-primary'>Invoice Customer Selection</h4>
              <hr />
              <p>After accessing the Create Invoice screen, you will need to select the customer for whom you want to create the invoice. You have two options for customer selection: you can either choose an existing customer or create a new one.</p>
              <p>If you are creating an invoice for an existing customer, simply search for their name or email in the search field. Once you have located the correct customer, their information will automatically populate the relevant fields.</p>
              <p>Alternatively, if you are creating an invoice for a new customer, click on the &quot;Add Customer&quot; button. This will open a new window where you can enter the customer's details, including their name, email, and phone number. After entering the required information, click on the &quot;Create Customer&quot; button to save the customer's details. The new customer will be added to your company's customer list, and their information will automatically populate the relevant fields in the invoice form.</p>
              <img
                src={createInvoiceImg2}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Give your invoice narration and select the invoice dates as per customer's request. This will help you keep track of your invoices and make it easier to find them later. Now click on the Create Invoice button.</p>
              <img
                src={createInvoiceImg3}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-manual-invoice-items" className='text-primary'>Adding Manual Invoice Items</h4>
              <hr />
              <p>TourWiz's manual invoicing feature allows users to add a variety of services to their invoice, including flights, transfers, hotels, activities, and more. In addition, users can add custom services such as rail, visa, forex, bus, and rent a car to their invoice.</p>
              <p>TourWiz provides users with the convenience of searching for item details directly from the built-in content database of Flights, Hotels, Activities, and Transfers. Users can easily access this database and search for relevant information such as flight details, hotel amenities, activity descriptions, and transfer schedules. Once they have found the desired item, they can add it directly to the invoice and update the pricing or any other necessary details.</p>
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"air" + "new"} width="28" type="fill"></SVGIcon> Flight</div></h4>
              <hr />
              <p>When creating an invoice in TourWiz, users can easily add and customize these services to create a personalized travel experience for their customers. For example, when adding a <strong className="text-primary">flight</strong> to the invoice, users can enter the flight details, including the departure & arrival airports, airline, flight number, departure and arrival date & times, class, stop details and any additional information.</p>
              <img
                src={createInvoiceImg4}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"transfers" + "new"} width="28" type="fill"></SVGIcon> Transfers</div></h4>
              <hr />
              <p>Similarly, user can add any necessary <strong className="text-primary">transfer</strong> details, activity details or any other service details like rail, visa, forex, bus, and rent a car to their invoice with appropriate information requested by customer. When adding a transfer to the invoice, users can enter the transfer details, including the Pick-up Location, Drop-off Location, Pick-up Time, Vehicle Type (eg. Bus, Sedan), No of Guests, transfer image and any additional information.</p>
              <img
                src={createInvoiceImg5}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"hotel" + "new"} width="28" type="fill"></SVGIcon> Hotel</div></h4>
              <hr />
              <p>Similarly, when adding a <strong>hotel</strong>, users can search for and select a hotel from TourWiz's integrated supplier database, and add details such as the check-in and check-out dates, room type, hotel image and any special requests.</p>
              <img
                src={createInvoiceImg6}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"activity" + "new"} width="28" type="fill"></SVGIcon> Activity</div></h4>
              <hr />
              <p>Similarly, when adding a <strong className='text-primary'>activity</strong>, users can search for and select a activity from TourWiz's integrated supplier database, and add details such as the activity name, location, duration, number of guest, activity type, date, activity image and any special requests.</p>
              <img
                src={createInvoiceImg7}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-itinerary-items" className='text-secondary'><div><SVGIcon name={"custom" + "new"} width="28" type="fill"></SVGIcon> Custom Item (Rail, Visa, Forex, Rent a Car etc)</div></h4>
              <hr />
              <p>Finally, you can add any customized service like visa, rail, forex, bus, rent a car etc in the invoice by choosing custom service option, with location, name, dates, custom image and any special requests.</p>
              <img
                src={createInvoiceImg8}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once you are satisfied with your invoice, you can share it with your customer by sending them an email or print. You can also collaborate with your customer in real-time, making any necessary changes and adjustments along the way.</p>
              <p>Overall, TourWiz's invoice builder feature makes it easy for travel advisers to create customized manual invoices for their clients, saving time and ensuring a personalized travel experience that meets their clients' needs and preferences.</p>
              <h4 id="adding-invoice-item-pricing" className='text-primary'>Adding Invoice Item Pricing</h4>
              <hr />
              <p>TourWiz simplifies the pricing process for all services by applying standard rules that are automatically applied based on the business rules of real-time booking. To prevent confusion with different approaches for different services, TourWiz allows users to set up pricing for any service in the same way.</p>
              <p>When creating an invoice in TourWiz, the user has the option to show the total price with or without any price breakup. In cases where the user wishes to show only the total price, they need to enter the sell price and the system will automatically calculate the total amount based on the tax configuration set up.</p>
              <p>In cases where the user wants to remove the default tax calculation amount, they can simply remove any price breakup amounts from the pricing section and update the service pricing. This ensures that the final total amount is accurately calculated based on the user's pricing configuration.</p>
              <p>By providing a simplified and standardized pricing approach for all services, TourWiz ensures that users can easily manage their invoice pricing and provide transparent pricing to their clients.</p>
              <h4 id="pricing-structure" className='text-primary'>Pricing Structure</h4>
              <hr />
              <p>Invoice pricing in TourWiz involves several components and calculations to determine the total amount to be charged to the client. Here's an explanation of the various pricing elements:</p>
              <p><strong className='text-primary'>1. Supplier Currency:</strong> The currency in which the supplier's prices are listed. It could be the local currency of the destination or a commonly used international currency.</p>
              <p><strong className='text-primary'>2. Conversion Rate:</strong> If the supplier's prices are listed in a different currency than the user's default currency, a conversion rate is applied to convert the prices into the user's currency for consistent display and calculation.</p>
              <p><strong className='text-primary'>3. Supplier Cost Price:</strong> The base cost price of the services provided by the supplier. It represents the price at which the travel adviser procures the services from the supplier.</p>
              <p><strong className='text-primary'>4. Supplier Tax:</strong> Any taxes or fees levied by the supplier, such as service tax or local taxes, which are added to the supplier cost price.</p>
              <p><strong className='text-primary'>5. Agent Cost Price:</strong> The total cost price incurred by the travel adviser, including the supplier cost price and supplier tax. It reflects the actual cost of the services to the travel adviser.</p>
              <p><strong className='text-primary'>6. Agent Markup:</strong> An additional amount added by the travel adviser to cover their profit margin or service fee. It is typically expressed as a percentage or fixed amount and is added on top of the agent cost price.</p>
              <p><strong className='text-primary'>7. Discount:</strong> A reduction in the sell price, either offered by the travel adviser as a promotional offer or negotiated with the client for a specific reason.</p>
              <p><strong className='text-primary'>8. Processing Fee:</strong> An additional fee charged by the travel adviser to cover administrative or processing costs associated with booking.</p>
              <p><strong className='text-primary'>9. Tax Category:</strong> Tax categories in India are divided into Central Goods and Services Tax (CGST), State Goods and Services Tax (SGST), and Integrated Goods and Services Tax (IGST), depending on the interstate or intrastate nature of the transaction.</p>
              <p><strong className='text-primary'>10. CGST Price:</strong> The amount of CGST tax applicable to the invoice, based on the tax rates set by the government.</p>
              <p><strong className='text-primary'>11. SGST Price:</strong> The amount of SGST tax applicable to the invoice, based on the tax rates set by the state government.</p>
              <p><strong className='text-primary'>12. IGST Price:</strong> The amount of IGST tax applicable to the invoice, for interstate transactions.</p>
              <p><strong className='text-primary'>13. Customized Tax Price:</strong> Additional taxes or fees that are specific to the invoice and not covered by CGST, SGST, or IGST.</p>
              <p><strong className='text-primary'>14. Sell Price:</strong> Sell Price, calculated as the sum of agent cost price, agent markup, processing fee, GST price (CGST + SGST + IGST), minus any applicable discounts, and minus customized tax price.</p>
              <p><strong className='text-primary'>15. Total Amount:</strong> The final price to be charged to the client, calculated as the sum of agent cost price, agent markup, processing fee, GST price, customized tax price, and minus any discounts.</p>
              <p>These pricing elements and calculations in TourWiz ensure transparency and accuracy in determining the cost of the invoice for the client, taking into account various costs, taxes, markups, and discounts associated with the services provided.</p>
              <img
                src={createInvoiceImg9}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="price-guidelines" className='text-primary'>Price Guidelines</h4>
              <hr />
              <p>In TourWiz, when the user enters only the sell price without any price breakup, the system applies automatic calculations based on the customized tax setup. The GST (Goods and Services Tax) percentage will be applied according to the following rules:</p>
              <ol>
                <li><p>If the user has entered a processing fee, the GST percentage will be applied to the processing fee amount.</p>
                </li>
                <li><p>If the user has not entered a processing fee, the GST percentage will be applied to the sell price amount.</p>
                </li>
              </ol>
              <p>Additionally, any custom tax setup defined in the Tax Configuration page will be calculated on all amounts except the GST amount. This allows for flexibility in applying specific taxes or fees based on the user's configuration.</p>
              <p>By automatically applying the appropriate GST percentage and considering the custom tax setup, TourWiz ensures accurate calculations of taxes and fees for the sell price, processing fee, and other relevant amounts in the invoice. This helps users maintain compliance with tax regulations and provides transparency in pricing for their clients.</p>
              <h4 id="adding-the-invoice-to-booking" className='text-primary'>Adding the Invoice to Booking</h4>
              <hr />
              <p>To add a manual invoice to a booking, follow these steps:</p>
              <ol>
                <li>Log in to your TourWiz account and navigate to the dashboard.</li>
                <li>Click on the &quot;Invoice&quot; menu and click on the &quot;Manage Invoice/Voucher&quot; sub menu.</li>
                <li>Locate the manual invoice that you want to add to a booking and click on it to open the invoice details.</li>
                <li>Within the invoice details, look for an option or button labeled &quot;Add to Booking&quot;. Click on it to proceed.</li>
                <li>System will complete the process and will show the confirmation message that invoice has been added to booking successfully.</li>
                <li>The manual invoice will now be associated with the booking in TourWiz.
                  It will be linked to the customer's booking record and reflect the relevant details, such as the invoice amount, payment status, and any outstanding balances. By adding the manual invoice to a booking, you can easily keep track of the invoicing and payment information associated with specific bookings in your tour management system. This helps streamline your administrative processes and ensures accurate record-keeping for financial purposes.</li>
              </ol>
              <img
                src={createInvoiceImg10}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <img
                src={createInvoiceImg11}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-the-invoice-to-booking" className='text-primary'>Adding the Invoice to Booking</h4>
              <hr />
              <p>To add the invoice to the customer's reconciliation page, follow these steps:</p>
              <ol>
                <li>Locate the manual invoice that you want to add to a booking and click on it to open the invoice details.</li>
                <li>From invoice details page, click on the &quot;Add to Customer Ledger&quot; button.</li>
                <li>This will add the invoice to the customer's reconciliation page, where you can track the payment made for that booking by the customer.</li>
              </ol>
              <img
                src={createInvoiceImg12}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <img
                src={createInvoiceImg13}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="adding-the-invoice-to-all-ledgers" className='text-primary'>Adding the Invoice to All Ledgers</h4>
              <hr />
              <p>By adding invoice to all ledgers, you can now do the reconciliation of the booking items at supplier side.</p>
              <p>To add the invoice to the supplier reconciliation page, follow these steps:</p>
              <ol>
                <li>Locate the manual invoice that you want to add to a booking and click on it to open the invoice details.</li>
                <li>From invoice details page, click on the <strong>Add to Supplier Reconciliation</strong> button.</li>
                <li>This will add the invoice to the supplier reconciliation page, allowing you to track the payment made by the supplier for that booking.</li>
              </ol>
              <img
                src={createInvoiceImg14}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <img
                src={createInvoiceImg15}
                className='border border-1 border-primary mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <h4 id="manual-invoice-rules" className='text-primary'>Adding the Invoice to All Ledgers</h4>
              <hr /><p>The rules regarding manual invoices in TourWiz are as follows:</p>
              <ol>
                <li><p>Once the &quot;Add to Booking&quot; action is applied to a manual invoice, the details of the invoice cannot be modified. This ensures that the invoice remains intact and serves as a record of the booking.</p>
                </li>
                <li><p>When the &quot;Add to Booking&quot; action is applied, each item in the invoice will be reflected in the &quot;My Bookings&quot; page. This allows users to easily track and manage the bookings associated with the invoice.</p>
                </li>
                <li><p>If the &quot;Add to Ledger&quot; action is applied to the manual invoice, the invoice and its items will be available for reconciliation in the &quot;Customer Reconciliation&quot; page. This enables users to reconcile the invoice with customer payments and track outstanding amounts.</p>
                </li>
                <li><p>Similarly, if the &quot;Add to All Ledger&quot; action is applied to the manual invoice, the invoice and its items will be available for reconciliation in the &quot;Supplier Reconciliation&quot; page. This allows users to reconcile the invoice with supplier payments and manage outstanding amounts.</p>
                </li>
              </ol>
              <p>These rules help ensure accurate record-keeping, booking management, and reconciliation processes within the TourWiz application.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoices;