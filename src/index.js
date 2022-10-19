
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { debounce, throttle } from './utils';
import { postProductRowsToBackend } from './backendApi';
import TablePanel from './TablePanel';
import SearchPanel from './SearchPanel';


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

ProductData.nextId = 1;


class SummaryData {
  constructor(kcal, protein, fat, carb) {
    this.kcal = kcal ?? 0;
    this.protein = protein ?? 0;
    this.fat = fat ?? 0;
    this.carb = carb ?? 0;
  }
}


const saveProductRowsToBackend = debounce(postProductRowsToBackend, 300);


const saveProductRowsToLocalStorage = debounce(productRows => {
  localStorage.setItem("productRows", JSON.stringify(productRows));
}, 300);


function readProductRowsFromLocalStorage() {
  const productRowsJson = localStorage.getItem("productRows");
  if (!productRowsJson) {
    return [];
  } else {
    const objList = JSON.parse(productRowsJson);
    return objList.map(obj => {
      let product = Object.assign(new ProductData(), obj);
      product.id = ProductData.nextId++;
      return product;
    });
  }
}

function MyFoodDiary() {
  const [productRows, setProductRows] = useState([]);
  const [summary, setSummary] = useState(new SummaryData());

  useEffect(() => {
    setProductRows(readProductRowsFromLocalStorage());
    // load product rows from backend
  }, []);

  useEffect(() => {
    saveProductRowsToLocalStorage(productRows);
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

    let product = new ProductData(productName);
    product.id = ProductData.nextId++;
    const productId = product.id;
    rows.push(product);

    fetch(GET_PRODUCT_URL + encodeURIComponent(productName))
      .then(response => {return response.json()})
      .then(productResp => {
        const row = new ProductData(productResp.name, 0, productResp.kcal, productResp.protein, productResp.fat, productResp.carb);
        row.id = productId;
        changeProductAtIndex(row, rowIndex);
      });
  };

  const removeProductRow = rowIndex => {
    const rows = productRows.slice();
    rows.splice(rowIndex, 1);
    setProductRows(rows);
  };

  const updateProductAmount = (rowIndex, newAmount) => {
    const oldProduct = productRows[rowIndex];
    let product = new ProductData(oldProduct.name, newAmount, oldProduct.kcal, oldProduct.protein, oldProduct.fat, oldProduct.carb);
    product.id = oldProduct.id;
    changeProductAtIndex(product, rowIndex);
  };

  const clearProductTable = () => {
    setProductRows([]);
  };

  const saveProductTable = () => {
    saveProductRowsToBackend(productRows);
  }

  return <>
    <SearchPanel onAddProductClick={addSuggestedProduct}/>
    <TablePanel 
      productRows={productRows} 
      summary={summary} 
      onRemoveRow={removeProductRow} 
      onAmountChange={updateProductAmount} 
      onClearTable={clearProductTable}
      onSave={saveProductTable}/>
  </>
}


// ========================================


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyFoodDiary />);