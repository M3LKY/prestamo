import React from 'react';
import { Link } from 'react-router-dom';

import {
  PermIdentity,
  CreditScore,
  ReceiptLong,
  MailOutline,
  Home,
} from '@mui/icons-material';

export default function Sidebar() {
  return (
    <div className='bg-purple-500 md:block px-5 py-5 md:w-60 lg:w-60  transition-transform duration-300 ease-in-out border shadow-2xl rounded-md '>
      {/* LOGO */}
      <div className='my-10'>
        <h3 className='text-center text-white text-2xl  font-extrabold tracking-tight'>PRESTA</h3>
      </div>

      <hr className='h-px bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent' />
      {/* MENU */}
      <div className='my-14'>
        <ul>
          <li className='text-md font-medium text-gray-100 py-3 px-5 hover:bg-white hover:text-black hover:text-base rounded-md transition duration-150 ease-in-out cursor-pointer'>
            <Home />
            <Link to='/home' className='ml-2.5'>
              Home
            </Link>
          </li>

          <li className='text-md font-medium text-gray-100 py-3 px-5 hover:bg-white hover:text-black hover:text-base rounded-md transition duration-150 ease-in-out'>
            <PermIdentity />
            <Link to='/borrowers' className='ml-2.5'>
              Clientes
            </Link>
          </li>

          <li className='text-md font-medium text-gray-100 py-3 px-5 hover:bg-white hover:text-black hover:text-base rounded-md transition duration-150 ease-in-out'>
            <CreditScore />
            <Link to='/loans' className='ml-2.5'>
              Prestamos
            </Link>
          </li>

          <li className='text-md font-medium text-gray-100 py-3 px-5 hover:bg-white hover:text-black hover:text-base rounded-md transition duration-150 ease-in-out'>
            <ReceiptLong />
            <Link to='/payments' className='ml-2.5'>
              Pagos
            </Link>
          </li>

          <li className='text-md font-medium text-gray-100 py-3 px-5 hover:bg-white hover:text-black hover:text-base rounded-md transition duration-150 ease-in-out'>
            <MailOutline />
            <Link to='/emailClient' className='ml-2.5'>
              Email
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
