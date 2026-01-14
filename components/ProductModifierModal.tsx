
import React, { useState, useMemo } from 'react';
import { MenuItem, ModifierOption, ModifierGroup, CartItem, SelectedModifier, ModifierAssignment } from '../types';

interface ProductModifierModalProps {
  item: MenuItem;
  allModifierGroups: ModifierGroup[];
  onClose: () => void;
  onSubmit: (item: MenuItem, selectedModifiers: SelectedModifier[], quantity: number) => void;
  initialCartItem?: CartItem | null;
  activeRate: number;
}

// Helper para obtener el grupo y la etiqueta
const getGroupAndLabel = (assignment: string | ModifierAssignment): { groupTitle: string, displayLabel: string } => {
    if (typeof assignment === 'string') {
        return { groupTitle: assignment, displayLabel: assignment };
    }
    return { groupTitle: assignment.group, displayLabel: assignment.label };
};

const ProductModifierModal: React.FC<ProductModifierModalProps> = ({ item, allModifierGroups, onClose, onSubmit, initialCartItem, activeRate }) => {
  const [quantity, setQuantity] = useState(initialCartItem?.quantity || 1);

  const groupsToDisplay = useMemo(() => {
    if (!item.modifierGroupTitles) return [];
    
    return item.modifierGroupTitles.map(assignment => {
      const { groupTitle, displayLabel } = getGroupAndLabel(assignment);
      const groupData = allModifierGroups.find(g => g.title === groupTitle);
      return groupData ? { ...groupData, displayLabel } : null;
    }).filter(Boolean) as (ModifierGroup & { displayLabel: string })[];

  }, [item.modifierGroupTitles, allModifierGroups]);

  const [selectionsByGroup, setSelectionsByGroup] = useState<Record<string, ModifierOption[]>>(() => {
    const initialState: Record<string, ModifierOption[]> = {};
    groupsToDisplay.forEach(group => {
      // Usamos la etiqueta de visualización como clave
      initialState[group.displayLabel] = [];
    });

    if (initialCartItem) {
        initialCartItem.selectedModifiers.forEach(selectedMod => {
            if (initialState[selectedMod.groupTitle]) {
                const groupDef = groupsToDisplay.find(g => g.displayLabel === selectedMod.groupTitle);
                const originalOption = groupDef?.options.find(opt => opt.name === selectedMod.option.name);
                if (originalOption) {
                    initialState[selectedMod.groupTitle].push(originalOption);
                }
            }
        });
    }

    return initialState;
  });
  
  const handleAddOption = (group: ModifierGroup & { displayLabel: string }, option: ModifierOption) => {
    setSelectionsByGroup(prev => {
      const newSelections = { ...prev };
      const currentGroupSelections = prev[group.displayLabel] || [];
      if (currentGroupSelections.length < group.maxSelection) {
        newSelections[group.displayLabel] = [...currentGroupSelections, option];
      }
      return newSelections;
    });
  };

  const handleRemoveOption = (group: ModifierGroup & { displayLabel: string }, option: ModifierOption) => {
    setSelectionsByGroup(prev => {
      const newSelections = { ...prev };
      const currentGroupSelections = [...(prev[group.displayLabel] || [])];
      const lastIndex = currentGroupSelections.map(o => o.name).lastIndexOf(option.name);
      if (lastIndex !== -1) {
        const newGroupSelections = [...currentGroupSelections];
        newGroupSelections.splice(lastIndex, 1);
        newSelections[group.displayLabel] = newGroupSelections;
      }
      return newSelections;
    });
  };


  const handleSelectionChange = (group: ModifierGroup & { displayLabel: string }, option: ModifierOption) => {
    setSelectionsByGroup(prev => {
      const newSelections = { ...prev };
      let currentGroupSelections = [...(newSelections[group.displayLabel] || [])];
      const isSelected = currentGroupSelections.some(mod => mod.name === option.name);

      if (group.selectionType === 'single') {
        currentGroupSelections = isSelected ? [] : [option];
      } else { // multiple
        if (isSelected) {
          currentGroupSelections = currentGroupSelections.filter(mod => mod.name !== option.name);
        } else {
          if (currentGroupSelections.length < group.maxSelection) {
            currentGroupSelections.push(option);
          }
        }
      }
      newSelections[group.displayLabel] = currentGroupSelections;
      return newSelections;
    });
  };

  const validationStatus = useMemo(() => {
    let isValid = true;
    const errors: Record<string, string> = {};
    groupsToDisplay.forEach(group => {
      const selectionCount = selectionsByGroup[group.displayLabel]?.length || 0;
      if (selectionCount < group.minSelection) {
        isValid = false;
        errors[group.displayLabel] = `Selecciona al menos ${group.minSelection}`;
      }
    });
    return { isValid, errors };
  }, [selectionsByGroup, groupsToDisplay]);

  const calculateTotal = () => {
    let modifiersTotal = 0;

    Object.entries(selectionsByGroup).forEach(([displayLabel, selectedOptions]: [string, ModifierOption[]]) => {
         const groupDef = groupsToDisplay.find(g => g.displayLabel === displayLabel);
         if (!groupDef) return;

         if (groupDef.freeSelectionCount !== undefined && groupDef.extraPrice !== undefined) {
             const freeLimit = groupDef.freeSelectionCount;
             const extraCost = groupDef.extraPrice;
             
             const baseOptionsCost = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
             
             const count = selectedOptions.length;
             const extras = Math.max(0, count - freeLimit);
             
             modifiersTotal += baseOptionsCost + (extras * extraCost);
         } else {
             modifiersTotal += selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
         }
    });

    return (item.price + modifiersTotal) * quantity;
  };

  const handleSubmit = () => {
    if (!validationStatus.isValid) return;

    const finalModifiers: SelectedModifier[] = [];

    Object.entries(selectionsByGroup).forEach(([displayLabel, selectedOptions]: [string, ModifierOption[]]) => {
        const groupDef = groupsToDisplay.find(g => g.displayLabel === displayLabel);
        
        if (groupDef && groupDef.freeSelectionCount !== undefined && groupDef.extraPrice !== undefined) {
            const freeLimit = groupDef.freeSelectionCount;
            const extraCost = groupDef.extraPrice;

            selectedOptions.forEach((opt, index) => {
                const finalOption = index < freeLimit ? opt : { ...opt, price: extraCost };
                finalModifiers.push({ groupTitle: displayLabel, option: finalOption });
            });
        } else {
            selectedOptions.forEach(opt => {
                finalModifiers.push({ groupTitle: displayLabel, option: opt });
            });
        }
    });

    onSubmit(item, finalModifiers, quantity);
  };

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image or Title */}
        <div className="relative shrink-0">
             {item.image && (
                 <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                     <img src={item.image} className="w-full h-full object-cover" alt={item.name}/>
                     <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                 </div>
             )}
             <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-white shadow-sm z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        </div>

        <div className="flex-grow overflow-y-auto px-5 pb-4">
             {/* Title and Description */}
             <div className="mb-6 pt-4">
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight pr-8">{item.name}</h2>
                {item.description && (
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {item.description}
                    </p>
                )}
             </div>

          <div className="space-y-6">
            {groupsToDisplay.map(group => {
                const allowDuplicates = group.title.toLowerCase().includes('proteína');
                return (
                    <div key={group.displayLabel}>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800">{group.displayLabel}</h3>
                        {validationStatus.errors[group.displayLabel] ? (
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">{validationStatus.errors[group.displayLabel]}</span>
                        ) : (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Listo</span>
                        )}
                    </div>
                    
                    <div className="space-y-3">
                        {group.options.map(option => {
                            const count = selectionsByGroup[group.displayLabel]?.filter(mod => mod.name === option.name).length || 0;
                            const isChecked = count > 0;
                        
                            let displayPrice = option.price;
                            let isExtraCharge = false;
                            let isIncluded = false;

                            if (group.extraPrice !== undefined && group.freeSelectionCount !== undefined) {
                                const currentCount = selectionsByGroup[group.displayLabel]?.length || 0;
                                const freeLimit = group.freeSelectionCount;
                                const extraPrice = group.extraPrice;

                                if (isChecked) {
                                    const indices = selectionsByGroup[group.displayLabel].map((m, i) => m.name === option.name ? i : -1).filter(i => i !== -1);
                                    if (indices.some(idx => idx >= freeLimit)) {
                                        displayPrice = extraPrice;
                                        isExtraCharge = true;
                                    } else {
                                        isIncluded = true;
                                    }
                                } else {
                                    if (currentCount >= freeLimit) {
                                        displayPrice = extraPrice;
                                        isExtraCharge = true;
                                    } else {
                                        isIncluded = true;
                                    }
                                }
                            } else {
                                isExtraCharge = option.price > 0;
                            }

                            if (allowDuplicates) {
                                if (count === 0) {
                                    return (
                                        <button
                                            key={option.name}
                                            type="button"
                                            onClick={() => handleAddOption(group, option)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl transition-all border-2 bg-white border-gray-100 text-left hover:border-gray-300 active:bg-gray-50"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-600">{option.name}</span>
                                                {isExtraCharge && (<span className="text-xs text-red-500 font-bold">(Adicional)</span>)}
                                                {isIncluded && (<span className="text-xs text-green-600 font-bold">(Incluido)</span>)}
                                            </div>
                                            <div className="flex items-center gap-3 text-right">
                                                {isExtraCharge && displayPrice > 0 && (
                                                    <div>
                                                        <span className="text-sm font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                            +${displayPrice.toFixed(2)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 block">Bs. {(displayPrice * activeRate).toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-500 rounded-xl border">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                } else { // count > 0
                                    return (
                                        <div
                                            key={option.name}
                                            className="flex items-center justify-between p-3 rounded-xl transition-all border-2 bg-red-50 border-[var(--brand-color)] shadow-sm"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{option.name}</span>
                                                {isExtraCharge && (<span className="text-xs text-red-500 font-bold">(Adicional)</span>)}
                                                {isIncluded && (<span className="text-xs text-green-600 font-bold">(Incluido)</span>)}
                                            </div>
                                            <div className="flex items-center gap-3 text-right">
                                                {isExtraCharge && displayPrice > 0 && (
                                                    <div>
                                                        <span className="text-sm font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                            +${displayPrice.toFixed(2)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 block">Bs. {(displayPrice * activeRate).toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => handleRemoveOption(group, option)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 font-black active:bg-gray-100 border text-2xl">-</button>
                                                    <span className="font-black text-gray-800 w-10 text-center text-xl">{count}</span>
                                                    <button type="button" onClick={() => handleAddOption(group, option)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-600 font-black active:bg-gray-100 border text-2xl">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            }


                            return (
                                <label 
                                key={option.name} 
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 ${isChecked ? 'bg-red-50 border-[var(--brand-color)] shadow-sm' : 'bg-white border-gray-100'}`}
                                >
                                <div className="flex flex-col">
                                    <span className={`font-medium ${isChecked ? 'text-gray-900' : 'text-gray-600'}`}>{option.name}</span>
                                    {isExtraCharge && (
                                        <span className="text-xs text-red-500 font-bold">
                                            (Adicional)
                                        </span>
                                    )}
                                    {isIncluded && (
                                        <span className="text-xs text-green-600 font-bold">
                                            (Incluido)
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                    {isExtraCharge && displayPrice > 0 && (
                                        <div>
                                            <span className="text-sm font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                +${displayPrice.toFixed(2)}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 block">Bs. {(displayPrice * activeRate).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isChecked ? 'border-[var(--brand-color)] bg-[var(--brand-color)]' : 'border-gray-300'}`}>
                                        {isChecked && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                    </div>
                                    <input
                                    type={group.selectionType === 'single' ? 'radio' : 'checkbox'}
                                    name={group.displayLabel}
                                    checked={isChecked}
                                    onChange={() => handleSelectionChange(group, option)}
                                    className="hidden"
                                    />
                                </div>
                                </label>
                            )
                        })}
                    </div>
                    </div>
                );
            })}
          </div>
        </div>

        {/* Footer with Quantity and Add Button */}
        <div className="flex-shrink-0 p-5 pt-2 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex items-center justify-between gap-4">
              
              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1 shrink-0">
                  <button onClick={decrementQty} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 font-bold hover:bg-gray-50 active:scale-95 transition-transform text-xl leading-none">-</button>
                  <span className="w-10 text-center font-bold text-lg text-gray-800">{quantity}</span>
                  <button onClick={incrementQty} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 font-bold hover:bg-gray-50 active:scale-95 transition-transform text-xl leading-none">+</button>
              </div>

              {/* Add Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!validationStatus.isValid}
                    className="flex-grow py-3 bg-[var(--brand-color)] text-white rounded-xl font-bold shadow-lg shadow-[var(--brand-shadow-color)] hover:bg-[var(--brand-color-dark)] transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:transform-none flex justify-center items-center gap-3 px-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="text-left leading-tight">
                        <div className="font-bold text-lg">${calculateTotal().toFixed(2)}</div>
                        <div className="text-xs font-normal">Bs. {(calculateTotal() * activeRate).toFixed(2)}</div>
                    </div>
                </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModifierModal;
