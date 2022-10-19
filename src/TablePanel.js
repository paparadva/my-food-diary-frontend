import { useEffect, useState } from 'react';

function TablePanel(props) {
  const productRows = props.productRows;
  const handleRemoveRow = props.onRemoveRow;
  const handleAmountChange = props.onAmountChange;
  const handleClearTable = props.onClearTable;
  const handleSave = props.onSave;
  const summary = props.summary;

  return (
  <div className="table-container">
    <div className="table-panel">
      <button onClick={handleSave} className="save-button">Сохранить</button>
      <button onClick={handleClearTable} className="remove-button">Очистить</button>
    </div>
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
        key={product.id} 
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

  return (
    <div className="table-row">
      <div className="table-cell product-name">{product.name}</div>
      <div className="table-cell product-mass">
        <input type="number" 
        	defaultValue={product.amount} 
        	onChange={(e) => onAmountChange(rowIndex, e.target.value)} 
        	onFocus={(e) => e.target.select()} 
        	min="0" 
        	className="mass-input"/>
      </div>
      <div className="table-cell product-kcal">{Math.round(product.calcKcal())}</div>
      <div className="table-cell product-protein">{product.calcProtein().toFixed(1)}</div>
      <div className="table-cell product-fat">{product.calcFat().toFixed(1)}</div>
      <div className="table-cell product-carb">{product.calcCarb().toFixed(1)}</div>
      <div className="table-cell product-remove">
        <button className="row-action-button remove-button" onClick={() => onRemoveClick(rowIndex)}>X</button>
      </div>
    </div>
  );
}


export default TablePanel;