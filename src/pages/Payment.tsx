import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ShieldCheck, ArrowLeft, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../types';
import Price from '../components/Price';

interface PaymentProps {
  cart: CartItem[];
  clearCart: () => void;
}

export default function Payment({ cart, clearCart }: PaymentProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const location = useLocation();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [billingAddress, setBillingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    if (location.pathname.includes('/checkout/success')) {
      setStep(2);
      clearCart();
    } else if (location.pathname.includes('/checkout/failure')) {
      alert("Paiement échoué ou annulé.");
    }
  }, [location]);

  const handlePayment = async () => {
    if (!billingAddress.fullName || !billingAddress.address || !billingAddress.city) {
      alert("Veuillez remplir les informations de facturation");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          items: cart, 
          totalPrice: total, 
          billingAddress: JSON.stringify(billingAddress) 
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (res.ok) {
        setStep(2);
        clearCart();
      } else {
        alert(data.error || "Une erreur s'est produite");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    }
  };

  if (step === 2) {
    return (
      <div className="py-32 bg-[#fafaf9] flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-gray-50"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Paiement Réussi !</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Votre commande a été validée avec succès. Vous recevrez un email de confirmation contenant vos accès de formation dans quelques instants.
          </p>
          <Link to="/dashboard" className="inline-block w-full bg-[#3b2a8f] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#2d1f70] transition-all shadow-xl">
            Aller à mon tableau de bord
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-[#fafaf9] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/cart" className="inline-flex items-center text-gray-500 hover:text-[#3b2a8f] mb-12 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Retour au panier</span>
        </Link>
        
        <header className="mb-12">
          <span className="text-[#3B2A8F] font-black tracking-widest uppercase text-[10px] mb-4 block">Secure Checkout</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight italic">Validation de commande</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-900 italic">Résumé de la commande</h2>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{item.quantity} formation(s)</p>
                  </div>
                  <Price amount={item.price * item.quantity} className="font-bold text-[#3b2a8f] whitespace-nowrap" />
                </div>
              ))}
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-900 font-bold text-xl uppercase tracking-tighter">Total</span>
                <Price amount={total} className="text-[#3b2a8f] font-black text-2xl" />
              </div>
            </div>

            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start space-x-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">Paiement 100% Sécurisé</h4>
                <p className="text-xs text-blue-800 opacity-80 leading-relaxed italic">
                  Vos transactions sont protégées par un cryptage SSL de niveau bancaire.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-50 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Adresse de Facturation</h3>
                <MapPin className="w-6 h-6 text-[#3b2a8f]" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nom Complet</label>
                  <input 
                    type="text" 
                    placeholder="Jean Dupont"
                    value={billingAddress.fullName}
                    onChange={(e) => setBillingAddress({...billingAddress, fullName: e.target.value})}
                    className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3b2a8f] transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Adresse</label>
                  <input 
                    type="text" 
                    placeholder="123 rue de la Paix"
                    value={billingAddress.address}
                    onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                    className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3b2a8f] transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Code Postal</label>
                    <input 
                      type="text" 
                      placeholder="75001"
                      value={billingAddress.postalCode}
                      onChange={(e) => setBillingAddress({...billingAddress, postalCode: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3b2a8f] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ville</label>
                    <input 
                      type="text" 
                      placeholder="Paris"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                      className="w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3b2a8f] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              className="mt-12 w-full bg-[#3b2a8f] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#2d1f70] transition-all shadow-xl shadow-[#3b2a8f]/20 active:scale-[0.98] flex items-center justify-center gap-4"
            >
              <span>Payer avec Chargily</span>
              <Price amount={total} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
