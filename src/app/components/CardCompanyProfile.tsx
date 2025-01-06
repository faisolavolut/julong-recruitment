import React from "react";

const CardCompanyProfile = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-bold mb-4">Profil perusahaan</h2>
      <div className="flex items-start">
        <img
          src="https://via.placeholder.com/80"
          alt="Company Logo"
          className="h-16 w-16 mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold mb-1 flex items-center">
            Indojaya Perkasa Abadi
            <svg
              className="w-5 h-5 ml-2 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </h3>
          <ul className="space-y-1 text-gray-600 text-sm mb-4">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2a4 4 0 10-8 0v2m8-6a4 4 0 100-8 4 4 0 000 8zm13 5v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                />
              </svg>
              Wholesale Businesses
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m6 18v-7m6-2V5m-6 4h6"
                />
              </svg>
              11-50 employees
            </li>
          </ul>
          <p className="text-gray-700 text-sm mb-4">
            PT. INDOJAYA PERKASA ABADI adalah perusahaan yang bergerak di bidang
            penjualan peralatan bakery dan mesin pemroses makanan. Kami memiliki
            visi menjadi perusahaan distributor peralatan bakery terbaik di
            seluruh Indonesia.
          </p>
          <button className="flex items-center text-blue-500 hover:underline font-medium">
            Selengkapnya tentang perusahaan ini
            <svg
              className="w-5 h-5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCompanyProfile;
