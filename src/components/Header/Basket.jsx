import React from 'react';
import './BasketStyle.css'
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Basket(props) {

  const { onAdd, onRemove, reRender } = props;

  const [cartItems, setCartItems] = useState([]);

  const getCartItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:9002/cart")
      return data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCartItems();
      console.log("fetched")
      setCartItems(result)
    }
    fetchData()
  }, [reRender])

  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = itemsPrice > 2000 ? 0 : 70;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const history = useHistory();

  const redirectMe = (url) => {
    history.push(url)
    window.location.reload();

  }

  return (

    <aside className="blockCart col-1">
      <h2 className="h2">Cart Items</h2>
      <br></br>

      <div>
        {cartItems.length === 0 && <div>Cart is empty</div>}
        {cartItems.map((item) => (
          <div key={item._id} className="row">
            <div className="col-2 inline text-base text-slate-50 text-sky-400">{item.title}</div>
            <div className="col-2 text-base text-slate-50 text-sky-400">
              <button onClick={() => onRemove(item)} className="remove">
                -
              </button>{' '}
              <button onClick={() => onAdd(item)} className="add">
                +
              </button>
            </div>
            <div className="col-2 inline text-base text-slate-50 text-rose-500" >{item.qty}</div>
            <div className="col-2 text-right inline text-base text-slate-50 text-green-300">
              ₹{item.qty * item.price.toFixed(2)}
            </div>
          </div>
        ))}

        <br></br>

        {cartItems.length !== 0 && (
          <>
            <hr></hr>
            <br></br>
            <div className="row">
              <div className="col-2 inline text-base text-slate-50 text-sky-400">Items Price</div>
              <div className="col-1 text-right inline text-base text-slate-50 text-green-300">₹{itemsPrice.toFixed(2)}</div>
            </div>
            <br></br>
            <hr></hr>
            <div className="row">
              <div className="col-2">
                <br></br>
                <h2 className="h2 inline text-base text-slate-50 text-sky-400">Total Price</h2>
              </div>
              <div className="col-1 text-right">
                <br></br>
                <h2 className="h2 text-rose-500">₹{totalPrice.toFixed(2)}</h2>
              </div>
            </div>
            <br></br>
            <hr />
            <div className="buttonRow">
              <button onClick={() => redirectMe('/checkout')} className="bg-blue-500 hover:bg-rose-500 text-base text-white font-bold py-2 px-4 rounded">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}