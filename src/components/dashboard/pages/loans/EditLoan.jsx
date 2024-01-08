import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';

import Sidebar from '../../../sidebar/Sidebar';
import OneLoan from './OneLoan';

const EditLoan = ({ setAuth }) => {
  const location = useLocation();

  const loanId = location.pathname.split('/')[2];

  const [clientId, setClientId] = useState('');
  const GetLoan = async () => {
    try {
      const response = await fetch(`http://localhost:8000/loan/${loanId}`, {
        method: 'GET',
        headers: { Authorization: localStorage.getItem('token') },
      });

      const parseRes = await response.json();

      const formatDate = (d) => {
        const x = new Date(d);
        x.setHours(x.getHours() + 8);
        let month = x.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        let day = x.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        return x.getFullYear() + '-' + month + '-' + day;
      };

      const start_date = formatDate(parseRes.rdate);
      

      setInputs({
        type: parseRes.type,
    dia: parseRes.dia ,
    cuota: parseRes.cuota,
    interes: parseRes.interes,
    monto: parseRes.monto,
    date: start_date,
      });

      setClientId(parseRes.client_id);
      console.log(clientId);
      console.log('Date Released:', parseRes.date_released);
    } catch (error) {
      console.log(error.message);
    }
  };
  const [inputs, setInputs] = useState({
    type: '',
    dia: '',
    cuota: '',
    interes: '',
    monto: '',
    date: '',
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const {
    type,
    dia,
    cuota,
    interes,
    monto,
    date,
  } = inputs;

  const editSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: 'Updating Loan...',
        success: 'Updated Succesfully!',
        error: 'Error!',
      },
      {
        autoClose: 1000,
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        type,
    dia,
    cuota,
    interes,
    monto,
    date,
      };

      const response = await fetch(`http://localhost:8000/loans/${loanId}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      editSuccessful();

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    GetLoan();
  }, []);

  return (
    <div className='flex h-[900px]'>
      <Sidebar />
      <ToastContainer />

      <div className='w-full  h-[900px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded'>
        {/* HEADER */}
        <div className='flex items-center justify-between px-4 py-5 sm:px-6 bg-purple-200 rounded shadow-md '>
          {/* TITLE */}
          <div>
            <h3 className='text-lg font-medium leading-6 text-purple-800'>
              Update Loan Voucher # {loanId}
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-purple-400'>
              Edit and update your loan
            </p>
          </div>

          <div className='text-purple-400'>
            <button
              className=''
              onClick={(e) => {
                setAuth(false);
              }}
            >
              <Link to='/login'>
                <Logout />
              </Link>
            </button>
          </div>
        </div>

        {/* LOAN INFO */}
        <OneLoan />

        {/* EDIT FORM */}
        <div className=''>
          <h3 className='text-lg font-medium leading-6 text-gray my-2 px-1 py-4 border-y-2 '>
            Edit Form
          </h3>
          
             <form
          className="grid grid-cols-2 mt-5 p-8 h-[550px] rounded border shadow-md border-t-4 border-t-purple-500 "
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          {/* TYPE */}
          <div>
            <label htmlFor="type">Tipo de Interes:</label>
            <select
              className="block border border-grey-500 w-10/12 p-3 rounded"
              name="type"
              id="type"
              value={type}
              onChange={(e) => {
                onChange(e);
              }}
            >
              <option value="Interes Fijo">Interes Fijo</option>
              <option value="Saldo Insoluto Variable">Saldo Insoluto Variable</option>
              <option value="Tabla Prestamo">Tabla Prestamo</option>
            </select>
          </div>

         

          {/* GROSS LOAN */}
          <div>
            <label htmlFor="gross_loan">Dia:</label>
            <input
              type="number"
              className="block border border-grey-500 w-10/12 p-3 rounded"
              placeholder="cada cuando"
              name="dia"
              value={dia}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div>
            <label htmlFor="gross_loan">Cuota:</label>
            <input
              type="number"
              className="block border border-grey-500 w-10/12 p-3 rounded"
              placeholder="cuota"
              name="cuota"
              value={cuota}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* BALANCE */}
          <div>
            <label htmlFor="gross_loan">Interes %:</label>
            <input
              type="number"
              className="block border border-grey-500 w-10/12 p-3 rounded"
              placeholder="interes %"
              name="interes"
              value={interes}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* AMORTIZATION */}
          <div>
            <label htmlFor="amort">Monto:</label>
            <input
              type="number"
              className="block border border-grey-500 w-10/12 p-3 rounded "
              placeholder="monto"
              name="monto"
              value={monto}
              onChange={(e) => onChange(e)}
            />
          </div>

          

          {/*DATE */}
          <div>
            <label htmlFor="maturity_date">Fecha Emision:</label>
            <input
              type='date'
              className="block border border-grey-500 w-10/12 p-3 rounded "
              placeholder="Date"
              name="date"
              value={date}
              onChange={(e) => onChange(e)}
            />
          </div>


            {/* BUTTONS */}
            <div>
              <button
                type='submit'
                className=' text-center py-3 rounded bg-purple-500 text-white hover:bg-red-700 focus:outline-none my-1 w-1/5'
              >
                Update
              </button>
              <Link
                className=' ml-5 text-center py-3 rounded bg-purple-500 text-white hover:bg-red-700 focus:outline-none my-1 w-1/5 inline-block'
                to={`/borrower/${clientId}`}
              >
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLoan;
