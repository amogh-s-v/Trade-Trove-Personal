import React, { useRef } from "react";
import Product from './Product';
import ProductPopup from './ProductPopup'
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Main(props) {
  const { products, onAdd, term, status, changeStatus, user, updateUser, item, items, setItem, setItems } = props;

  const inputEl = useRef("");

  const getSearchTerm = () => {
    props.searchKeyword(inputEl.current.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getItems();
      setItems(result)
    }
    fetchData()
  }, [])

  const getItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:9002/items")
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handlePopupClose = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex-row">
      <div className="wrap">
        <div className="search">
          <input type="text" className="searchTerm" id="input_text" placeholder="Search a product" ref={inputEl} value={term} onChange={getSearchTerm}></input>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="flex flex-wrap gap-12 -m-4" >
        {products.map((product) => (
          <Product
            item={item}
            setItem={setItem}
            items={items}
            setItems={setItems}
            user={user}
            updateUser={updateUser}
            key={product._id}
            product={product}
            onAdd={onAdd}
            status={status}
            changeStatus={changeStatus}
            handleProductSelect = {handleProductSelect}
          ></Product>
        ))}
      </div>
      {selectedProduct && (
        <ProductPopup product={selectedProduct} onClose={handlePopupClose} />
      )}
    </div>
  );
}
