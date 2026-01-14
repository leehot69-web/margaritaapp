import React, { useState } from 'react';
import { StoreProfile } from '../types';

interface LoginScreenProps {
  onLogin: (name: string, storeId: string) => void;
  storeProfiles: StoreProfile[];
  onUpdateStoreProfiles: (updater: (profiles: StoreProfile[]) => StoreProfile[]) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, storeProfiles, onUpdateStoreProfiles }) => {
  const [step, setStep] = useState<'selectStore' | 'quickSetup' | 'enterName'>('selectStore');
  const [name, setName] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  const [kitchenWhatsapp, setKitchenWhatsapp] = useState('');
  const [adminWhatsapp, setAdminWhatsapp] = useState('');

  const selectedStore = storeProfiles.find(p => p.id === selectedStoreId);

  const handleStoreSelect = (storeId: string) => {
    const store = storeProfiles.find(p => p.id === storeId);
    setSelectedStoreId(storeId);
    if (store && !store.kitchenWhatsappNumber) {
        setKitchenWhatsapp(store.kitchenWhatsappNumber || '');
        setAdminWhatsapp(store.adminWhatsappNumber || '');
        setStep('quickSetup');
    } else {
        setStep('enterName');
    }
  };
  
  const handleGoBack = () => {
    setStep('selectStore');
    setSelectedStoreId('');
  };

  const handleSaveSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStoreId || !kitchenWhatsapp.trim()) return;

    onUpdateStoreProfiles(profiles =>
      profiles.map(p =>
        p.id === selectedStoreId
          ? { ...p, kitchenWhatsappNumber: kitchenWhatsapp.trim(), adminWhatsappNumber: adminWhatsapp.trim() }
          : p
      )
    );
    setStep('enterName');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedStoreId) {
      onLogin(name.trim(), selectedStoreId);
    }
  };
  
  const renderContent = () => {
    switch (step) {
      case 'quickSetup':
        if (!selectedStore) return null;
        return (
          <div className="relative p-8 space-y-6 bg-white rounded-2xl shadow-lg">
             <button onClick={handleGoBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-700">Configuración Rápida</h1>
              <p className="mt-2 text-sm text-gray-500">Configura los números de WhatsApp para <span className="font-bold">{selectedStore.name}</span>.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSaveSetup}>
              <input type="text" value={kitchenWhatsapp} onChange={(e) => setKitchenWhatsapp(e.target.value)} className="input-style" placeholder="WhatsApp de Cocina (Ej: 58412...)" required />
              <input type="text" value={adminWhatsapp} onChange={(e) => setAdminWhatsapp(e.target.value)} className="input-style" placeholder="WhatsApp de Admin (Opcional)" />
              <button type="submit" disabled={!kitchenWhatsapp.trim()} className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">Guardar y Continuar</button>
            </form>
          </div>
        );
      
      case 'enterName':
        if (!selectedStore) return null;
        return (
          <div className="relative p-8 space-y-6 bg-white rounded-2xl shadow-lg">
            <button onClick={handleGoBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <div className="text-center">
              <img src={selectedStore.logo} alt="Business Logo" className="w-auto h-28 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-700">¿Quién eres?</h1>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-style text-center text-lg"
                placeholder="Ingresa tu nombre"
                required
                autoFocus
              />
              <button type="submit" disabled={!name.trim()} className="w-full py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                Ingresar
              </button>
            </form>
          </div>
        );

      case 'selectStore':
      default:
        return (
          <div className="p-8 space-y-6 bg-white rounded-2xl shadow-lg text-center">
            <h1 className="text-2xl font-bold text-gray-700">Selecciona tu Tienda</h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-4">
              {storeProfiles.map(profile => (
                <button key={profile.id} onClick={() => handleStoreSelect(profile.id)} className="group flex flex-col items-center p-4 border-2 border-transparent rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition">
                  <img src={profile.logo} alt={profile.name} className="w-28 h-28 object-contain transition-transform group-hover:scale-105" />
                  <p className="text-sm font-semibold mt-3 text-gray-600 group-hover:text-gray-900">{profile.name}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-lg transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginScreen;