
const HISTORY_URL = "http://localhost:8080/api/history/";

function postProductRowsToBackend(productRows) {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const request = productRows.map(row => {return {productName: row.name, grams: row.amount}});

  fetch(HISTORY_URL + todayString, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {"Content-Type": "application/json;charset=utf-8"}
  });
}


export { postProductRowsToBackend }