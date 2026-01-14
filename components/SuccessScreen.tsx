
import React from 'react';
import { CartItem, CustomerDetails } from '../types';

interface SuccessScreenProps {
  cart: CartItem[];
  customerDetails: CustomerDetails;
  onStartNewOrder: () => void;
  onReprint: () => void;
  isPrinterConnected: boolean;
  activeRate: number;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  cart,
  customerDetails,
  onStartNewOrder,
  onReprint,
  isPrinterConnected,
  activeRate
}) => {
  const total = cart.reduce((acc, item) => {
    const modTotal = item.selectedModifiers.reduce((s, m) => s + m.option.price, 0);
    return acc + ((item.price + modTotal) * item.quantity);
  }, 0);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-green-50 p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-black text-green-800 mb-2 uppercase">¡Pedido Registrado!</h2>
      <p className="text-gray-600 mb-8 text-sm max-w-xs">El pedido se ha procesado. Ahora puedes iniciar uno nuevo o re-imprimir el recibo si es necesario.</p>

      {/* Order Summary */}
      <div className="w-full max-w-sm bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 text-left">
          <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Resumen del Pedido</h3>
          <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Referencia:</span>
              <span className="text-sm font-bold text-gray-800">{customerDetails.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <span className="text-base font-bold text-gray-600">Total:</span>
              <div className="text-right">
                <span className="text-xl font-black text-gray-900">${total.toFixed(2)}</span>
                <p className="text-xs font-bold text-gray-400">Bs. {(total * activeRate).toFixed(2)}</p>
              </div>
          </div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button 
          onClick={onStartNewOrder} 
          className="w-full py-4 bg-green-600 text-white rounded-2xl font-black uppercase shadow-lg tracking-wider transform active:scale-95 transition-transform"
        >
          Nuevo Pedido
        </button>
        <button 
          onClick={onReprint}
          disabled={!isPrinterConnected}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold uppercase tracking-wider transform active:scale-95 transition-transform disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          title={!isPrinterConnected ? "Conecta una impresora para re-imprimir" : "Re-imprimir recibo"}
        >
          Re-imprimir Recibo
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
