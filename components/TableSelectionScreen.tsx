
import React from 'react';
import { Table, TableStatus, WaiterAssignments } from '../types';

interface TableSelectionScreenProps {
  waiter: string;
  tables: Table[];
  waiterAssignments: WaiterAssignments;
  onSelectTable: (tableNumber: number) => void;
  onCreateToGoOrder: () => void;
  onOpenAddTableModal: () => void;
  getTable: (tableNumber: number) => Table;
  businessLogo?: string;
}

const statusStyles: { [key in TableStatus]: { text: string; bgColor: string; textColor: string; } } = {
    disponible: { text: 'LIBRE', bgColor: 'bg-green-500', textColor: 'text-green-600' },
    borrador: { text: 'PREPARANDO', bgColor: 'bg-amber-500', textColor: 'text-amber-600' },
    'no pagada': { text: 'OCUPADO', bgColor: 'bg-red-500', textColor: 'text-red-600' },
    pagada: { text: 'PAGADO', bgColor: 'bg-blue-500', textColor: 'text-blue-600' },
};

const TableCard: React.FC<{ table: Table, onSelect: () => void }> = ({ table, onSelect }) => {
    const { number, status } = table;
    const statusInfo = statusStyles[status] || statusStyles.disponible;

    return (
        <button 
            onClick={onSelect} 
            className="relative w-full aspect-[10/11] bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-col justify-center items-center text-center transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--brand-shadow-color)] overflow-hidden"
        >
            <div className="flex flex-col items-center justify-center gap-2 flex-grow">
                <div>
                    <p className="font-semibold text-[10px] text-gray-400 leading-none uppercase">Mesa</p>
                    <p className="text-4xl font-black text-[var(--brand-color)] leading-none">{number}</p>
                </div>
                <div>
                    <div className={`w-4 h-4 rounded-full ${statusInfo.bgColor} border-2 border-white shadow-inner mx-auto mb-1`}></div>
                    <p className="font-bold text-[8px] text-gray-600 uppercase">{statusInfo.text}</p>
                </div>
            </div>
        </button>
    );
};

const TogoOrderCard: React.FC<{ table: Table; onSelect: () => void }> = ({ table, onSelect }) => {
    const total = table.order.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const statusInfo = statusStyles[table.status];

    return (
        <button onClick={onSelect} className="relative w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center transition-all transform hover:shadow-md overflow-hidden">
            <div className={`absolute top-0 left-0 bottom-0 w-2 ${statusInfo.bgColor}`}></div>
            <div className="flex items-center gap-4 pl-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold text-lg text-left text-gray-800">{table.customerName || `Pedido #${table.number}`}</h4>
                    <p className="text-sm text-gray-400">{table.order.length} {table.order.length === 1 ? 'producto' : 'productos'}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-black text-xl text-gray-900">${total.toFixed(2)}</p>
                <p className={`text-xs font-bold uppercase ${statusInfo.textColor}`}>{statusInfo.text}</p>
            </div>
        </button>
    );
};


const TableSelectionScreen: React.FC<TableSelectionScreenProps> = (props) => {
  const { waiter, onSelectTable, onCreateToGoOrder, waiterAssignments, getTable, tables, onOpenAddTableModal } = props;
  
  const assignedTableNumbers = waiterAssignments[waiter] || [];
  
  const physicalTablesForWaiter = assignedTableNumbers
    .map(num => getTable(num))
    .filter(table => table.orderType !== 'para llevar');

  const activeToGoOrders = tables.filter(t => t.orderType === 'para llevar');

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <section className="mb-12">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight pb-2 mb-6 border-b border-gray-100">Mis Mesas</h2>
        {physicalTablesForWaiter.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
            {physicalTablesForWaiter.sort((a,b) => a.number - b.number).map((table) => {
                return <TableCard key={table.number} table={table} onSelect={() => onSelectTable(table.number)} />
            })}
             <button 
                onClick={onOpenAddTableModal} 
                className="flex items-center justify-center w-full aspect-[10/11] rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 transition-all transform hover:-translate-y-1 hover:bg-gray-200"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
              </button>
          </div>
        ) : (
          <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800">No tienes mesas asignadas</h3>
            <p className="mt-2 text-sm text-gray-400">Ve a <span className="font-bold">Ajustes</span> para asignar tus mesas.</p>
          </div>
        )}
      </section>

      <section className="max-w-4xl">
        <div className="flex justify-between items-center pb-2 mb-6">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Para Llevar</h2>
             <button 
                onClick={onCreateToGoOrder} 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-color)] text-white transition-all transform hover:scale-105 shadow-lg shadow-[var(--brand-shadow-color)]"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
              </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeToGoOrders.length > 0 ? activeToGoOrders.map((table) => (
              <TogoOrderCard key={table.number} table={table} onSelect={() => onSelectTable(table.number)} />
          )) : (
            <div className="text-center py-10 bg-transparent col-span-full">
                <p className="mt-2 text-sm text-gray-400 font-medium italic">No hay pedidos para llevar activos.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TableSelectionScreen;
