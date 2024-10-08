import React from 'react'
import pricingImg from '../../../assets/images/help-images/pricing.png';
import manageSubscription from '../../../assets/images/help-images/subscription.png';
import subscription1 from '../../../assets/images/help-images//021_Subscription_2.png';
import subscription2 from '../../../assets/images/help-images/022_Subscription_3.png';
import subscription3 from '../../../assets/images/help-images/023_Subscription_4.png';
import { Link } from 'react-router-dom';

function BillingAndSubscription() {
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
            <div class="px-2 shadow-4 rounded-3 tw-addon-services" >
              <blockquote>
                <h4 id="billing--subscription">Billing & Subscription</h4>
              </blockquote>
              <p>At TourWiz, we understand that the travel industry has been hit hard by the pandemic, and we want to do our part in helping travel professionals bounce back. That's why we offer an affordable and flexible pricing plan to fit the needs and budget of every individual and agency.</p>
              <p>Our pricing plans are designed to empower travel professionals with the right digital tools to create exceptional travel experiences for their clients. We offer a range of plans to choose from, including monthly and annual subscriptions, with no hidden fees or charges.</p>
              <p>Our pricing plans include access to all the powerful features of TourWiz's itinerary builder, including the built-in content database, customized templates, auto-calculation of total price, collaboration tools, import/export functionality, and booking management tools.</p>
              <img
                src={pricingImg}
                className='border border-1 border-primary shadow mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>We also offer a freemium trial plans to give you a chance to explore the platform and see how it can benefit your business. And if you ever need help, our dedicated support team is always available to assist you with any questions or issues you may have. When a user signs up for TourWiz, they automatically receive access to our freemium trial plan. The freemium trial plan allows users to explore the system and get a feel for how it can benefit their business. Overall, TourWiz's freemium trial plan is a great way for users to get started with our platform and see how it can benefit their business without any initial commitment or cost.</p>
              <p>After the trial period ends, users can choose to upgrade to one of our affordable and flexible pricing plans to continue using TourWiz and access all its powerful features. Our pricing plans are designed to fit the needs and budget of every individual and agency, making TourWiz an affordable and accessible option for travel professionals looking to streamline their itinerary creation process.</p>
              <blockquote>
                <h4 id="manage-your-subscription">Manage your Subscription</h4>
              </blockquote>
              <p>In the Account Settings &gt; Billing Subscription section, you can find all the information about your current subscription, purchase history, and plans comparison table.</p>
              <p>Here you can upgrade or downgrade your plan, assign access to business tools, save invoices in PDF format or print them.</p>
              <p>For TourWiz subscription :</p>
              <p>Select a Billing &amp; Subscription option available on the Dashboard quick link section or by navigating to Account Settings &gt; Billing &amp; Subscription page after log in to your TourWiz account using the account owner credentials (admin user account).</p>
              <p><strong className='text-primary'>Choose a plan:</strong> We offer a variety of plans to suit your needs. Take a look at the options available and choose the one that best fits your requirements.</p>
              <p><strong className='text-primary'>Select Quarterly or Yearly option:</strong> Decide whether you want to pay for your plan on a quarterly or yearly basis. Quarterly payments will provide you with more flexibility, while yearly payments can save you money in the long run.</p>
              <p><strong className='text-primary'>Add Payment:</strong> Once you have chosen your plan and payment option, click on the &quot;Add Payment&quot; button to proceed to the checkout page.</p>
              <img
                src={manageSubscription}
                className='border border-1 border-primary shadow mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>After you have selected your desired plan and payment option, the system will display a payment details popup for you to review your purchase before proceeding to checkout. This popup will provide you with an overview of your selected plan and payment option, along with the total price that you will be charged.</p>
              <p>System will show you available promo codes to apply. You can enter the promo code and click on the &quot;Apply&quot; button in the payment details popup. Once you have apply the promo code, the pricing will be adjusted according to the discount applied, and the new total price will be displayed.</p>
              <img
                src={subscription1}
                className='border border-1 border-primary shadow mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>Once you have reviewed your purchase and applied any applicable promo codes, click on the &quot;Pay Now&quot; button to proceed with the checkout process. You will be redirected to a secure payment page where you can enter your payment information and complete the transaction.</p>
              <img
                src={subscription2}
                className='border border-1 border-primary shadow mb-4'
                alt=""
                style={{ width: "100%" }}
              />
              <p>After your payment has been processed, system will show you the payment success message along with subscription details. Also you will receive a confirmation email with details of your purchase and a receipt for your records. If you encounter any issues during the checkout process, please do not hesitate to contact our customer support team for assistance.</p>
              <img
                src={subscription3}
                className='border border-1 border-primary shadow mb-4'
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

export default BillingAndSubscription;