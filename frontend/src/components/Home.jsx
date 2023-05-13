import Header from './Header/Header.jsx'
import Main from './Main';

import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {

  const [item, setItem] = useState({ title: '', image: '', price: 0 });
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([]);

  const [reRender, setreRender] = useState(false);

  const [user, setLoginUser] = useState({})

  var s = {
    height : "1cm",
    width : "3cm"
  }


  useEffect(() => {
    setLoginUser(JSON.parse(localStorage.getItem("MyUser")))
  }, [])

  const updateUser = (user) => {
    localStorage.setItem("MyUser", JSON.stringify(user))
    setLoginUser(user)
  }

  const onAdd = async(product) => {

    await axios.post("http://localhost:9002/addtocart" , { product , user});
    setreRender(!reRender)
  };

  const onRemove = async (product) => {
    await axios.post("http://localhost:9002/removefromcart", {product , user});
    setreRender(!reRender)
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newProducts = items.filter((product) => {
        return Object.values(product.title)
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newProducts);
    } else {
      setSearchResults(items);
    }
  };

  return (
    <div className="text-gray-400 bg-gray-900 body-font">
      <Header
        setItems={setItems}
        user={user}
        updateUser={updateUser}
        onAdd={onAdd}
        onRemove={onRemove}
        reRender = {reRender}
      ></Header>
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-24 mx-auto">
          <Main
            item={item}
            setItem={setItem}
            items={items}
            setItems={setItems}
            user={user}
            updateUser={updateUser}
            products={searchTerm.length <= 0 ? items : searchResults}
            onAdd={onAdd}
            term={searchTerm}
            searchKeyword={searchHandler}
          ></Main>
        </div>
      </section>
    </div>
  );
}

export default Home;