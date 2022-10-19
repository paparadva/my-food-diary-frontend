import { useEffect, useState } from 'react';
import { throttle } from './utils';


const SEARCH_PRODUCTS_URL = "http://localhost:8080/api/product/search?query=";


const getProductSuggestions = throttle((query, setResultFunc) => {
  fetch(SEARCH_PRODUCTS_URL + encodeURIComponent(query))
    .then(response => response.json())
    .then(names => setResultFunc(names));
}, 300);


function SearchPanel(props) {
  const [suggestions, setSuggestions] = useState([]);

  const handleAddProductClick = props.onAddProductClick;

  const handleSearchInput = event => {
    let query = event.target.value;
    if (!query.trim()) { setSuggestions([]); return; }

    getProductSuggestions(query, (names) => setSuggestions(names));
  };

  return (
  <div className="search-container">
    <input type="search" id="search-input" onChange={handleSearchInput}/>
    
    <div className="search-results">

    {suggestions.map(productName => 
      <div className="table-row" key={productName}>
        <div className="table-cell product-name">{productName}</div>
        <div className="table-cell">
          <button onClick={() => handleAddProductClick(productName)} className="row-action-button add-button">+</button>
        </div>
      </div>
    )}

    </div>
  </div>
  );
}


export default SearchPanel;