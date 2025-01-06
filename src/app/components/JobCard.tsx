export const JobCard: React.FC = () => {
  return (
    <div className="border rounded-lg shadow-md p-4 w-72 bg-white">
      {/* Logo dan Tombol */}
      <div className="flex justify-between items-center">
        <div className="text-black font-bold text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23.49"
            height="20"
            viewBox="0 0 256 218"
          >
            <path
              fill="#0061ff"
              d="M63.995 0L0 40.771l63.995 40.772L128 40.771zM192 0l-64 40.775l64 40.775l64.001-40.775zM0 122.321l63.995 40.772L128 122.321L63.995 81.55zM192 81.55l-64 40.775l64 40.774l64-40.774zM64 176.771l64.005 40.772L192 176.771L128.005 136z"
            />
          </svg>
        </div>
        <button className="text-blue-600 border border-blue-600 rounded px-3 py-1 text-sm hover:bg-blue-600 hover:text-white transition">
          Apply Now
        </button>
      </div>

      {/* Judul dan Lokasi */}
      <h2 className="mt-3 font-bold text-lg">Email Marketing</h2>
      <p className="text-gray-600 text-sm">Revolut &bull; Madrid, Spain</p>

      {/* Deskripsi */}
      <p className="mt-2 text-gray-500 text-sm">
        Revolut is looking for Email Marketing to help team ma ...
      </p>

      {/* Tags */}
      <div className="flex gap-2 mt-4">
        <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-3 py-1 rounded-full">
          Marketing
        </span>
        <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
          Design
        </span>
      </div>
    </div>
  );
};

export default JobCard;
