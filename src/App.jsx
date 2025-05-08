import { useState, useEffect } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import db from "./data/db";

function App() {
  const initialCart = ()=>{
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart? JSON.parse(localStorageCart) : [];
  }
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(initialCart);
  useEffect(() => {
    setData(db);
  }, [setCart]);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(guitar){
    const itemExist = cart.findIndex((item) => guitar.id === item.id)
    if(itemExist >= 0) {
      const updatedCart = [...cart]
      updatedCart[itemExist].quantity++
      setCart(updatedCart)
    } else {
      guitar.quantity = 1;
      setCart([...cart, guitar])
    }
  }

  function removeFromCart(id) {
    setCart((prevState) =>  prevState.filter((guitar)=>guitar.id !== id))
  }

  function cleanCart(){
    const updatedCart = []
    setCart(updatedCart)
    console.log(updatedCart)
  }

  function increaseQuantity(id){
    const updatedCart = cart.map(item =>  item.id === id? {...item, quantity: item.quantity + 1}: item);
    setCart(updatedCart)
  }

  function decreaseQuantity(id){
    const updatedCart = cart.map(item =>  item.id === id && item.quantity > 1 ? {...item, quantity: item.quantity - 1}: item);
    setCart(updatedCart)
  }


  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        cleanCart={cleanCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección dev</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
