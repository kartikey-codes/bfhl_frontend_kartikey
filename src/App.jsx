import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [jsonInput, setJsonInput] = useState('{"data": ["A","1","b"]}');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [filteredResult, setFilteredResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const submitData = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      setError('');

      fetch('https://bfhlcampus-kartikey.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 502) {
              throw new Error('502 Bad Gateway: The server is down or not configured correctly.');
            } else if (response.status === 403) {
              throw new Error('403 Forbidden: Possible CORS error.');
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          }
          return response.json();
        })
        .then((data) => {
          setResult(data);
          setShowDropdown(true);
          setFilteredResult(null);
        })
        .catch((error) => {
          console.error('Error:', error);
          setError('Failed to fetch data. ' + error.message);
          setResult(null);
          setShowDropdown(false);
        });
    } catch (error) {
      setError('Invalid JSON input');
      setResult(null);
      setShowDropdown(false);
    }
  };

  const filterResults = () => {
    if (!result) return;

    const filteredData = selectedOptions.reduce((acc, option) => {
      if (result[option]) {
        acc[option] = result[option];
      }
      return acc;
    }, {});

    setFilteredResult(filteredData);
  };

  return (
    <>
      <h1>BFHL Challenge</h1>
      <div>
        <textarea
          id="jsonInput"
          rows="4"
          cols="50"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data": ["A","1","b"]}'
        ></textarea>
        <br />
        <button onClick={submitData}>Submit</button>
        <div className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</div>
      </div>
      {result && (
        <div id="result" style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: 'black', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(result, null, 2)}
        </div>
      )}
      {showDropdown && (
        <div id="dropdown" style={{ marginTop: '20px' }}>
          <label>Select Options:</label>
          <select
            id="selectOptions"
            multiple
            value={selectedOptions}
            onChange={(e) =>
              setSelectedOptions(Array.from(e.target.selectedOptions, (option) => option.value))
            }
          >
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
          </select>
          <button onClick={filterResults}>Filter</button>
        </div>
      )}
      {filteredResult && (
        <div id="filteredResult" style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: 'black', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(filteredResult, null, 2)}
        </div>
      )}
    </>
  );
}

export default App;
