import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  cartItemId: string; // Unique ID for the cart item (since same menu item can have different variants/extras)
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  variant?: string | null;
  extras?: { name: string; price: number }[];
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        const cartItemId = `${item.menuItemId}-${item.variant || 'none'}-${(item.extras || []).map(e => e.name).sort().join(',')}`;
        
        set((state) => {
          const existingItem = state.items.find((i) => i.cartItemId === cartItemId);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          
          return {
            items: [...state.items, { ...item, cartItemId }],
            isOpen: true,
          };
        });
      },
      
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },
      
      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      setIsOpen: (isOpen) => set({ isOpen }),
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const extrasTotal = item.extras?.reduce((sum, extra) => sum + extra.price, 0) || 0;
          return total + (item.price + extrasTotal) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'niolas-pasta-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
    }
  )
)
