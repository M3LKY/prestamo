import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";

import Sidebar from "../../../sidebar/Sidebar";

const AddLoan = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    type: "",
    interes: "",
    monto: "",
    cuota: "",
    dia: "",
    date: "",
    pagado: 0,
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const { type, interes, monto, cuota, dia, date, pagado } = inputs;

  const navigate = useNavigate();
  const location = useLocation();

  const clientId = location.pathname.split("/")[2];

  const addSuccessful = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        pending: "Adding Loan...",
        success: "Added Succesfully!",
        error: "Error!",
      },
      {
        autoClose: 1000,
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Check for empty fields
    for (const key in inputs) {
      if (inputs[key] === '') {
        toast.error(`Please fill in the ${key} field.`);
        return;
      }
    }
  
    try {
      const body = {
        type,
        interes,
        monto,
        cuota,
        dia,
        date,
        pagado,
      };
  
      const response = await fetch(`http://localhost:8000/loans/${clientId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(body),
      });
  
      const parseRes = await response.json();
  
      addSuccessful();
  
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <div className="flex h-[900px]">
      <Sidebar />
      <ToastContainer />

      {/* Add Loan */}
      <div className="w-full h-[900px] mx-auto px-8 py-8 mb-4 border bg-white shadow-md rounded">
        {/* TITLE */}
        <div className="flex items-center justify-between px-4 py-5 sm:px-6 bg-purple-200 rounded shadow-md ">
          <div>
            <h3 className="text-lg font-medium leading-6 text-purple-800">
              Add Loan for Client #{clientId}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-purple-400">
              Fill all the required fields.
            </p>
          </div>

          {/* BUTTON */}

          <div className="text-purple-400">
            <button
              className=""
              onClick={(e) => {
                setAuth(false);
              }}
            >
              <Link to="/login">
                <Logout />
              </Link>
            </button>
          </div>
        </div>

        {/* FORM */}
        <form
          className="grid grid-cols-2 mt-5 p-8 h-[650px] rounded border shadow-md border-t-4 border-t-purple-500 "
          onSubmit={onSubmit}
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          {/* BUTTONS */}
          <div>
            <button
              className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-auto ml-auto "
              type="submit"
            >
              Add New Loan
            </button>
            <button className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/5 ml-10">
              <Link to={`/borrower/${clientId}`}>Cancel</Link>
            </button>
          </div>

          {/*  */}
        </form>
      </div>
    </div>
  );
};

export default AddLoan;
