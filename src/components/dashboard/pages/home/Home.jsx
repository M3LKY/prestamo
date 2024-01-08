import React, { useState } from 'react';
import { useEffect } from 'react';

import Sidebar from '../../../sidebar/Sidebar';
import BotWidget from './bottom/BotWidget';
import TopWidget from './top/TopWidget';
import { Link } from 'react-router-dom';
import { Logout, PermIdentity } from '@mui/icons-material';

export default function Home({ setAuth }) {
  const [name, setName] = useState();
  const [level, setlevel] = useState();
  const getProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile', {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();

      setName(parseRes.firstname + ' ' + parseRes.lastname);
      setlevel(parseRes.level)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className='flex h-[900px] shadow-2xl'>
      <Sidebar />
      <div className='w-full px-8 py-8 pb-8 mb-4 bg-white border rounded shadow-2xl h-[900px] '>
        {/* HOME ITEMS */}
        <div className='px-4 py-5 sm:px-6 rounded shadow-md bg-purple-200 flex justify-between items-center'>
          <div>
            <h3 className='text-lg font-bold leading-6 text-shadow-md text-purple-800'>
              {name}
            </h3>
            <span className='text-md font-medium leading-6 text-purple-400'>
              Logged in: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <div>
            {/* LOGOUT BUTTON */}
            <div className='text-purple-400 float-right '>
              {/* ADMIN PAGE */}
              {level !== 0 && (
  <button className='hover:-translate-y-0.5'>
    <Link to='/admin'>
      <PermIdentity />
    </Link>
  </button>
)}


              {/* LOGOUT */}
              <button
                className='ml-2 hover:-translate-y-0.5'
                onClick={(e) => {
                  setAuth(false);
                }}
              >
                <Link to='/login'>
                  <Logout />
                </Link>
              </button>
            </div>
            <span className='mr-10 text-lg font-medium leading-6 text-purple-400'>
              {new Date().toLocaleString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }) + ''}
            </span>
          </div>
        </div>

        <TopWidget />
        <BotWidget />
      </div>
    </div>
  );
}
