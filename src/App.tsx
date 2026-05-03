import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Formations from './pages/Formations';
import Boutique from './pages/Boutique';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Payment from './pages/Payment';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Instructors from './pages/Instructors';
import InstructorProfile from './pages/InstructorProfile';
import { Course, CartItem, User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addToCart = (course: Course) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === course.id);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.id === course.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...course, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  if (isInitializing) return null;

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#fafaf9]">
        <Routes>
          {/* Admin route handles its own layout */}
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' ? (
                <Admin onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />

          {/* Public routes share Navbar and Footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} user={user} onLogout={handleLogout} />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home onAddToCart={addToCart} />} />
                    <Route path="/formations" element={<Formations onAddToCart={addToCart} />} />
                    <Route 
                      path="/boutique" 
                      element={
                        <Boutique 
                          cart={cart} 
                          addToCart={addToCart} 
                          removeFromCart={removeFromCart} 
                          user={user}
                        />
                      } 
                    />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register onLogin={handleLogin} />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/instructors" element={<Instructors />} />
                    <Route path="/instructors/:id" element={<InstructorProfile />} />
                    <Route 
                      path="/cart" 
                      element={
                        <Cart 
                          cart={cart} 
                          removeFromCart={removeFromCart} 
                          user={user}
                        />
                      } 
                    />
                    <Route 
                      path="/paiement" 
                      element={
                        user ? (
                          <Payment cart={cart} clearCart={clearCart} />
                        ) : (
                          <Navigate to="/login" />
                        )
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
