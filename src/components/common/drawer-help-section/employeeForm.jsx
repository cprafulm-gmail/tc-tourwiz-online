import React from 'react'
import PaymentHistoryImg from '../../../assets/images/help-images/004_Add_Employee.png';
import { Link } from 'react-router-dom';

function EmployeesForm() {
  return (
    <div className='row help-content-item'>
      <div className='col-lg-12'>
        <div className='row'>
          <div className='col-lg-12'>
            <div class="px-2 rounded-3" >
              <blockquote>
                <h4 id="add-your-employees">Add your employees</h4>
              </blockquote>
              <p>With TourWiz, you have the option to add employees to your account and work as a team. This can be particularly useful if you have multiple staff members who need to access and manage your TourWiz account.</p>
              <ol>
                <li><p>To add a new employee to your TourWiz account, follow these steps:</p>
                </li>
                <li><p>Log in to your TourWiz account.</p>
                </li>
                <li><p>Navigate to the <strong className='text-primary'>Employees</strong> section of your account.</p>
                </li>
                <li><p>Click on the <strong className='text-primary'>Add Employee</strong> button.</p>
                </li>
                <li><p>Enter the required information for the new employee, including their email address and phone number.</p>
                </li>
                <li><p>Set up different access rights for each employee: You can assign different levels of access to each employee based on their role in your organization. For example, you may want to grant full access to some employees, while restricting access to certain features for others.</p>
                </li>
              </ol>
              <p>Click on the <strong className='text-primary'>Save</strong> button to save the new employee's information and access rights.</p>
              <p>Once you have added an employee to your TourWiz account, they will receive an email invitation to join. They will need to accept the invitation and create a password to access the account.</p>
              <p>If you have any questions or concerns about adding employees to your account, please don't hesitate to contact our customer support team for assistance.</p>
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

export default EmployeesForm;