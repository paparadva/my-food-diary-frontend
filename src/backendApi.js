import { ProductData } from './model.js';


const HISTORY_URL = "http://localhost:8080/api/history/";

function postProductRowsToBackend(productRows) {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const request = productRows.map(row => {return {productName: row.name, grams: row.amount}});

  return fetch(HISTORY_URL + todayString, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {"Content-Type": "application/json;charset=utf-8"}
  });
}


const GET_PRODUCT_URL = "http://localhost:8080/api/product?name=";

function getProductFromBackend(productName) {
  return fetch(GET_PRODUCT_URL + encodeURIComponent(productName))
    .then(response => {return response.json()})
    .then(productResp => new ProductData(productResp.name, 0, productResp.kcal, productResp.protein, productResp.fat, productResp.carb));
}


export { postProductRowsToBackend, getProductFromBackend }