import React from 'react';
import '../style.css'; 

function Entry({ kanji, meaning, kunyomi, onyomi, examples, strokeNumber }) {
    return (
        <div className="container-md kanji-container noto-sans-jp">
                    <div className='kanji-info col'>
                        <h1 className="kanji-box ">{kanji}</h1>
                            <p className='kanji-p'><strong><span className='emoji'>📝</span> Meaning:</strong> {meaning}</p> 
                            <p className='kanji-p '><strong><span className='emoji'>🔤</span> Onyomi:</strong> {onyomi ? onyomi.join(', ') : 'N/A'}</p> 
                            <p className='kanji-p '><strong><span className='emoji'>🗣️</span> Kunyomi:</strong> {kunyomi ? kunyomi.join(', ') : 'N/A'}</p> 
                            <p className='kanji-p'><strong><span className='emoji'>✍️</span> Stroke Count:</strong> {strokeNumber}</p>
                    </div> 

                    <div className="kanji-examples">
                        <h4><span className='emoji'>📚</span>Example Words:</h4>
                            <table className="table table-dark">
                            <tr>    
                                <th scope="col" >Word</th>    
                                <th scope="col">Reading</th>    
                                <th scope="col">Meaning</th>    
                            </tr>    
                            {examples.map((example, index) => (    
                            <tr key={index}>    
                                <td>{example.word}</td>
                                <td>{example.reading}</td>    
                                <td>{example.meaning}</td>        
                            </tr>
                            ))}
                        </table>
                    </div>
        </div>    
    );
}

export default Entry;
