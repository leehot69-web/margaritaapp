
import React from 'react';

interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPrinterConnected: boolean;
  isEdit?: boolean;
  onConfirmPrintAndSend: () => void;
  onConfirmPrintOnly: () => void;
  onConfirmSendOnly: () => void;
  onConfirmSendUnpaid: () => void;
}

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  onClose,
  isPrinterConnected,
  isEdit = false,
  onConfirmPrintAndSend,
  onConfirmPrintOnly,
  onConfirmSendOnly,
  onConfirmSendUnpaid,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-[2.5rem] shadow-2xl p-6 sm:p-8 w-full max-w-md border-t-8 border-green-600 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                {isEdit ? 'Confirmar Cobro' : 'Finalizar Pedido'}
            </h2>
            <p className="text-gray-500 text-sm font-bold mt-1 leading-tight">
                {isEdit 
                    ? '¿Cómo deseas cerrar esta cuenta?' 
                    : 'Selecciona una acción para este pedido:'
                }
            </p>
        </div>

        <div className="space-y-3">
            {/* OPCIÓN 1: COBRO TOTAL (LO QUE PIDIÓ EL USUARIO) */}
            <button
                onClick={onConfirmPrintAndSend}
                className="w-full flex flex-col items-center justify-center py-5 px-4 font-black text-white bg-green-600 rounded-2xl hover:bg-green-700 transition-all transform active:scale-95 shadow-xl shadow-green-100 border-b-4 border-green-800"
            >
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    <span className="text-lg uppercase tracking-widest">Cobrar e Imprimir</span>
                </div>
                <span className="text-[9px] opacity-80 mt-1 uppercase font-black">Registra en caja + Envía WhatsApp + Recibo</span>
            </button>

            {/* OPCIÓN 2: COBRO RÁPIDO SIN IMPRESORA */}
            <button
                onClick={onConfirmSendOnly}
                className="w-full py-4 font-black text-green-700 bg-white border-2 border-green-600 rounded-2xl hover:bg-green-50 transition-all flex flex-col items-center justify-center"
            >
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span className="uppercase tracking-widest">Cobrar y WhatsApp</span>
                </div>
                <span className="text-[9px] opacity-60 uppercase font-bold mt-0.5">Registra en caja sin usar la impresora</span>
            </button>
            
            <div className="h-px bg-gray-100 my-4 flex items-center justify-center">
                <span className="bg-white px-3 text-[9px] font-black text-gray-300 uppercase tracking-widest">Otras opciones</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onConfirmSendUnpaid}
                    className="flex flex-col items-center justify-center py-4 bg-amber-50 text-amber-700 rounded-xl font-black text-[9px] uppercase border border-amber-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {isEdit ? 'Seguir Pendiente' : 'Enviar sin Cobrar'}
                </button>
                <button
                    onClick={onConfirmPrintOnly}
                    className="flex flex-col items-center justify-center py-4 bg-gray-50 text-gray-600 rounded-xl font-black text-[9px] uppercase border border-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Solo Registrar Cobro
                </button>
            </div>
        </div>
        
        <button
            onClick={onClose}
            className="w-full mt-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-[10px] hover:text-gray-600 transition-colors"
        >
            Cancelar y Volver
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;
