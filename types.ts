
export interface ModifierOption {
  name: string;
  price: number;
}

export interface ModifierGroup {
  title: string;
  selectionType: 'single' | 'multiple';
  minSelection: number; 
  maxSelection: number; 
  options: ModifierOption[];
  freeSelectionCount?: number; 
  extraPrice?: number; 
}

// NUEVA ESTRUCTURA PARA ASIGNACIÓN DE MODIFICADORES
export interface ModifierAssignment {
  group: string; // El título real del ModifierGroup
  label: string; // El título que se mostrará al usuario y se guardará en el carrito
}

export interface MenuItem {
  name: string;
  price: number;
  available: boolean;
  description?: string;
  modifierGroupTitles?: (string | ModifierAssignment)[]; // Puede ser un string o un objeto de asignación
  image?: string; 
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export type ThemeName = 'red' | 'blue' | 'green' | 'dark' | 'white' | 'marine' | 'margarita';

export interface StoreProfile {
  id: string;
  name: string;
  logo: string;
  menu: MenuCategory[];
  whatsappNumber: string; 
  kitchenWhatsappNumber?: string; 
  adminWhatsappNumber?: string; 
  googleSheetUrl?: string; 
  modifierGroups: ModifierGroup[];
  theme: ThemeName;
  paymentMethods: string[];
  heroImage?: string;
}

export interface SelectedModifier {
    groupTitle: string;
    option: ModifierOption;
}

export interface CartItem {
  id: string; 
  name: string;
  price: number; 
  quantity: number;
  selectedModifiers: SelectedModifier[];
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  phone?: string;
  paymentMethod: string;
  instructions?: string;
}

export interface UserDetails {
  name: string;
  phone: string;
}

export type View = 'menu' | 'cart' | 'checkout' | 'success' | 'settings' | 'reports' | 'kanban';

// --- POS/Report Types ---

// Added missing TableStatus export
/**
 * Representa los estados posibles de una mesa en el sistema POS.
 */
export type TableStatus = 'disponible' | 'borrador' | 'no pagada' | 'pagada';

// Added missing OrderItem export
/**
 * Representa un ítem dentro de una orden de POS.
 */
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedModifiers: ModifierOption[];
  status?: 'cancelled' | 'pending';
}

// Added missing Table export
/**
 * Representa una mesa física o un pedido "para llevar" en el sistema POS.
 */
export interface Table {
  number: number;
  status: TableStatus;
  order: OrderItem[];
  orderType: 'mesa' | 'para llevar';
  customerName?: string;
  observations?: string;
  lastSentOrder?: OrderItem[];
  sentToKitchenAt?: string;
  paidAmount?: number;
  orderCode?: string;
}

// Added missing SpecialOffer export
/**
 * Representa una oferta especial mostrada en el sistema.
 */
export interface SpecialOffer {
  title: string;
  subtitle: string;
  targetItemName: string;
  displayPrice: string;
}

export interface SaleRecord {
  id: string;
  date: string; 
  time: string;
  tableNumber: number;
  waiter: string;
  total: number;
  order: (CartItem | OrderItem)[]; // Soporta tanto ítems de carrito como de POS
  type: 'sale' | 'refund';
  notes?: string;
  orderCode?: string; // Added missing orderCode property for table audit
  customerName?: string;
}

export interface AppSettings {
  totalTables: number;
  printerPaperWidth: '58mm' | '80mm';
  exchangeRateBCV: number;
  exchangeRateParallel: number;
  activeExchangeRate: 'bcv' | 'parallel';
  adminPin?: string;
  isTrialActive: boolean;
  operationCount: number;
}

export type WaiterAssignments = Record<string, number[]>;
