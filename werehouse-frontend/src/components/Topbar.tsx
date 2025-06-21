import React from "react";
import axios from "axios";
import "../App.css";

const API_URL = "http://localhost:5000/api/orders";

const Topbar: React.FC<{ onSeed?: () => void }> = ({ onSeed }) => {
  const seedOrders = async () => {
    try {
      await axios.post(`${API_URL}/seed`);
      if (onSeed) onSeed(); 
      setTimeout(async () => {
        await axios.post(`${API_URL}/sync`); 
        if (onSeed) onSeed(); 
      }, 5000);
    } catch (err) {
      
    }
  };

  return (
    <div className="topbar flex justify-between items-center px-4 py-6 bg-gray-800 text-white w-full">
      <div className="topbar-title text-2xl">Werehouse</div>
      <button
        onClick={seedOrders}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Seed Orders
      </button>
    </div>
  );
};

export default Topbar;
