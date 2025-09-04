import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const Topbar = ({ setsearchaddress, onFilter, setMinMag, setMaxMag, minMag, maxMag, mode, setmode }) => {
  const [countrydata, setcountrydata] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();
  const handleclick = () => {
    setmode(!mode);
  }

  const onSubmit = (data) => {
    const search = data.country.trim().toLowerCase();
    const found = countrydata.find(
      (c) => c.name.common.toLowerCase() === search
    );
    if (found) {
      setsearchaddress([found.latlng[0], found.latlng[1]]);
    } else {
      alert("Country not found");
    }
    reset();
    setSuggestions([]);
  };

  useEffect(() => {
    const getcountrydata = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,latlng"
        );
        if (res.ok) {
          const data = await res.json();
          setcountrydata(data);
        } else {
          console.log("API not working");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getcountrydata();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setSuggestions([]);
      return;
    }
    const filtered = countrydata
      .filter((c) => c.name.common.toLowerCase().includes(value))
      .slice(0, 8);
    setSuggestions(filtered);
  };
  const handleSuggestionClick = (country) => {
    setValue("country", country.name.common);
    setSuggestions([]);
  };
  useEffect(() => {
    const min = parseFloat(minMag) || 0;
    const max = parseFloat(maxMag) || 10;
    if (onFilter) {
      onFilter({ min, max });
    }
  }, [minMag, maxMag, onFilter]);

  return (
    <div
      className={`w-full p-4 ${mode ? "bg-white" : "bg-[#2A2D2E]"
        } transition-colors relative flex flex-col md:flex-row items-start md:items-center gap-4 pl-4 md:pl-10 pt-6 z-[9999]`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
        <div className="relative w-full md:max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-300"
          >
            <input
              {...register("country")}
              placeholder="Search country..."
              className="flex-grow px-4 py-2 text-gray-700 focus:outline-none text-sm md:text-base"
              onChange={handleChange}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-3 md:px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Search
            </button>
          </form>
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-56 overflow-y-auto z-[9999] text-sm md:text-base">
              {suggestions.map((country, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-800"
                  onClick={() => handleSuggestionClick(country)}
                >
                  {country.name.common}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-300 px-3 py-2 w-full md:w-auto">
          <span className="text-gray-600 mr-2 text-sm md:text-base">Magnitude:</span>
          <input
            type="number"
            step="0.1"
            value={minMag}
            onChange={(e) => setMinMag(e.target.value)}
            placeholder="From"
            className="w-16 md:w-20 px-2 py-1 border rounded mr-2 text-sm md:text-base"
          />
          <input
            type="number"
            step="0.1"
            value={maxMag}
            onChange={(e) => setMaxMag(e.target.value)}
            placeholder="To"
            className="w-16 md:w-20 px-2 py-1 border rounded text-sm md:text-base"
          />
        </div>
      </div>

      <div
        className={`ml-auto md:mr-10 cursor-pointer flex items-center justify-center w-10 h-10 shadow-md ${mode ? "bg-white text-black" : "bg-white text-white"
          }`}
        onClick={handleclick}
      >
        {mode ? (
          <img src="./sun.png" alt="Light Mode" className="h-6 w-6 md:h-8 md:w-8" />
        ) : (
          <img src="./moon.png" alt="Dark Mode" className="h-6 w-6 md:h-8 md:w-8" />
        )}
      </div>
    </div>
  );
};

export default Topbar;
