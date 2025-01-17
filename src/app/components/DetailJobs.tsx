import { siteurl } from "@/lib/utils/siteurl";
import { Avatar } from "flowbite-react";
import React from "react";

const DetailJobs = () => {
  return (
    <div className="flex flex-grow flex-col">
            <div className="flex items-center mb-4">
              
                        <Avatar alt="" img={siteurl("/dog.jpg")} rounded size="md" className="mr-2" />
              <div>
                <h2 className="text-xl font-bold">
                  PT Indojaya Perkasa Abadi (Medan)
                </h2>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Lihat semua lowongan kerja
                </a>
              </div>
            </div>
            <h1 className="text-2xl font-semibold mb-4">
              Staff Pembukuan dan Perpajakan
            </h1>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-gray-700">
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
                    d="M17.657 16.657a8 8 0 10-11.314 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Surabaya, Jawa Timur
              </li>
              <li className="flex items-center text-gray-700">
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
                    d="M8 12v2m4-6v6m-4 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H8m-4 0a2 2 0 012-2h12M4 10h12"
                  />
                </svg>
                Perpajakan (Akuntansi)
              </li>
              <li className="flex items-center text-gray-700">
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
                    d="M15.232 5.232l4.536 4.536m-4.536-4.536v4.536H6a2 2 0 01-2-2V6a2 2 0 012-2h9.232zm-7 7v6a2 2 0 002 2h3.232a2 2 0 002-2v-6H8.232z"
                  />
                </svg>
                Full time
              </li>
              <li className="flex items-center text-gray-700">
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
                    d="M12 8c2.21 0 4-1.79 4-4 0-2.21-1.79-4-4-4-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4z"
                  />
                </svg>
                Rp 4.500.000 – Rp 5.500.000 per month
              </li>
            </ul>
            <p className="text-gray-500 mb-6">Posted 3 hari yang lalu</p>

            {/* Buttons */}
            <div className="flex space-x-4 mb-6">
              <button className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
                Lamaran Cepat
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Simpan
              </button>
            </div>

            {/* Job Description */}
            <div className="text-gray-700">
              <p className="mb-4">
                Perhatian Accounting & Tax Executive yang mempunyai pengalaman
                minimum 3 tahun di bidang Accounting & Tax.
              </p>
              <p className="mb-4">
                Kami{" "}
                <span className="font-bold">PT. INDOJAYA PERKASA ABADI</span>{" "}
                yang memiliki visi dan misi menjadi perusahaan retail peralatan
                baking dan mixing terbaik di Indonesia mencari kandidat luar
                biasa untuk bergabung dan membangun perusahaan ini.
              </p>
              <p className="font-semibold mb-2">
                Jadilah Staff Pembukuan dan Perpajakan kami jika Anda:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Memiliki gelar sarjana di Akuntansi/Perbankan atau setara
                </li>
                <li>
                  Menguasai bidang pembukuan:
                  <ul className="list-disc list-inside ml-6">
                    <li>Laporan keuangan (neraca laba rugi dan arus kas)</li>
                  </ul>
                </li>
                <li>Menguasai bidang perpajakan</li>
              </ul>
            </div>
          </div>
  );
};

export default DetailJobs;
