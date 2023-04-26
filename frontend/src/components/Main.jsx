import React, { useRef, useCallback } from "react";
import Product from './Product';
import ProductPopup from './ProductPopup'
import { useEffect, useState } from 'react';
import axios from 'axios';
import useProdsSearch from './useProdsSearch'


export default function Main(props) {
  const { products, onAdd, term, status, changeStatus, user, updateUser, item, items, setItem, setItems } = props;

  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    prods,
    hasMore,
    loading,
    error
  } = useProdsSearch(query, pageNumber)
  console.log(prods)

  const observer = useRef()
  const lastProdsElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
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
          <input type="text" className="searchTerm" placeholder="Search a product" value={query} onChange={handleSearch}></input>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="flex flex-wrap gap-12 -m-4" >
        {prods.map((prod, index) => {
          if (prods.length === index + 1) {
            return <div ref={lastProdsElementRef} key={prod}>{prod}</div>
          } else {
            return <div key={prod}>{prod}</div>
          }
        })}
        {/* {prods.map((product) => (
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
            handleProductSelect={handleProductSelect}
          ></Product>
        ))} */}
      </div>
      {selectedProduct && (
        <ProductPopup product={selectedProduct} onClose={handlePopupClose} />
      )}
    </div>
  );
}
