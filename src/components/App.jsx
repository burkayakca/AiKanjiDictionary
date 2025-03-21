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
                setErrorMessage("Geçersiz Sorgu. Lütfen Tekrar Deneyin.");
            }
        } catch (error) {
            console.error('Error fetching the Kanji data:', error);
            setErrorMessage("Kanci verisi yüklenirken bir hata meydana geldi.");
        } finally {
            setIsLoading(false); // Hide loader
        }
    };

    return (
      <div>
        <div>
          <div className="center-container">
            <h2 className="center">YZ Kanci Sözlüğü</h2> {/* Always centered */}
            <input
              className="form-control-md"
              type="text"
              value={inputKanji}
              onChange={(e) => setInputKanji(e.target.value)}
              placeholder="Kanci Giriniz"
            />
            <button
              className="btn btn-primary btn-sm text-nowrap"
              type="submit"
              onClick={handleFetchKanji}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Yükleniyor" : "Gönder"} {/* Show loading text */}
            </button>
          </div>
        </div>

        <dl className="dictionary">
          {jsonfile ? createEntry(jsonfile, 0) : <p className="input-p">Sorgu bekleniyor / Veri bulunamadı.</p>}
        </dl>
      </div>
    );
}

export default App;