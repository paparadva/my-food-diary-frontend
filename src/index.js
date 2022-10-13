
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const SEARCH_PRODUCTS_URL = "http://localhost:8080/api/product/search?query=";
const GET_PRODUCT_URL = "http://localhost:8080/api/product?name=";

const portionSizeGrams = 100.0;


class ProductData {
  constructor(name, amount, kcal, protein, fat, carb) {
    this.name = name;
    this.amount = amount ?? 0;
    this.kcal = kcal ?? 0;
    this.protein = protein ?? 0;
    this.fat = fat ?? 0;
    this.carb = carb ?? 0;
  }

  calcKcal() {
    return this.kcal * (this.amount / portionSizeGrams);
  }

  calcProtein() {
    return this.protein * (this.amount / portionSizeGrams);
  }

  calcFat() {
    return this.fat * (this.amount / portionSizeGrams);
  }

  calcCarb() {
    return this.carb * (this.amount / portionSizeGrams);
  }
}

class SummaryData {
  constructor(kcal, protein, fat, carb) {
    this.kcal = kcal ?? 0;
    this.protein = protein ?? 0;
    this.fat = fat ?? 0;
    this.carb = carb ?? 0;
  }
}


function SearchPanel(props) {
  const [suggestions, setSuggestions] = useState([]);

  const handleAddProductClick = props.onAddProductClick;

  const handleSearchInput = event => {
    let query = event.target.value;
    if (!query.trim()) { setSuggestions([]); return; }
    

    fetch(SEARCH_PRODUCTS_URL + encodeURIComponent(query))
      .then(response => {
        return response.json();
      })
      .then(names => {
        setSuggestions(names);
      });
  };

  return (
  <div className="search-container">
    <input type="search" id="search-input" onChange={handleSearchInput}/>
    <div className="search-results">
    {suggestions.map(productName => 
      <div className="search-result-row" key={productName}>
        <p className="result-product-name">{productName}</p>
        <button className="add-product-button" onClick={() => handleAddProductClick(productName)}>+</button>
      </div>
    )}
    </div>
  </div>
  );
}


function TablePanel(props) {
  const productRows = props.productRows;
  const handleRemoveRow = props.onRemoveRow;
  const handleAmountChange = props.onAmountChange;
  const summary = props.summary;

  return (
  <div className="table-container">
    <div className="product-table">
      <div></div>
      <div className="table-cell total-label">Сумма</div>
      <div className="table-cell total-kcal">{Math.round(summary.kcal)}</div>
      <div className="table-cell total-protein">{summary.protein.toFixed(1)}</div>
      <div className="table-cell total-fat">{summary.fat.toFixed(1)}</div>
      <div className="table-cell total-carb">{summary.carb.toFixed(1)}</div>
      <div></div>

      <div className="table-cell header-name">Продукт</div>
      <div className="table-cell header-mass">Масса, г</div>
      <div className="table-cell header-kcal">ккал</div>
      <div className="table-cell header-protein">б</div>
      <div className="table-cell header-fat">ж</div>
      <div className="table-cell header-carb">у</div>
      <div></div>

      {productRows.map((product, index) => <TableRow 
        key={index} 
        product={product} 
        onAmountChange={handleAmountChange} 
        onRemoveClick={handleRemoveRow} 
        rowIndex={index} />
      )}
      
    </div>
  </div>
  );
}


function TableRow(props) {
  const product = props.product;
  const onAmountChange = props.onAmountChange;
  const onRemoveClick = props.onRemoveClick;
  const rowIndex = props.rowIndex;

  return (<>
    <div className="table-cell product-name">{product.name}</div>
    <div className="table-cell product-mass">
      <input type="number" defaultValue={product.amount} onChange={(e) => onAmountChange(rowIndex, e.target.value)} onFocus={(e) => e.target.select()} min="0" className="mass-input"/>
    </div>
    <div className="table-cell product-kcal">{Math.round(product.calcKcal())}</div>
    <div className="table-cell product-protein">{product.calcProtein().toFixed(1)}</div>
    <div className="table-cell product-fat">{product.calcFat().toFixed(1)}</div>
    <div className="table-cell product-carb">{product.calcCarb().toFixed(1)}</div>
    <div className="table-cell product-remove">
      <button className="remove-product-button" onClick={() => onRemoveClick(rowIndex)}>X</button>
    </div>
  </>);
}


function MyFoodDiary() {
  const [productRows, setProductRows] = useState([]);
  const [summary, setSummary] = useState(new SummaryData());

  useEffect(() => {
    let summary = new SummaryData();

    productRows.forEach(product => {
      summary.kcal += product.calcKcal();
      summary.protein += product.calcProtein();
      summary.fat += product.calcFat();
      summary.carb += product.calcCarb();
    });

    setSummary(summary);
  }, [productRows]);

  const changeProductAtIndex = (product, rowIndex) => {
    const rows = productRows.slice();
    rows[rowIndex] = product;
    setProductRows(rows);
  };

  const addSuggestedProduct = productName => {
    const rowIndex = productRows.length;
    const rows = productRows.slice();
    rows.push(new ProductData(productName));
    setProductRows(rows);

    fetch(GET_PRODUCT_URL + encodeURIComponent(productName))
      .then(response => {return response.json()})
      .then(product => {
        const row = new ProductData(product.name, 0, product.kcal, product.protein, product.fat, product.carb);
        changeProductAtIndex(row, rowIndex);
      });
  };

  const removeProductRow = rowIndex => {
    const rows = productRows.slice();
    rows.splice(rowIndex, 1);
    setProductRows(rows);
  };

  const updateProductAmount = (rowIndex, newAmount) => {
    let product = productRows[rowIndex];
    product = new ProductData(product.name, newAmount, product.kcal, product.protein, product.fat, product.carb);
    changeProductAtIndex(product, rowIndex);
  };

  return <>
    <SearchPanel onAddProductClick={addSuggestedProduct}/>
    <TablePanel productRows={productRows} summary={summary} onRemoveRow={removeProductRow} onAmountChange={updateProductAmount}/>
  </>
}


// ========================================


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyFoodDiary />);