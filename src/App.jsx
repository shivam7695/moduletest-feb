import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [pincode, setPincode] = useState('');
  const [pincodeData, setPincodeData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPincodeData = async () => {
    if (pincode.length !== 6) {
      setError('Postal code must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data && data.length > 0 && data[0].Status === 'Success') {
        setPincodeData(data[0].PostOffice);
        setFilteredData(data[0].PostOffice);
      } else {
        setError('No data found for this postal code');
      }
    } catch (error) {
      setError('Failed to fetch data');
    }

    setLoading(false);
  };

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value.toLowerCase();
    if (!filterValue) {
      setFilteredData(pincodeData);
      return;
    }
    const filtered = pincodeData.filter((item) => item.Name.toLowerCase().includes(filterValue));
    setFilteredData(filtered);
  };

  return (
    <div className="app">
      <h1>Pincode Lookup</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={handlePincodeChange}
          maxLength="6"
        />
        <button onClick={fetchPincodeData}>Lookup</button>
      </div>
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {filteredData && (
        <>
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            onChange={handleFilter}
          />
          {filteredData.length === 0 && (
            <div className="error">Couldn’t find the postal data you’re looking for…</div>
          )}
          <div className="data-container">
            {filteredData.map((item, index) => (
              <div key={index} className="data-item">
                <div><strong>Post Office Name:</strong> {item.Name}</div>
                <div><strong>Branch Type:</strong> {item.BranchType}</div>
                <div><strong>District:</strong> {item.District}</div>
                <div><strong>State:</strong> {item.State}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
