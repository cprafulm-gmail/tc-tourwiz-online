import React, { Component } from "react";
import { Link } from "react-scroll";
import PublicPageHeader from "../../components/landing-pages/public-page-header";
import PublicPageFindus from "../../components/landing-pages/public-page-findus";
import PublicPageWherewe from "../../components/landing-pages/public-page-wherewe";
import PublicPageClients from "../../components/landing-pages/public-page-clients";
import PublicPageFooter from "../../components/landing-pages/public-page-footer";
import PublicPageCopyrights from "../../components/landing-pages/public-page-copyrights";
import PricingBgImage from "../../assets/images/tw/header-bgimg-pricing.svg";
import { StickyContainer, Sticky } from "react-sticky";

class Terms extends Component {
  state = {};

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const css = `
  header, footer, .agent-login, .landing-pg {
      display: none;
  }`;

    return (
      <div className="tw-public-pages tw-about-page">
        <style>{css}</style>
        <StickyContainer>

          <Sticky>
            {({ style }) => (<div
              className={
                "hight-z-index mod-search-area"
              }
              style={{ ...style, transform: "inherit" }}
            >
              <PublicPageHeader />
            </div>
            )}
          </Sticky>
          <div className="tw-common-banner">
            <img className="tw-common-banner-img" src={PricingBgImage} alt="" />
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h1>Terms of Use, Privacy Policy</h1>
                </div>
                <div className="col-lg-12">
                  <Link
                    activeClass="active"
                    className="btn btn-sm btn-light m-2"
                    href="#"
                    to="copyright"
                    spy={true}
                    smooth={true}
                    offset={-10}
                    duration={500}
                  >
                    Copyright Take down service
                  </Link>
                  <Link
                    activeClass="active"
                    className="btn btn-sm btn-light m-2"
                    href="#"
                    to="privacyPolicy"
                    spy={true}
                    smooth={true}
                    offset={-10}
                    duration={500}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    activeClass="active"
                    className="btn btn-sm btn-light m-2"
                    href="#"
                    to="terms"
                    spy={true}
                    smooth={true}
                    offset={-10}
                    duration={500}
                  >
                    Terms of Use
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-pages">
            <div className="container-sm">
              <div className="text-justify">
                <h1 className="mb-3" name="terms">
                  Terms of Use
                </h1>
                <p>
                  <small>Last Updated: April 3, 2021</small>
                </p>
                <p>
                  ClTech Solutions Private Limited hereinafter referred to by its
                  brand name “
                  <strong>
                    <em>Tourwiz</em>
                  </strong>
                  ” welcomes you to our website www.tourwizonline.com and and the
                  applications and services available from us, through our website
                  or other platforms (the “
                  <strong>
                    <em>Site</em>
                  </strong>
                  ” and the “
                  <strong>
                    <em>Services</em>
                  </strong>
                  ”). Your use of the Site and the Services are governed by these
                  Terms of Use. Any time you browse the Site or use the Services
                  in any way, you agree to be bound by these Terms of Use. If you
                  don’t agree to these Terms of Use, do not use the Site or the
                  Services.
                </p>
                <p>
                  Your use of the Services is also subject to our Privacy Policy
                  (the “
                  <strong>
                    <em>Privacy Policy</em>
                  </strong>
                  ”), which is located on the Site, as well as the policies and
                  procedures available on the Site or the Services, as amended
                  from time to time, including our refund and cancellation
                  policies (the “
                  <strong>
                    <em>Policies</em>
                  </strong>
                  ”). The Privacy Policy and the Policies are incorporated by
                  reference into these Terms of Use and these Terms of Use, the
                  Privacy Policy, and the Policies together are hereinafter
                  referred to as this “
                  <strong>
                    <em>Agreement</em>
                  </strong>
                  ”. We reserve the right to modify this Agreement at any time,
                  with such changes becoming effective when we post the modified
                  Agreement to the Site.{" "}
                </p>
                <p>
                  We also reserve the right to make any changes to the Site and
                  Services in any manner and to deny or terminate your access to
                  the Site and Services, even if you have an Account, in our sole
                  discretion.
                </p>
                <p>
                  Each time you use the Site or the Services, the then-current
                  version of this Agreement will apply. If you use the Site or the
                  Services after a modification of this Agreement, you agree to be
                  bound by this Agreement as modified.
                </p>
                <p>
                  {" "}
                  <strong>
                    <em>
                      This Agreement contains important information regarding your
                      rights with respect to the Site and the Services, including
                      your relationship with us, and include an arbitration
                      provision that may limit your ability to pursue claims
                      against us in court. Please read them carefully and review
                      them regularly.
                    </em>
                  </strong>
                </p>
                <h3>1. Eligibility</h3>
                <p>
                  If you are under 13 years old, you may not use the Services.
                  When you use the Services, you represent that you are (i) at
                  least the age of majority in the jurisdiction where you reside
                  or (ii) if you have not reached the age of majority in the
                  jurisdiction where you reside, that you have received permission
                  to use the Services from your parent or legal guardian
                </p>
                <p>
                  You represent that any information you submit to us when using
                  the Services is accurate, truthful, and current. You also
                  represent that your use of the Services does not violate any
                  applicable law or regulation.
                </p>
                <h3>2. Registration &amp; Account</h3>
                <p>
                  Certain of the Services or portions of the Site may require you
                  to register for an account (“
                  <strong>
                    <em>Account</em>
                  </strong>
                  ”), becoming a “
                  <strong>
                    <em>Registered User</em>
                  </strong>
                  ”. As part of the Account creation process, you may be asked to
                  provide a username and password unique to the Account (“
                  <strong>
                    <em>Login Information</em>
                  </strong>
                  ”). You are responsible for the confidentiality and use of your
                  Login Information and agree not to transfer or disclose your
                  Login Information to any third party other than an individual
                  with express authority to act on your behalf. If you suspect any
                  unauthorized use of your Account, you agree to notify us
                  immediately. You are solely responsible for any activities
                  occurring under your Account. You have no ownership right to
                  your Account. If you are registering an Account on behalf of an
                  organization under an agreement between us and another
                  organization, that organization may have administrator rights to
                  access your account and any information provided under your
                  Account.
                </p>
                <h3>3. Location-based Services</h3>
                <p>
                  Some of the Services may require that location functionality be
                  enabled on the relevant device in order to work properly. You
                  acknowledge and agree that if location permissions and
                  functionalities are not enabled on the device with which you
                  access the Services, the Services may not work appropriately or
                  at all. We will use any location information we receive from you
                  in accordance with our Privacy Policy.
                </p>
                <h3>4. Third Parties</h3>
                <p>
                  We do not provide, own or control any of the travel services and
                  products that you can access through our Site, such as flights,
                  accommodations, rental cars, packages, or travel insurance (the
                  “
                  <strong>
                    <em>Travel Products</em>
                  </strong>
                  ”). The Travel Products are owned, controlled or made available
                  by third parties (the “
                  <strong>
                    <em>Travel Providers</em>
                  </strong>
                  ”). The Travel Providers are responsible for the Travel
                  Products. The Travel Provider’s terms and privacy policies apply
                  to your booking so you must agree to and understand those terms.
                  Furthermore, the terms of the actual travel provider (airline,
                  hotel, tour operator, etc.) apply to your travel, so you must
                  also agree to and understand those terms. Your interaction with
                  any Travel Provider found or accessed through our Site is at
                  your own risk. We do not bear any responsibility should anything
                  go wrong with booking or otherwise using the Travel Products.
                </p>
                <p>
                  The Site may contain links to websites we do not operate,
                  control, or maintain (“
                  <strong>
                    <em>Third Party Websites</em>
                  </strong>
                  ”). We do not endorse any Third Party Websites, and we make no
                  representation or warranty in any respect regarding the Third
                  Party Websites. Any links to Third Party Websites on the Site
                  are provided solely for your convenience. If you do access any
                  Third Party Websites, you do so at your own risk and waive any
                  and all claims against us regarding the Third Party Websites or
                  our links thereto.
                </p>
                <h3>5. User Submissions</h3>
                <p>
                  Portions or features of the Services may allow you to contribute
                  or otherwise provide content or other information to the
                  Services. For such information, data, commentary,
                  communications, downloads, files, text, images, graphics,
                  videos, links, publications, content, tools, resources, programs
                  and products that you post or submit to, or otherwise make
                  available on, the Services (“
                  <strong>
                    <em>User Submissions</em>
                  </strong>
                  ”), you grant us and the users of the Services an unrestricted,
                  irrevocable, non-exclusive, worldwide, royalty-free and fully
                  paid up license under all Intellectual Property Rights to use,
                  reproduce, publicly display, publicly perform, copy, edit,
                  modify, translate, reformat, transmit and distribute such User
                  Submissions, with or without having your name attached thereto,
                  in any manner or form and for any lawful purpose, with full
                  rights to sublicense such rights through multiple tiers of
                  distribution. You acknowledge and agree that we shall not be
                  liable for any damages arising out of or related to your User
                  Submissions. You represent and warrant that you own all right,
                  title and interest in and to your User Submission that you post,
                  or that you own or control, or have received the necessary
                  licenses or other rights to, contribute such User Submissions to
                  the Services. You agree not to disclose any Personal Information
                  (as defined in our Privacy Policy) as part of a User Submission.
                  In particular, you represent and warrant that you are the
                  copyright owner of any photographs you make available via the
                  Services, or that you have all appropriate authority and
                  permissions from the copyright holder of such photographs to
                  permit their dissemination on the Site and to otherwise grant
                  the rights addressed herein.
                </p>
                <p>
                  In certain instances, your User Submissions may include trip
                  itinerary information, and we may seek to use such information
                  and provide access to such information to third parties. Before
                  providing such information to any third party, we will seek your
                  permission.
                </p>
                <p>
                  You are solely and entirely responsible for all of your User
                  Submissions. You shall assume all risks associated with any
                  reliance on the accuracy, completeness or usefulness of your
                  User Submissions from or by others. We do not guarantee the
                  accuracy, integrity or quality of the material you contribute or
                  the material anyone else contributes as part of a User
                  Submission. You acknowledge and agree that by accessing or using
                  the Services, you may be exposed to material from others that
                  you find objectionable. You acknowledge and agree that we shall
                  not be liable for any actions or inactions resulting from or
                  related to any User Submission made on the Services.
                </p>
                <h3>6. User Conduct</h3>
                <p>
                  By continuing to use the Site and Services, you agree not to
                  engage in any of the following prohibited uses (“
                  <strong>
                    <em>Prohibited Use(s)</em>
                  </strong>
                  ”). You acknowledge and agree that if it is determined, in our
                  sole discretion, that you have engaged in any Prohibited Use, we
                  may immediately terminate your access to the Site and Services,
                  with no possibility of appeal.
                </p>
                <p>You agree that you will not:</p>
                <ul>
                  <li>
                    {" "}
                    <strong>
                      Promote or conduct any unlawful activity or purpose,
                      including without limitation, any activity that could give
                      rise to criminal or civil liability;
                    </strong>
                  </li>
                  <li>
                    <strong>
                      Upload or otherwise disclose any Personal Information
                      belonging to or about a third party except as required by
                      the Services;
                    </strong>
                  </li>
                  <li>
                    Share your Account login information for any reason, including
                    to avoid the per-seat fees;
                  </li>
                  <li>
                    Copy, republish, frame, download, transmit, modify, adapt,
                    create derivative works based on, rent, lease, loan, sell,
                    assign, distribute, display, perform, license, sublicense or
                    reverse engineer the Site, Materials, or Services, except in
                    accordance with these Terms of Use;
                  </li>
                  <li>
                    Use data mining robots, scraping, or similar data gathering
                    and extraction methods to infringe on our intellectual
                    property and other valid commercial rights;
                  </li>
                  <li>
                    Use any means to attempt to or procure the personal
                    information of any other individual, including other users,
                    that may be used to identify or contact such individual
                    without their explicit consent;
                  </li>
                  <li>
                    Attempt to or impersonate any individual, even for benign
                    reasons, during the creation of your Account or your use of
                    the Services;
                  </li>
                  <li>
                    Use the Site or Services in any manner that infringes any
                    intellectual property rights or other rights of any party;
                  </li>
                  <li>
                    Transmit unsolicited or bulk communications to any Tourwiz
                    affiliated e-mail address or otherwise transmit or send spam
                    emails or unsolicited emails to users of the Site;
                  </li>
                  <li>
                    Disrupt, interfere with or inhibit any other user from using
                    and enjoying the Site or other affiliated or linked sites or
                    Services;
                  </li>
                  <li>
                    Access or use the Site in any manner that could damage,
                    disable, overburden or impair any Tourwiz server or the
                    network(s) connected to any Tourwiz server;
                  </li>
                  <li>
                    Violate any applicable laws or regulations related to the
                    access to or use of the Site or Services or engage in any
                    activity prohibited by these Terms of Use;
                  </li>
                  <li>
                    Prepare, compile, use, download or otherwise copy any user
                    directory or other user or usage information or any portion
                    thereof, or transmit, provide or otherwise distribute (whether
                    or not for a fee) such directory or information to any third
                    party;
                  </li>
                  <li>
                    Violate our rights or the rights of any third party (including
                    rights of privacy and publicity) or abuse, defame, harass,
                    stalk or threaten another; or
                  </li>
                  <li>
                    Use any Tourwiz domain name as a pseudonymous return e-mail
                    address.
                  </li>
                </ul>
                <h3>7. Data</h3>
                <p>
                  You agree that we have the right to collect and analyze data and
                  other information relating to the provision, use and performance
                  of various aspects of the Site and Services, and related systems
                  (for example, anonymous and aggregated information concerning
                  user behavior and use of the Services), and we will be free
                  (during and after the term hereof) to (i) use such information
                  and data to improve and enhance the Site Services and for other
                  development, diagnostic and corrective purposes in connection
                  with the Site and Services and other of our offerings, and (ii)
                  disclose such data solely in aggregate or other de-identified
                  form in connection with our business.
                </p>
                <h3>8. Paid Services</h3>
                <p>
                  We may require Services to be paid for on a recurring basis (“
                  <strong>
                    <em>Subscription Services</em>
                  </strong>
                  ”) or on an as-used basis (“
                  <strong>
                    <em>A La Carte Services</em>
                  </strong>
                  ” and, together with the Subscription Services, “
                  <strong>
                    <em>Paid Services</em>
                  </strong>
                  ”). We have the right to change, delete, discontinue or impose
                  conditions on <strong><em>Paid Services, Free Trial & Freemium Plan  or any feature or aspect of a
                    Service</em></strong>. Subscription Services may subject you to recurring fees
                  and/or terms. By signing up for a Subscription Service,
                  including after any <strong><em>free trial period or Freemium Plan</em></strong>, you agree to pay us the
                  subscription fee and any applicable taxes as displayed on the
                  Services at the time of sign up and set forth in your Account
                  settings or as otherwise agreed in writing (“
                  <strong>
                    <em>Subscription Fee</em>
                  </strong>
                  ”). A La Carte Services may subject you to fees charged per
                  usage and/or terms. By using an A La Carte Service, you agree to
                  pay the fees and any taxes incurred at the time of usage (“
                  <strong>
                    <em>A La Carte Fees</em>
                  </strong>
                  ” and, together with Subscription Fees, the “
                  <strong>
                    <em>Paid Service Fees</em>
                  </strong>
                  ”).
                </p>
                <p>
                  Paid Service Fees may be paid by credit card, debit card, or
                  other payment forms we may permit. If you link a debit or credit
                  card to your Account, you authorize us to collect Paid Service
                  Fees by debit from your linked debit card or charge to your
                  linked credit card.
                </p>
                <p>
                  Unless otherwise provided in a Subscription Service’s terms,
                  Subscription Fees will be charged on the 1st of every month
                  until cancelled. You may cancel a Subscription Service at any
                  time from your Account settings. If you cancel a Subscription
                  Service, you will continue to have access to that Subscription
                  Service through the end of your then current billing period, but
                  you will not be entitled to a refund or credit for any
                  Subscription Fee already due or paid. We reserve the right to
                  change our Subscription Fee upon thirty (30) days’ advance
                  notice. Your continued use of Subscription Services after notice
                  of a change to our Subscription Fee will constitute your
                  agreement to such changes.
                </p>
                <p>
                  Some of the Services may be billed on a per-seat basis, and you
                  acknowledge and agree that a seat is an individually-named or
                  identified user, and that you are not permitted to share login
                  information.
                </p>
                <p>
                  Some of the Services, including Subscription Services, may have
                  certain usage limits (“
                  <strong>
                    <em>Usage Limits</em>
                  </strong>
                  ”), as described in your Account or the Policies. You
                  acknowledge and agree that we may use technical or other
                  measures to enforce Usage Limits. You also acknowledge and agree
                  that you may incur overage charges for exceeding the Usage
                  Limits per the terms of your Subscription Service (“
                  <strong>
                    <em>Overages</em>
                  </strong>
                  ”), and you authorize us to charge your linked payment account
                  for Overages in accordance with our standard billing procedures.
                </p>
                <h3>9. Tourwiz Professional</h3>
                <p>
                  If you use our professional service (“
                  <strong>
                    <em>Tourwiz Professional</em>
                  </strong>
                  ”), this section of this Agreement applies to you. Tourwiz
                  Professional may allow you to customize the Site, Products,
                  and/or the Services using your own data or intellectual property
                  or store data or intellectual property such as customer lists
                  and content libraries on the Site, Products, and/or the Services
                  as part of the Tourwiz Professional service (such data and
                  intellectual property collectively referred to as “
                  <strong>
                    <em>User Data</em>
                  </strong>
                  ”). You will remain the owner of any User Data and grant us a
                  non-exclusive, worldwide, royalty-free, and fully paid up
                  license to host such User Data in order to provide Tourwiz
                  Professional to you.
                </p>
                <p>
                  As a user of Tourwiz Professional, you acknowledge and agree
                  that you are solely responsible for adhering to all applicable
                  laws, ordinances, and regulations of any name or nature when
                  using Tourwiz Professional, and agree to indemnify and hold us
                  and our affiliates harmless from and against any violation of
                  such laws in accordance with Section 17 of this Agreement.
                  Furthermore, you acknowledge and agree that the Services we
                  offer are purely a software platform and we cannot be and are
                  not responsible either for incorrect, inaccurate, or incomplete
                  information on the Services or for any disputes that arise
                  between you and any Clients or vendors of other products or
                  travel services. You represent and warrant that you have
                  insurance coverage of a type and limit appropriate for your
                  business, and you acknowledge and agree that we may require you,
                  now or in the future, to provide us with proof that you hold
                  insurance satisfactory to us in our sole discretion as a
                  condition for your use of Tourwiz Professional.
                </p>
                <h3>10. Payment Tool</h3>
                <p>
                  One of the Services we may offer is an invoicing and payment
                  collection tool (the “
                  <strong>
                    <em>Payment Tool</em>
                  </strong>
                  ”) for users of Tourwiz Professional (“
                  <strong>
                    <em>Professionals</em>
                  </strong>
                  ”) to invoice and collect payment from their clients (“
                  <strong>
                    <em>Clients</em>
                  </strong>
                  ”). We are not a party to any agreement between Professionals
                  and Clients.
                </p>
                <p>
                  In order to use the Payment Tool, Professionals shall list their
                  terms and conditions, which such terms will be included on any
                  invoices or bills provided under the Payment Tool (each an “
                  <strong>
                    <em>Invoice</em>
                  </strong>
                  ”). We do not offer refunds for Invoices. Once a Client pays an
                  Invoice, any future dispute regarding the payment of such
                  Invoice shall be directed to the Professional that issued the
                  Invoice, and, you, whether you are a Client or a Professional,
                  acknowledge and agree that (i) we are not a party to any
                  agreement between Clients and Professionals and (ii) that all
                  Invoice payments are subject to the terms and conditions of the
                  Invoice.
                </p>
                <p>
                  {" "}
                  <strong>
                    If you are a Professional using the Payment Tool
                  </strong>
                  , you appoint us as your limited collection agent solely for the
                  purpose of accepting Invoice payments from your clients. You
                  agree that payment made from a Client to us will be considered
                  the same as a payment made directly to you as a Professional.
                  Our obligation to pay you is subject to and conditional upon
                  successful receipt of associated payments from Clients. In
                  accepting appointment as the limited authorized agent of a
                  Professional, we assume no liability for any of the
                  Professional’s acts or omissions.
                </p>
                <p>
                  As a Professional using the Payment Tool, you acknowledge and
                  agree that you are solely responsible for the calculation and
                  payment of any and all taxes required to be paid on funds
                  invoiced and/or collected using the Payment Tool.
                </p>
                <p>
                  <strong>If you are a Client</strong>, you acknowledge and agree
                  that notwithstanding the fact that we are not a party to any
                  agreement between you and a Professional, we act as the
                  Professional’s payment collection agent for the limited purpose
                  of accepting payments from you on behalf of the Professional.
                  Upon your payment to us of the full amount of any particular
                  transaction, your payment obligation to the Professional is
                  extinguished.
                </p>
                <p>
                  <strong>
                    We expressly disclaim any liability that may arise between
                    users of the Payment Tool, with the exception of our role as a
                    limited payment collection agent for Professionals.
                  </strong>
                </p>
                <h3>11. Payment Processing</h3>
                <p>
                  Payment processing services on the Services are provided by
                  Stripe and are subject to the Stripe Connected Account
                  Agreement, which includes the Stripe Terms of Service
                  (collectively, the “
                  <strong>
                    <em>Stripe Services Agreement</em>
                  </strong>
                  ”). You agree to be bound by the Stripe Services Agreement, as
                  the same may be modified by Stripe from time to time. As a
                  condition of our enabling payment processing services through
                  Stripe, you agree to provide us with accurate and complete
                  information about you and your business, and you authorize us to
                  share it and transaction information related to your use of the
                  payment processing services provided by Stripe.
                </p>
                <h3>12. Quality, Accuracy, and Completeness</h3>
                <p>
                  The Site may occasionally contain information found to be
                  inaccurate, incomplete or out of date. Tourwiz makes no
                  representations as to the completeness or accuracy of the Site
                  or Services and other information, advice or recommendations
                  made available on this Site, nor does it make any
                  representations or warranties as to the quality or safety of any
                  Services, Travel Products, or other third party products or
                  services offered or made available via the Site. All features,
                  content, specifications and prices of Travel Products and
                  Services described or depicted on this Site are subject to
                  change without notice. The inclusion of any Travel Product or
                  Service on this Site at a particular time does not imply or
                  warrant that such Travel Product or Service will be available at
                  any time.
                </p>
                <h3>13. Intellectual Property Rights</h3>
                <p>
                  Except as expressly provided herein, the Site and Services, as
                  well as their selection and arrangement, are protected by
                  copyrights, trademarks, patents, trade secrets and other
                  intellectual property and proprietary rights (collectively, “
                  <strong>
                    <em>Intellectual Property Rights</em>
                  </strong>
                  ”), and any unauthorized use of the same may violate such laws
                  and this Agreement. Except as expressly provided herein, we do
                  not grant any express or implied right to use the Services. You
                  agree not to copy, republish, frame, download, transmit, modify,
                  adapt, create derivative works based on, rent, lease, loan,
                  sell, assign, distribute, display, perform, license, sublicense
                  or reverse engineer the Services, any portions thereof, or the
                  selection and/or arrangement of the Site or the Services. In
                  addition, you agree not to use any data mining, robots or
                  similar data gathering and extraction methods in connection with
                  the Site or Services, or to otherwise take any action that may
                  infringe on our Intellectual Property Rights.
                </p>
                <p>
                  The trademarks, service marks, logos and URLs (collectively, the
                  “
                  <strong>
                    <em>Marks</em>
                  </strong>
                  ”) displayed on this Site are the property of us, our licensors
                  or other third parties. You are not permitted to use the Marks
                  without the prior written consent of us, our licensors or such
                  third party that may own the Marks.
                </p>
                <h3>14. Copyright Infringement</h3>
                <p>
                  We respect the intellectual property rights of others. The
                  Digital Millennium Copyright Act of 1998 (the “
                  <strong>
                    <em>DMCA</em>
                  </strong>
                  ”) provides a complaint procedure for copyright owners who
                  believe that website material infringes their rights under U.S.
                  copyright law. If you believe that your work has been improperly
                  copied and posted on the website, please provide us with the
                  following information: (1) name, address, telephone number,
                  email address and an electronic or physical signature of the
                  copyright owner or of the person authorized to act on his/ her
                  behalf; (2) a description of the copyrighted work that you claim
                  has been infringed; (3) a description of where on the Site the
                  material that you claim is infringing is located; (4) a written
                  statement that you have a good faith belief that the disputed
                  use is not authorized by the copyright owner, its agent, or the
                  law; and (5) a statement by you, made under penalty of perjury,
                  that the above information in your notice is accurate and that
                  you are the copyright owner or authorized to act on the
                  copyright owner’s behalf. These requirements must be followed to
                  give us legally sufficient notice of infringement. Send
                  copyright infringement complaints to the following email
                  address:{" "}
                  <a href="mailto:info@tourwizonline.com">
                    info@tourwizonline.com
                  </a>
                  . We suggest that you consult your legal advisor before filing a
                  DMCA notice with our copyright agent. There can be penalties for
                  false claims under the DMCA.
                </p>
                <h3>15. Warranty Disclaimer</h3>
                <p>
                  <strong>
                    You agree that the Services are available on an “as is” basis,
                    without any warranty, and that you use the Services at your
                    own risk. We disclaim, to the maximum extent permitted by law,
                    any and all warranties, whether express or implied, including,
                    without limitation, (a) warranties of merchantability or
                    fitness for a particular purpose, (b) warranties against
                    infringement of any third party intellectual property or
                    proprietary rights, (c) warranties relating to delays,
                    interruptions, errors, or omissions in the Services or on the
                    Site, (d) warranties relating to the accuracy or correctness
                    of data on the Services, and (e) any other warranties
                    otherwise relating to our performance, nonperformance, or
                    other acts or omissions.
                  </strong>
                </p>
                <p>
                  <strong>
                    We do not warrant that the Site or the Services will operate
                    error-free or that the Site is free of computer viruses and/or
                    other harmful materials. If your use of the Site or the
                    Services results in the need for servicing or replacing
                    equipment or data, we are not responsible for any such costs.
                  </strong>
                </p>
                <p>
                  <strong>
                    You acknowledge and agree that (a) we do not control, endorse,
                    or accept responsibility for any products, materials, or
                    services offered by third parties; (b) we make no
                    representations or warranties about such third parties, their
                    products, materials, or services; (c) any dealings you may
                    have with such third parties are at your own risk; and (d) we
                    shall not be liable or responsible for any product, materials,
                    or services offered by third parties.
                  </strong>
                </p>
                <p>
                  <strong>
                    We expressly disclaim any and all liability with respect to
                    any damages, personal injury, or other harm that may be caused
                    by your reliance on any suggestions, recommendations, or other
                    information provided on the Services.
                  </strong>
                </p>
                <p>
                  <strong>
                    To the extent applicable, you hereby waive the protections of
                    California Civil Code § 1542 (and any other analogous law in
                    any other applicable jurisdiction) which says: “A general
                    release does not extend to claims which the creditor does not
                    know or suspect to exist in his or her favor at the time of
                    executing the release, which if known by him or her must have
                    materially affected his or her settlement with the debtor.”
                  </strong>
                </p>
                <p>
                  Some jurisdictions do not allow the exclusion or limitation of
                  certain categories of damages or implied warranties; therefore,
                  the above limitations may not apply to you. In such
                  jurisdictions, our liability is limited to the greatest extent
                  permitted by law.
                </p>
                <h3>16. Limitations of Liability</h3>
                <p>
                  <strong>
                    Any liability we have to you in connection with this
                    Agreement, under any cause of action or theory other than a
                    claim that we failed to forward payments received from Clients
                    to Professionals pursuant to Section 10 hereof, is strictly
                    limited to the greater of (i) $100 or (ii) the amount paid to
                    us by you in the six month period immediately prior to the
                    time such cause of action accrued. Without limiting the
                    previous sentence, in no event shall we or any of our
                    affiliates be liable to you for any indirect, special,
                    incidental, consequential, punitive, or exemplary damages
                    arising out of or in connection with, this Agreement. The
                    foregoing limitations apply whether the alleged liability is
                    based on contract, tort, negligence, strict liability, or any
                    other basis, even if we or our affiliates have been advised of
                    the possibility of such damages.
                  </strong>
                </p>
                <p>
                  <strong>
                    You agree to indemnify and hold us harmless for any breach of
                    security or any compromise of your Account.
                  </strong>
                </p>
                <p>
                  Some jurisdictions do not allow the exclusion or limitation of
                  incidental or consequential; therefore, the above limitations
                  may not apply to you. In such jurisdictions, our liability is
                  limited to the greatest extent permitted by law.
                </p>
                <h3>17. Indemnification</h3>
                <p>
                  You agree to indemnify and hold harmless us, our affiliates and
                  our and their officers, directors, partners, agents, and
                  employees from and against any loss, liability, claim, or
                  demand, including reasonable attorneys’ fees (collectively, “
                  <strong>
                    <em>Claims</em>
                  </strong>
                  ”), made by any third party due to or arising out of your use of
                  the Site and Services in violation of this Agreement, any breach
                  of the representations and warranties you make in this
                  Agreement, or your User Submissions. You agree to be solely
                  responsible for defending any Claims against or suffered by us,
                  subject to our right to participate with counsel of our own
                  choosing.
                </p>
                <h3>18. Electronic Signatures and Notices</h3>
                <p>
                  Certain activities on the Services may require you to make an
                  electronic signature. You understand and accept that an
                  electronic signature has same legal rights and obligations as a
                  physical signature.
                </p>
                <p>
                  If you have an Account, you agree that we may provide you any
                  and all required notices electronically through your Account or
                  other electronic means. You agree that we are not responsible
                  for any delivery fees charged to you as a result of your receipt
                  of our electronic notices.
                </p>
                <h3>19. Governing Law</h3>
                <p>
                  This Agreement is governed by laws of India, without giving effect to conflicts of law principles. You agree that, to the extent applicable and expressly subject to the Dispute Resolution provisions below, you submit to the exclusive jurisdiction of Gujarat, India and the courts of Ahmedabad shall have exclusive jurisdiction in case of any dispute between the parties.
                </p>
                <h3>20. Dispute Resolution</h3>
                <p>
                  Any and all disputes, claims or differences arising out of or relating to this Agreement or the alleged breach thereto shall be settled by mutual consultation between the parties in good faith as promptly as possible, but failing such amicable settlement, the said dispute shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre (“SIAC”) in accordance with the Arbitration Rules of the Singapore International Arbitration Centre ("SIAC Rules") for the time being in force, which rules are deemed to be incorporated by reference in this clause. The seat of the arbitration shall be at Gift City, Gandhinagar, Gujarat, India. The Tribunal shall consist of sole arbitrator. The language of the arbitration shall be English.
                </p>
                <p>
                  <em>Confidentiality.</em>
                  All aspects of the arbitration proceeding, including but not limited to the award of the arbitrator and compliance therewith, shall be strictly confidential. You agree to maintain confidentiality unless otherwise required by law. This paragraph shall not prevent a party from submitting to a court of law any information necessary to enforce this Section 20, to enforce an arbitration award, or to seek injunctive or equitable relief.
                </p>
                <p>
                  <em>Severability.</em>
                  If any part or parts of this Section 20 are found under the law to be invalid or unenforceable by a court of competent jurisdiction, then such specific part or parts shall be of no force and effect and shall be severed and the remainder of the Agreement shall continue in full force and effect.
                </p>
                <p>
                  <em>Right to Waive.</em>
                  Any or all of the rights and limitations set forth in this Section 20may be waived by the party against whom the claim is asserted. Such waiver shall not waive or affect any other portion of this Section 20.
                </p>
                <p>
                  <em>Survival of Agreement.</em>
                  This Section 20 will survive the termination of our business relationship with you.
                </p>
                <p>
                  <em>Small Claims Court.</em>
                  Notwithstanding the foregoing, either party will be entitled to bring an individual action in small claims court.
                </p>
                <p>
                  <em>Claims Not Subject to Arbitration.</em>
                  Notwithstanding the foregoing, claims of defamation, violation of the Computer Fraud and Abuse Act, and infringement or misappropriation of our intellectual property rights shall not be subject to this Section 20.
                </p>

                <h3>21. Miscellaneous</h3>
                <p>
                  We may assign, transfer, delegate, or otherwise hypothecate our
                  rights under this Agreement in our sole discretion. If we fail
                  to enforce a provision of this Agreement, you agree that such a
                  failure does not constitute a waiver to enforce the provision
                  (or any other provision hereunder). If any provision of this
                  Agreement is held or made invalid, the invalidity does not
                  affect the remainder of this Agreement. We reserve all rights
                  not expressly granted in this Agreement and disclaim all implied
                  licenses.
                </p>
                <hr />
                <a name="pp"></a>
                <h1 name="privacyPolicy">Privacy Policy</h1>
                <h3>Introduction</h3>
                <p>Welcome to Tourwiz's privacy policy.</p>
                <p>
                  Tourwiz respects your privacy and is committed to protecting
                  your personal data. This privacy policy will inform you as to
                  how we look after your personal data when you visit our website
                  and tell you about your privacy rights and how the law protects
                  you. Please refer to the Glossary for more information about
                  capitalized but undefined terms used in this Privacy Policy.
                </p>
                <h3>Important information and who we are</h3>
                <p>
                  <strong>Purpose of this privacy policy</strong>
                </p>
                <p>
                  This privacy policy aims to give you information on how Tourwiz
                  collects and processes your personal data through your use of
                  this website, including any data you may provide through this
                  website when you sign up to our service or purchase a product.
                </p>
                <p>
                  This website is not intended for children and we do not
                  knowingly collect data relating to children.
                </p>
                <p>
                  It is important that you read this privacy policy together with
                  any other privacy policy or fair processing notice we may
                  provide on specific occasions when we are collecting or
                  processing personal data about you so that you are fully aware
                  of how and why we are using your data. This privacy policy
                  supplements the other notices and is not intended to override
                  them.
                </p>
                <h3>Controller</h3>
                <p>
                  CLtech Solutions Private Limited. is the controller responsible
                  for your personal data (collectively referred to as "Tourwiz",
                  "we", "us" or "us" in this privacy policy). Tourwiz is made up
                  of different legal entities. This privacy policy is issued on
                  behalf of the Tourwiz Group so when we mention "Tourwiz", "we",
                  "us" or "us" in this privacy policy, we are referring to the
                  relevant company in the Tourwiz Group responsible for processing
                  your data. CLtech Solutions Private Limited. is the controller
                  responsible for this website.
                </p>
                <p>
                  We have appointed a data protection manager ("DPM") who is
                  responsible for overseeing questions in relation to this privacy
                  policy. If you have any questions about this privacy policy,
                  including any requests to exercise your legal rights, please
                  contact the DPM using the details set out below.
                </p>
                <h3>Contact details</h3>
                <p>Our full details are:</p>
                <p>
                  Full name of legal entity: CLTech Solutions Private Limited, Inc.
                  <br />
                  Postal address: Cltech Solutions pvt. Ltd., 301 Balleshwar Avenue,
                  Bodakdev, Ahmedabad 380015
                  <br />
                </p>
                <p>
                  If you are a citizen of the EU, you have the right to make a
                  complaint at any time to the Information Commissioner's Office
                  (ICO), the UK supervisory authority for data protection issues
                  (www.ico.org.uk). We would, however, appreciate the chance to
                  deal with your concerns before you approach the ICO so please
                  contact us in the first instance.
                </p>
                <p>
                  <u>
                    Changes to the privacy policy and your duty to inform us of
                    changes
                  </u>
                </p>
                <p>
                  This version was last updated on April 1, 2021 and historic
                  versions can be obtained by contacting us. We may change this
                  privacy policy in our sole discretion, and your continued use of
                  the Site or Services indicates acceptance of the new policies.
                </p>
                <p>
                  It is important that the personal data we hold about you is
                  accurate and current. Please keep us informed if your personal
                  data changes during your relationship with us.
                </p>
                <p>
                  <u>Third-party links</u>
                </p>
                <p>
                  This website may include links to third-party websites, plug-ins
                  and applications. Clicking on those links or enabling those
                  connections may allow third parties to collect or share data
                  about you. We do not control these third-party websites and are
                  not responsible for their privacy statements. When you leave our
                  website, we encourage you to read the privacy policy of every
                  website you visit.
                </p>
                <h3>The data we collect about you</h3>
                <p>
                  Personal data, or personal information, means any information
                  about an individual from which that person can be identified. It
                  does not include data where the identity has been removed
                  (anonymous data).
                </p>
                <ul>
                  <li>
                    {" "}
                    <strong>Identity Data</strong>&nbsp;may include first name,
                    last name, company name, job title, website URL and photograph
                    (headshot) and other demographic data that you provide to
                    Tourwiz.
                  </li>
                  <li>
                    {" "}
                    <strong>Contact Data</strong>&nbsp;includes billing address,
                    email address and telephone numbers.
                  </li>
                  <li>
                    {" "}
                    <strong>Financial Data</strong>&nbsp;includes bank account and
                    payment card details.
                  </li>
                  <li>
                    {" "}
                    <strong>Transaction Data</strong>&nbsp;includes details about
                    payments to and from you and other details of products and
                    services you have purchased from us.
                  </li>
                  <li>
                    {" "}
                    <strong>Technical Data</strong>&nbsp;includes internet
                    protocol (IP) address, your login data, browser type and
                    version, time zone setting and location, browser plug-in types
                    and versions, operating system and platform and other
                    technology on the devices you use to access this website.
                  </li>
                  <li>
                    {" "}
                    <strong>Profile Data</strong> includes your username and
                    password, purchases made by you, your preferences, feedback
                    and survey responses.
                  </li>
                  <li>
                    {" "}
                    <strong>Client Data</strong>&nbsp;covers the personal data
                    about a client (generally the traveler) which may be added to
                    Tourwiz by virtue of being a client of a Tourwiz Account
                    holder, and is limited to name, email address and travel
                    schedule. For purposes of this Privacy Policy, clients have
                    the right to request that Tourwiz delete all information
                    pertaining to them from our Site and Services, either by
                    contacting us directly or by requesting that your travel
                    professional contact us on the client's behalf. The travel
                    professional who uploads the Client Data shall be authorized
                    to have any Client Data removed from the Tourwiz system, with
                    or without client knowledge or permission.
                  </li>
                  <li>
                    {" "}
                    <strong>Usage Data</strong> includes information about how you
                    use our website, products and services.
                  </li>
                  <li>
                    {" "}
                    <strong>Marketing and Communications Data</strong>
                    &nbsp;includes your preferences in receiving marketing from us
                    and our third parties and your communication preferences.
                  </li>
                </ul>
                <p>
                  We also collect, use and share&nbsp;
                  <strong>Aggregated Data</strong>&nbsp;such as statistical or
                  demographic data for any purpose. Aggregated Data may be derived
                  from your personal data but is not considered personal data in
                  law as this data does&nbsp;not&nbsp;directly or indirectly
                  reveal your identity. For example, we may aggregate your Usage
                  Data to calculate the percentage of users accessing a specific
                  website feature. However, if we combine or connect Aggregated
                  Data with your personal data so that it can directly or
                  indirectly identify you, we treat the combined data as personal
                  data which will be used in accordance with this privacy policy.
                </p>
                <p>
                  We do not collect any&nbsp;
                  <strong>Special Categories of Personal Data</strong>
                  &nbsp;about you (this includes details about your race or
                  ethnicity, religious or philosophical beliefs, sex life, sexual
                  orientation, political opinions, trade union membership,
                  information about your health and genetic and biometric data).
                  Nor do we collect any information about criminal convictions and
                  offences.
                </p>
                <p>
                  User Content (as defined in the Tourwiz Terms of Use) is, to the
                  extent that it doesn't include any personal information as
                  detailed in this Policy, shall not be subject to the terms of
                  the deletion policies of Tourwiz as it does not include any
                  personal information.
                </p>
                <p>
                  <u>If you fail to provide personal data</u>
                </p>
                <p>
                  Where we need to collect personal data by law, or under the
                  terms of a contract we have with you and you fail to provide
                  that data when requested, we may not be able to perform the
                  contract we have or are trying to enter into with you (for
                  example, to provide you with goods or services). In this case,
                  we may have to cancel a product or service you have with us, but
                  we will notify you if this is the case at the time.
                </p>
                <h3>How is your personal data collected?</h3>
                <p>
                  We use different methods to collect data from and about you are
                  including through:
                </p>
                <ul>
                  <li>
                    {" "}
                    <strong>Direct interactions.</strong> You may give us your
                    Identity, Contact, Client and Financial Data by filling in
                    forms or by corresponding with us by post, phone, email or
                    otherwise. This includes personal data you provide when you:
                    <ul>
                      <li> create an account on our website;</li>
                      <li> use the Tourwiz Itinerary Builder;</li>
                      <li> request marketing to be sent to you; or</li>
                      <li> give us feedback.</li>
                    </ul>
                  </li>
                  <li>
                    {" "}
                    <strong>Automated technologies or interactions.</strong>
                    &nbsp;As you interact with our website, we may automatically
                    collect Technical Data about your equipment, browsing actions
                    and patterns. We may collect this personal data by using
                    cookies, server logs and other similar technologies. We may
                    also receive Technical Data about you if you visit other
                    websites employing our cookies.
                  </li>
                  <li>
                    {" "}
                    <strong>Third parties or publicly available sources.</strong>
                    &nbsp;We may receive personal data about you from various
                    third parties and public sources as set out below:
                  </li>
                  <li>
                    {" "}
                    Technical Data from the following parties:
                    <ul>
                      <li> (a) analytics providers;</li>
                      <li> (b) advertising networks; and</li>
                      <li> (c) search information providers.</li>
                    </ul>
                  </li>
                  <li>
                    {" "}
                    Contact, Financial and Transaction Data from providers of
                    technical, payment and delivery services.
                  </li>
                  <li>
                    {" "}
                    Identity and Contact Data from data brokers or aggregators.
                  </li>
                  <li>
                    {" "}
                    Identity and Contact Data from publicly availably sources.
                  </li>
                </ul>
                <h3>How we use your personal data</h3>
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we will use your personal data in the following
                  circumstances:
                </p>
                <ul>
                  <li>
                    {" "}
                    Where we need to perform the contract we are about to enter
                    into or have entered into with you.
                  </li>
                  <li>
                    {" "}
                    Where it is necessary for our legitimate interests (or those
                    of a third party) and your interests and fundamental rights do
                    not override those interests.
                  </li>
                  <li>
                    {" "}
                    Where we need to comply with a legal or regulatory obligation.
                  </li>
                </ul>
                <p>
                  See the&nbsp;<em>Glossary</em>&nbsp;to find out more about the
                  types of lawful basis that we will rely on to process your
                  personal data. Generally, we do not rely on consent as a legal
                  basis for processing your personal data other than in relation
                  to sending third party direct marketing communications to you
                  via email or text message. You have the right to withdraw
                  consent to marketing at any time by&nbsp;
                  <Link to="/contact-us">contacting us.</Link>
                </p>
                <p>
                  <u>Purposes for which we will use your personal data</u>
                </p>
                <p>
                  We have set out below, in table format, a description of all the
                  ways we plan to use your personal data, and which of the legal
                  bases we rely on to do so. We have also identified what our
                  legitimate interests are where appropriate. Note that we may
                  process your personal data for more than one lawful ground
                  depending on the specific purpose for which we are using your
                  data. Please&nbsp;
                  <Link to="/contact-us">contact us</Link>&nbsp;if you need details
                  about the specific legal ground we are relying on to process
                  your personal data where more than one ground has been set out
                  in the table below.
                </p>
                <div className="table-responsive">
                  <table className="table borderer">
                    <tbody>
                      <tr>
                        <td width="237">
                          <p>
                            <strong>Purpose/Activity</strong>
                          </p>
                        </td>
                        <td width="184">
                          <p>
                            <strong>Type of data</strong>
                          </p>
                        </td>
                        <td width="291">
                          <p>
                            <strong>
                              Lawful basis for processing including basis of
                              legitimate interest
                            </strong>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>To register you as a new customer</p>
                        </td>
                        <td width="184">
                          <p>(a) Identity</p>
                          <p>(b) Contact</p>
                        </td>
                        <td width="291">
                          <p>Performance of a contract with you</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>To process and deliver your order including:</p>
                          <p>(a) Manage payments, fees and charges</p>
                          <p>(b) Collect and recover money owed to us</p>
                        </td>
                        <td width="184">
                          <p>(a) Identity</p>
                          <p>(b) Contact</p>
                          <p>(c) Financial</p>
                          <p>(d) Transaction</p>
                          <p>(e) Marketing and Communications</p>
                        </td>
                        <td width="291">
                          <p>(a) Performance of a contract with you</p>
                          <p>
                            (b) Necessary for our legitimate interests (to recover
                            debts due to us)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>
                            To manage our relationship with you which will include:
                          </p>
                          <p>
                            (a) Notifying you about changes to our terms or privacy
                            policy
                          </p>
                          <p>(b) Asking you for feedback</p>
                        </td>
                        <td width="184">
                          <p>(a) Identity</p>
                          <p>(b) Contact</p>
                          <p>(c) Profile</p>
                          <p>(d) Marketing and Communications</p>
                        </td>
                        <td width="291">
                          <p>(a) Performance of a contract with you</p>
                          <p>(b) Necessary to comply with a legal obligation</p>
                          <p>
                            (c) Necessary for our legitimate interests (to keep our
                            records updated and to study how customers use our
                            products/services)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>
                            To administer and protect our business and this website
                            (including troubleshooting, data analysis, testing,
                            system maintenance, support, reporting and hosting of
                            data)&nbsp;
                          </p>
                        </td>
                        <td width="184">
                          <p>(a) Identity</p>
                          <p>(b) Contact</p>
                          <p>(c) Technical</p>
                        </td>
                        <td width="291">
                          <p>
                            (a) Necessary for our legitimate interests (for running
                            our business, provision of administration and IT
                            services, network security, to prevent fraud and in the
                            context of a business reorganization or group
                            restructuring exercise)
                          </p>
                          <p>(b) Necessary to comply with a legal obligation</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>
                            To deliver relevant website content and advertisements
                            to you and measure or understand the effectiveness of
                            the advertising we serve to you
                          </p>
                        </td>
                        <td width="184">
                          <p>(a) Identity</p>
                          <p>(b) Contact</p>
                          <p>(c) Profile</p>
                          <p>(d) Usage</p>
                          <p>(e) Marketing and Communications</p>
                          <p>(f) Technical</p>
                        </td>
                        <td width="291">
                          <p>
                            Necessary for our legitimate interests (to study how
                            customers use our products/services, to develop them, to
                            grow our business and to inform our marketing strategy)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>
                            To use data analytics to improve our website,
                            products/services, marketing, customer relationships and
                            experiences
                          </p>
                        </td>
                        <td width="184">
                          <p>(a) Technical</p>
                          <p>(b) Usage</p>
                        </td>
                        <td width="291">
                          <p>
                            Necessary for our legitimate interests (to define types
                            of customers for our products and services, to keep our
                            website updated and relevant, to develop our business
                            and to inform our marketing strategy)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="237">
                          <p>
                            To make suggestions and recommendations to you about
                            goods or services that may be of interest to you
                          </p>
                        </td>
                        <td width="184">
                          <p>(a) Identity</p>
                          <p>(b) Contact</p>
                          <p>(c) Technical</p>
                          <p>(d) Usage</p>
                          <p>(e) Profile</p>
                        </td>
                        <td width="291">
                          <p>
                            Necessary for our legitimate interests (to develop our
                            products/services and grow our business)
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <u>Marketing</u>
                </p>
                <p>
                  We strive to provide you with choices regarding certain personal
                  data uses, particularly around marketing and advertising.
                </p>
                <p>
                  <u>Promotional offers from us</u>
                </p>
                <p>
                  We may use your Identity, Contact, Technical, Usage and Profile
                  Data to form a view on what we think you may want or need, or
                  what may be of interest to you. This is how we decide which
                  products, services and offers may be relevant for you (we call
                  this marketing).
                </p>
                <p>
                  You will receive marketing communications from us if you have
                  requested information from us or purchased goods or services
                  from us and, in each case, you have not opted out of receiving
                  that marketing.
                </p>
                <p>
                  <u>Third-party marketing</u>
                </p>
                <p>
                  We will get your express opt-in consent before we share your
                  personal data with any company outside the Tourwiz group of
                  companies for marketing purposes.
                </p>
                <p>
                  <u>Opting out</u>
                </p>
                <p>
                  You can ask us or third parties to stop sending you marketing
                  messages at any time by logging into the website and checking or
                  unchecking relevant boxes to adjust your marketing preferences
                  or by following the opt-out links on any marketing message sent
                  to you.
                </p>
                <p>
                  Where you opt out of receiving these marketing messages, this
                  will not apply to personal data provided to us as a result of a
                  product/service purchase or other transaction.
                </p>
                <p>
                  <u>Cookies</u>
                </p>
                <p>
                  In order to improve our services and provide more convenient,
                  relevant experiences to our customers, we and our agents may use
                  "cookies," "web beacons," and similar devices to track your
                  activities. A cookie is a small amount of data that is
                  transferred to your browser by a web server and can only be read
                  by the server that gave it to you. It functions as your
                  identification card and enables us to record your passwords and
                  preferences. It cannot be executed as code or deliver viruses. A
                  web beacon is a small transparent .gif image that is embedded in
                  an HTML page or email used to track when the page or email has
                  been viewed. Most browsers are initially set to accept cookies,
                  and most services that include similar devices are typically
                  initially activated to collect data. You can set your browser to
                  notify you when you receive a cookie, giving you the chance to
                  decide whether or not to accept it.
                </p>
                <p>
                  <u>Change of purpose</u>
                </p>
                <p>
                  We will only use your personal data for the purposes for which
                  we collected it, unless we reasonably consider that we need to
                  use it for another reason and that reason is compatible with the
                  original purpose. If you wish to get an explanation as to how
                  the processing for the new purpose is compatible with the
                  original purpose, please&nbsp;
                  <Link to="/contact-us">contact us</Link> If we need to use your
                  personal data for an unrelated purpose, we will notify you and
                  explain the legal basis which allows us to do so.
                </p>
                <p>
                  Please note that we may process your personal data without your
                  knowledge or consent, in compliance with the above rules, where
                  this is required or permitted by law.
                </p>
                <h3>Disclosures of your personal data</h3>
                <p>
                  We may have to share your personal data with the parties set out
                  below for the purposes set out in the table in paragraph 4
                  above.
                </p>
                <ul>
                  <li>
                    {" "}
                    Internal Third Parties as set out in the&nbsp;Glossary.
                  </li>
                  <li>
                    {" "}
                    External Third Parties as set out in the&nbsp;Glossary.
                  </li>
                  <li> Specific third parties</li>
                  <li>
                    {" "}
                    Third parties to whom we may choose to sell, transfer, or
                    merge parts of our business or our assets. Alternatively, we
                    may seek to acquire other businesses or merge with them. If a
                    change happens to our business, then the new owners may use
                    your personal data in the same way as set out in this privacy
                    policy.
                  </li>
                </ul>
                <p>
                  We require all third parties to respect the security of your
                  personal data and to treat it in accordance with the law. We do
                  not allow our third-party service providers to use your personal
                  data for their own purposes and only permit them to process your
                  personal data for specified purposes and in accordance with our
                  instructions.
                </p>
                <p>
                  Tourwiz Account holders may likely share Client Data with
                  entities around the world (for example, when making a hotel
                  booking on a client's behalf). Clients should refer to the
                  privacy policy of the relevant Tourwiz Account holder to
                  understand the way in which their personal data will be
                  processed by third parties in relation to specific bookings.
                </p>
                <h3>For EU Citizens</h3>
                <p>
                  We share your personal data within the Tourwiz Group. This will
                  involve transferring your data in and out of the United States
                  and the European Economic Area. We ensure your personal data is
                  protected by requiring all our group companies to follow the
                  same rules when processing your personal data. These rules are
                  called "binding corporate rules".
                </p>
                <p>
                  Many of our external third parties are based outside the
                  European Economic Area so their processing of your personal data
                  will involve a transfer of data outside the EEA.
                </p>
                <p>
                  Whenever we transfer your personal data out of the EEA, we
                  ensure a similar degree of protection is afforded to it by
                  ensuring at least one of the following safeguards is
                  implemented:
                </p>
                <ul>
                  <li>
                    {" "}
                    We will only transfer your personal data to countries that
                    have been deemed to provide an adequate level of protection
                    for personal data by the European Commission. For further
                    details, see European Commission: Adequacy of the protection
                    of personal data in non-EU countries.
                  </li>
                  <li>
                    {" "}
                    Where we use certain service providers, we may use specific
                    contracts approved by the European Commission which give
                    personal data the same protection it has in Europe. For
                    further details, see European Commission: Model contracts for
                    the transfer of personal data to third countries.
                  </li>
                  <li>
                    {" "}
                    Where we use providers based in the US, we may transfer data
                    to them if they are part of the Privacy Shield which requires
                    them to provide similar protection to personal data shared
                    between the Europe and the US. For further details, see
                    European Commission: EU-US Privacy Shield.
                  </li>
                </ul>
                <p>
                  Please&nbsp;<Link to="/contact-us">contact us</Link>&nbsp;if you
                  want further information on the specific mechanism used by us
                  when transferring your personal data out of the EEA.
                </p>
                <h3>Data security</h3>
                <p>
                  We have put in place appropriate security measures to prevent
                  your personal data from being accidentally lost, used or
                  accessed in an unauthorized way, altered or disclosed. In
                  addition, we limit access to your personal data to those
                  employees, agents, contractors and other third parties who have
                  a business need to know. They will only process your personal
                  data on our instructions and they are subject to a duty of
                  confidentiality.
                </p>
                <p>
                  We have put in place procedures to deal with any suspected
                  personal data breach and will notify you and any applicable
                  regulator of a breach where we are legally required to do so.
                </p>
                <h3>Data retention</h3>
                <p>
                  <u>How long will you use my personal data for?</u>
                </p>
                <p>
                  We will only retain your personal data for as long as necessary
                  to fulfil the purposes we collected it for, including for the
                  purposes of satisfying any legal, accounting, or reporting
                  requirements.
                </p>
                <p>
                  To determine the appropriate retention period for personal data,
                  we consider the amount, nature, and sensitivity of the personal
                  data, the potential risk of harm from unauthorized use or
                  disclosure of your personal data, the purposes for which we
                  process your personal data and whether we can achieve those
                  purposes through other means, and the applicable legal
                  requirements.
                </p>
                <p>
                  In some circumstances you can ask us to delete your data:
                  see&nbsp;Request erasure&nbsp;below for further in some
                  circumstances we may anonymize your personal data (so that it
                  can no longer be associated with you) for research or
                  statistical purposes in which case we may use this information
                  indefinitely without further notice to you.
                </p>
                <h3>Your legal rights</h3>
                Under certain circumstances, you have rights under data protection
                laws in relation to your personal data. See the&nbsp;
                <em>Glossary</em>&nbsp;for more about these specific rights.
                <p></p>
                <ul>
                  <li> Request access to your personal data.</li>
                  <li> Request correction of your personal data.</li>
                  <li> Request erasure of your personal data.</li>
                  <li> Object to processing of your personal data.</li>
                  <li> Request restriction of processing your personal data.</li>
                  <li> Request transfer of your personal data.</li>
                  <li> Right to withdraw consent.</li>
                </ul>
                <p>
                  If you wish to exercise any of the rights set out above,
                  please&nbsp;
                  <Link to="/contact-us">contact us</Link>.
                </p>
                <p>
                  <u>No fee usually required</u>
                </p>
                <p>
                  You will not have to pay a fee to access your personal data (or
                  to exercise any of the other rights). However, we may charge a
                  reasonable fee if your request is clearly unfounded, repetitive
                  or excessive. Alternatively, we may refuse to comply with your
                  request in these circumstances.
                </p>
                <p>
                  <u>What we may need from you</u>
                </p>
                <p>
                  We may need to request specific information from you to help us
                  confirm your identity and ensure your right to access your
                  personal data (or to exercise any of your other rights). This is
                  a security measure to ensure that personal data is not disclosed
                  to any person who has no right to receive it. We may also
                  contact you to ask you for further information in relation to
                  your request to speed up our response.
                </p>
                <p>
                  <u>Time limit to respond</u>
                </p>
                <p>
                  We try to respond to all legitimate requests within one month.
                  Occasionally it may take us longer than a month if your request
                  is particularly complex or you have made a number of requests.
                  In this case, we will notify you and keep you updated.
                </p>
                <p>10. Glossary</p>
                <p>
                  LAWFUL BASIS
                  <br />
                  <strong>Legitimate Interest</strong>&nbsp;means the interest of
                  our business in conducting and managing our business to enable
                  us to give you the best service/product and the best and most
                  secure experience. We make sure we consider and balance any
                  potential impact on you (both positive and negative) and your
                  rights before we process your personal data for our legitimate
                  interests. We do not use your personal data for activities where
                  our interests are overridden by the impact on you (unless we
                  have your consent or are otherwise required or permitted to by
                  law). You can obtain further information about how we assess our
                  legitimate interests against any potential impact on you in
                  respect of specific activities by&nbsp;
                  <Link to="/contact-us">contacting us</Link>.
                </p>
                <p>
                  <strong>Performance of Contract</strong>&nbsp;means processing
                  your data where it is necessary for the performance of a
                  contract to which you are a party or to take steps at your
                  request before entering into such a contract.
                </p>
                <p>
                  <strong>Comply with a legal or regulatory obligation</strong>
                  &nbsp;means processing your personal data where it is necessary
                  for compliance with a legal or regulatory obligation that we are
                  subject to.
                </p>
                <p>THIRD PARTIES</p>
                <p>Internal Third Parties</p>
                <p>
                  Other companies in the Tourwiz Group acting as joint controllers
                  or processors and who provide IT and system administration
                  services and undertake leadership reporting.
                </p>
                <p>External Third Parties</p>
                <ul>
                  <li>
                    {" "}
                    Service providers acting as processors who provide IT and
                    system administration services.
                  </li>
                  <li>
                    {" "}
                    Professional advisers including lawyers, bankers, auditors and
                    insurers who provide consultancy, banking, legal, insurance
                    and accounting services.
                  </li>
                  <li>
                    {" "}
                    Tax regulators and other authorities who require reporting of
                    processing activities in certain circumstances.
                  </li>
                </ul>
                <p>YOUR LEGAL RIGHTS</p>
                <p>You have the right to:</p>
                <p>
                  <strong>Request access</strong>&nbsp;to your personal data
                  (commonly known as a "data subject access request"). This
                  enables you to receive a copy of the personal data we hold about
                  you and to check that we are lawfully processing it.
                </p>
                <p>
                  <strong>Request correction</strong>&nbsp;of the personal data
                  that we hold about you. This enables you to have any incomplete
                  or inaccurate data we hold about you corrected, though we may
                  need to verify the accuracy of the new data you provide to us.
                </p>
                <p>
                  <strong>Request erasure</strong>&nbsp;of your personal data.
                  This enables you to ask us to delete or remove personal data
                  where there is no good reason for us continuing to process it.
                  You also have the right to ask us to delete or remove your
                  personal data where you have successfully exercised your right
                  to object to processing (see below), where we may have processed
                  your information unlawfully or where we are required to erase
                  your personal data to comply with local law. Note, however, that
                  we may not always be able to comply with your request of erasure
                  for specific legal reasons which will be notified to you, if
                  applicable, at the time of your request.
                </p>
                <p>
                  <strong>Object to processing</strong>&nbsp;of your personal data
                  where we are relying on a legitimate interest (or those of a
                  third party) and there is something about your particular
                  situation which makes you want to object to processing on this
                  ground as you feel it impacts on your fundamental rights and
                  freedoms. You also have the right to object where we are
                  processing your personal data for direct marketing purposes. In
                  some cases, we may demonstrate that we have compelling
                  legitimate grounds to process your information which override
                  your rights and freedoms.
                </p>
                <p>
                  <strong>Request restriction of processing</strong>&nbsp;of your
                  personal data. This enables you to ask us to suspend the
                  processing of your personal data in the following scenarios: (a)
                  if you want us to establish the data's accuracy; (b) where our
                  use of the data is unlawful but you do not want us to erase it;
                  (c) where you need us to hold the data even if we no longer
                  require it as you need it to establish, exercise or defend legal
                  claims; or (d) you have objected to our use of your data but we
                  need to verify whether we have overriding legitimate grounds to
                  use it.
                </p>
                <p>
                  <strong>Request the transfer</strong>&nbsp;of your personal data
                  to you or to a third party. We will provide to you, or a third
                  party you have chosen, your personal data in a structured,
                  commonly used, machine-readable format. Note that this right
                  only applies to automated information which you initially
                  provided consent for us to use or where we used the information
                  to perform a contract with you.
                </p>
                <p>
                  <strong>Withdraw consent at any time</strong>&nbsp;where we are
                  relying on consent to process your personal data. However, this
                  will not affect the lawfulness of any processing carried out
                  before you withdraw your consent. If you withdraw your consent,
                  we may not be able to provide certain products or services to
                  you. We will advise you if this is the case at the time you
                  withdraw your consent.
                </p>
                <hr />
                <a name="ctn"></a>
                <h1 name="copyright">Copyright Take-Down Notice</h1>
                <p>
                  We respect the intellectual property rights of others and we
                  prohibit users from posting on the Site any content that
                  violates another party's intellectual property rights.
                  If&nbsp;your&nbsp;
                  <a
                    href="https://support.google.com/youtube/answer/2797466"
                    target="_blank"
                  >
                    copyright-protected&nbsp;work
                  </a>{" "}
                  was posted on Tourwiz's Site or Services without authorization,
                  you may submit a copyright infringement notification. Be sure to
                  consider whether&nbsp;
                  <a
                    href="https://www.youtube.com/about/copyright/fair-use/"
                    target="_blank"
                  >
                    fair use
                  </a>
                  , fair dealing, or a similar exception to copyright applies
                  before you submit.&nbsp;These requests should&nbsp;be
                  sent&nbsp;by the copyright owner or an agent authorized to act
                  on the owner's behalf.
                </p>
                <p>
                  Be advised that the name you enter as copyright owner will be
                  published on the Tourwiz Site in place of the turned off
                  content. If you can give us a valid legal alternative, such as a
                  company name&nbsp;or the name of an
                  authorized&nbsp;representative, we'll review and apply
                  it&nbsp;if appropriate. The name&nbsp;will become part of the
                  public record of your request, along with your
                  description&nbsp;of the work(s) allegedly infringed. All other
                  information, including your full legal name and email, are part
                  of the full takedown notice, which may be given to the uploader.
                </p>
                <p>
                  If you choose to submit a copyright takedown
                  request,&nbsp;remember that you're starting a legal process. The
                  below steps set out the process by which you can submit a
                  takedown request. The Digital Millennium Copyright Act of 1998
                  (the "DMCA") provides a complaint procedure for copyright owners
                  who believe that website material infringes their rights under
                  U.S. copyright law. If you believe that your work has been
                  improperly copied and posted on the website, please provide us
                  with the following information:
                </p>
                <blockquote>
                  <p>
                    (1) A physical or electronic signature of a person authorized
                    to act on behalf of the owner of an exclusive right that is
                    allegedly infringed.
                  </p>
                  <p>
                    (2) Identification of the copyrighted work claimed to have
                    been infringed, or, if multiple copyrighted works at a single
                    online site are covered by a single notification, a
                    representative list of such works at that site.
                  </p>
                  <p>
                    (3) Identification of the material that is claimed to be
                    infringing or to be the subject of infringing activity and
                    that is to be removed or access to which is to be disabled,
                    and information reasonably sufficient to permit the service
                    provider to locate the material.
                  </p>
                  <p>
                    (4) Information reasonably sufficient to permit the service
                    provider to contact the complaining party, such as an address,
                    telephone number, and, if available, an electronic mail
                    address at which the complaining party may be contacted.
                  </p>
                  <p>
                    (5) A statement that the complaining party has a good faith
                    belief that use of the material in the manner complained of is
                    not authorized by the copyright owner, its agent, or the law.
                  </p>
                  <p>
                    (6) A statement that the information in the notification is
                    accurate, and under penalty of perjury, that the complaining
                    party is authorized to act on behalf of the owner of an
                    exclusive right that is allegedly infringed.
                  </p>
                </blockquote>
                <p>
                  These requirements must be followed to give Tourwiz legally
                  sufficient notice of infringement. Send copyright infringement
                  complaints to:
                </p>
                <p>
                  Cltech Solutions Pvt. Ltd.
                  <br />
                  Email:{" "}
                  <a href="mailto:copyright@tourwizonline.com ">
                    copyright@tourwizonline.com{" "}
                  </a>
                </p>
                <p>
                  We suggest that you consult your legal advisor before filing a
                  DMCA notice with Tourwiz's copyright agent. There can be
                  penalties for false claims under the DMCA.
                </p>
                <h3>Cancellation Policy</h3>
                <p>
                  You may change your subscription type or cancel your
                  Tourwizonline Professional account at any time prior to the
                  billing date. Once canceled, your account will remain active
                  until the next billing cycle. At that point all of the
                  Tourwizonline Professional features - like custom branding and
                  reservation import - will be deactivated.
                </p>
                <p>
                  You may cancel any plans at any time during the period  and all charges once made are non-refundable. In case you decide to  cancel an yearly plan one month notice will be applicable for the same.
                </p>
                <p>
                  If you have questions or believe there has been an error on your
                  account please contact us.{" "}
                </p>
              </div>
            </div>
          </div>

          <PublicPageFindus />
          <PublicPageWherewe />
          <PublicPageClients />
          <PublicPageFooter />
          <PublicPageCopyrights />

        </StickyContainer>
      </div>
    );
  }
}

export default Terms;
