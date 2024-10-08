import React from 'react'
import PaymentHistoryImg from '../../../assets/images/help-images/018_Payment_History.png';
import { Link } from 'react-router-dom';

function PaymentHistory() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="log-in-to-tourwiz-application">Payment History</h4>
              </blockquote>
              <p>In this section, you will find a record of all your purchases made on our platform. This information includes details such as the date of purchase, the name of the product or service purchased, and the price paid.</p>
              <p>You can use this section to keep track of your past purchases and to review any charges that may have been made to your account.</p>
              <p>In addition to viewing your purchase history, you can also download paid invoices from this section. Simply locate the purchase you would like to download a receipt for, and click on the <strong className='text-primary'>Download Receipt</strong> icon. This will generate a PDF document that you can save or print for your records.</p>
              <p>If you have any questions or concerns regarding your purchase history or invoices, please feel free to contact our customer support team for assistance.</p>
              <img
                src={PaymentHistoryImg}
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

export default PaymentHistory;