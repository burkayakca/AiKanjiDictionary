import React, { useState } from "react";
import Entry from './Entry'; // Ensure the correct path to Entry component
import getKanji from "./getKanji.jsx";

function createEntry(jsonfile, index) {
    return (
      <Entry
        key={index}
        kanji={jsonfile.kanji}
        meaning={jsonfile.meaning}
        kunyomi={jsonfile.kunyomi}
        onyomi={jsonfile.onyomi}
        examples={jsonfile.examples}
        strokeNumber={jsonfile.strokeNumber}
      />
    );
}

function App() {
    const [jsonfile, setJsonfile] = useState(null);
    const [inputKanji, setInputKanji] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New state for loader

    const handleFetchKanji = async () => {
        setIsLoading(true); // Show loader
        try {
            const data = await getKanji(inputKanji);
            console.log('Fetched data:', data); // Debug log
            if (data.isValid) {
                setJsonfile(data);
                setErrorMessage(""); // Clear any previous error
            } else {
                setJsonfile(null);
                setErrorMessage("Invalid Query. Please try again with a valid query.");
            }
        } catch (error) {
            console.error('Error fetching the Kanji data:', error);
            setErrorMessage("An error occurred while fetching the Kanji data. Please try again.");
        } finally {
            setIsLoading(false); // Hide loader
        }
    };

    return (
      <div>
        <div>
          <input
            className="form-control-md"
            type="text"
            value={inputKanji}
            onChange={(e) => setInputKanji(e.target.value)}
            placeholder="Enter Kanji"
          />
          <button
            className="btn btn-primary btn-sm text-nowrap"
            type="submit"
            onClick={handleFetchKanji}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "Submit"} {/* Show loading text */}
          </button>
        </div>
        
        <dl className="dictionary">
          {jsonfile ? createEntry(jsonfile, 0) : <p className="input-p">Waiting for query / No Data</p>}
        </dl>
      </div>
    );
}

export default App;