import {debounce} from "./utils";
import {getProductFromBackend, postProductRowsToBackend} from "./backendApi";
import {ProductData, SummaryData} from "./model";
import React, {useEffect, useState} from "react";
import SearchPanel from "./SearchPanel";
import TablePanel from "./TablePanel";

let nextRowId = 1;

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
            product.id = nextRowId++;
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
        product.id = nextRowId++;
        const productId = product.id;
        rows.push(product);

        getProductFromBackend(productName)
            .then(product => {
                product.id = productId;
                changeProductAtIndex(product, rowIndex);
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
        saveProductRowsToBackend(new Date(), productRows);
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

export default MyFoodDiary;