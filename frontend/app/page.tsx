'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    // Fetch menu from backend
    fetch('http://localhost:5001/api/menu')
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error('Error fetching menu:', err));
  }, []);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item && item.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(cart.filter((cartItem) => cartItem.id !== id));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderData = {
      items: cart,
      total: getTotalPrice(),
      customerName,
    };

    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        setCart([]);
        setCustomerName('');
        setTimeout(() => setOrderPlaced(false), 3000);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">🍽️ Food Ordering App</h1>
          <p className="text-gray-600">Order your favorite food online!</p>
        </header>

        {orderPlaced && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Order placed successfully! Thank you for ordering.
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-6xl text-center mb-4">{item.image}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-2xl font-bold text-orange-600 mb-4">${item.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {showCart && (
          <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{item.image}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full font-semibold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full font-semibold"
                        >
                          +
                        </button>
                        <span className="font-bold text-orange-600 ml-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={placeOrder}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-lg"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
