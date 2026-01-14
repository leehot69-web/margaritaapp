
import { MenuCategory, ModifierGroup } from './types';

export const DELIVERY_PROMO_DAYS = [1, 2, 3, 4];
export const TOGO_ORDER_START_NUMBER = 101;

// --- GRUPOS DE MODIFICADORES ---
export const MARGARITA_MODIFIERS: ModifierGroup[] = [
  {
    title: "Elige tu Proteína",
    selectionType: "single", minSelection: 1, maxSelection: 1,
    options: [
      { name: "Carne en Vara", price: 0 },
      { name: "Puerco", price: 0 },
      { name: "Mixto", price: 0 }
    ],
  },
  {
    title: "Personaliza (Opcional)",
    selectionType: "multiple", minSelection: 0, maxSelection: 10,
    options: [
      { name: "Sin Ensalada", price: 0 },
      { name: "Sin Queso", price: 0 },
      { name: "Sin Nata", price: 0 },
      { name: "Sin Chimichurri", price: 0 },
      { name: "Sin Tostones", price: 0 },
      { name: "Sin Arepa", price: 0 }
    ],
  }
];

// --- DATOS DEL MENÚ (MI RANCHITO MAR Y LEÑA) ---
export const MARGARITA_MENU_DATA: MenuCategory[] = [
  {
    title: 'ENTRADA',
    items: [
      { name: 'Coctel de camarones', price: 9, available: true, description: 'Galletas, camarones en salsa rosada y especias' },
      { name: 'Ceviche', price: 9, available: true, description: 'Galletas, dado de pescado, camarón o mixto marinados en limón' },
      { name: 'Aguacate rellenos de camarones', price: 9, available: true, description: 'Galletas, salsa rosada y queso' }
    ]
  },
  {
    title: 'SOPA',
    items: [
      { name: 'Costilla (con arepa y queso)', price: 5, available: true },
      { name: 'Picadillo llanero con carne y puerco en vara', price: 8, available: true }
    ]
  },
  {
    title: 'ENSALADA',
    items: [
      { name: 'Aguacate', price: 5, available: true, description: 'Lechuga, tomate, cebolla, aguacate' }
    ]
  },
  {
    title: 'PLATO FUERTE',
    items: [
      { 
        name: 'Cachapa con Queso de Mano', price: 12, available: true, 
        description: 'Con 1 rueda de queso de mano, crema y puerco o carne en vara o mixta',
        modifierGroupTitles: ["Elige tu Proteína", "Personaliza (Opcional)"]
      },
      { 
        name: 'Carne en vara / Puerco / Mixto (Personal)', price: 12, available: true, 
        description: 'Tostones, arepas, ensalada, queso, chimichurri, nata',
        modifierGroupTitles: ["Elige tu Proteína", "Personaliza (Opcional)"]
      },
      { 
        name: 'Carne en vara / Puerco / Mixto (Familiar)', price: 45, available: true, 
        description: 'Tostones, arepas, ensalada, queso, chimichurri, nata',
        modifierGroupTitles: ["Elige tu Proteína", "Personaliza (Opcional)"]
      },
      { name: 'Mar y tierra (Personal)', price: 17, available: true, description: 'Puerco, carne, pollo, papas fritas, queso, aguacate, huevas fritas, croquetas y camarón rebozado' },
      { name: 'Mar y tierra (Para dos)', price: 28, available: true, description: 'Puerco, carne, pollo, papas fritas, queso, aguacate, huevas fritas, croquetas y camarón rebozado' },
      { name: 'Bocachico frito', price: 12, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Curvina frita (Mediana)', price: 12, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Curvina frita (Grande)', price: 15, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Lebranche (Personal)', price: 17, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Lebranche (Para 2)', price: 25, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Pescado en rueda (Personal)', price: 12, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Pescado en rueda (Para 2)', price: 22, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Filet de pescado frito', price: 12, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Filet de pescado (Camarón y queso)', price: 14, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Bocachico relleno con vegetales, camarón y queso', price: 14, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Huevas fritas', price: 12, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Camarones rebozados', price: 12, available: true, description: 'Tostones, queso, ensalada y nata' },
      { name: 'Croquetas de pescado (250g)', price: 10, available: true, description: 'Papas fritas' },
      { name: 'Tender de pollo (250g)', price: 8, available: true, description: 'Papas fritas' }
    ]
  },
  {
    title: 'ADICIONALES',
    items: [
      { name: 'Tequeños (8)', price: 6, available: true },
      { name: 'Queso (2)', price: 2, available: true },
      { name: 'Queso frito', price: 3, available: true },
      { name: 'Nata', price: 3, available: true },
      { name: 'Aguacate', price: 3, available: true },
      { name: 'Chorizo (1)', price: 2, available: true },
      { name: 'Galletas', price: 1, available: true },
      { name: 'Proteínas', price: 7, available: true },
      { name: 'Tostones', price: 2, available: true },
      { name: 'Yuca frita', price: 2, available: true },
      { name: 'Arepa (6)', price: 2, available: true },
      { name: 'Papa francesa (200g)', price: 3, available: true },
      { name: 'Arroz', price: 3, available: true },
      { name: 'Yuca cocida', price: 2, available: true }
    ]
  },
  {
    title: 'POSTRES',
    items: [
      { name: 'Quesillo', price: 5, available: true },
      { name: 'Torta de chocolate', price: 8, available: true },
      { name: 'Tres leches', price: 7, available: true }
    ]
  },
  {
    title: 'BEBIDAS',
    items: [
      { name: 'Refresco 350ml', price: 1, available: true },
      { name: 'Refresco 1.5 L', price: 3, available: true },
      { name: 'Papelón con limón 350ml', price: 1, available: true },
      { name: 'Papelón con limón 1.5 L', price: 3, available: true },
      { name: 'Cerveza', price: 1.5, available: true },
      { name: 'Balde de 10 cervezas', price: 12, available: true },
      { name: 'Agua 600ml', price: 1, available: true }
    ]
  }
];
