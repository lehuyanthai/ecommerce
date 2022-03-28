import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICartState {
  isOpen:boolean;
  isSuccess: boolean;
  products: ICartProduct[];
  quantity: number;
  total: number;
}

export interface ICartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

const initialState: ICartState = {
  isOpen:false,
  isSuccess: false,
  products: [],
  quantity: 0,
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getTotal: (state) => {
      let { total, quantity } = state.products.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += quantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );

      state.total = total;
      state.quantity = quantity;
    },
    reset: () => initialState,
    addProduct: (state, action: PayloadAction<ICartProduct>) => {
      if (state.quantity === 0) {
        state.products.push(action.payload);
      } else {
        let check = false;
        state.products.forEach((item, index) => {
          if (
            item.id === action.payload.id &&
            item.color === action.payload.color &&
            item.size === action.payload.size
          ) {
            state.products[index].quantity++;
            check = true;
          }
        });
        if (!check) {
          state.products.push(action.payload);
        }
      }
      cartSlice.caseReducers.getTotal(state);
    },
    removeProduct: (state, action: PayloadAction<ICartProduct>) => {
      state.products = state.products.filter(
        (item) =>
          item.id !== action.payload.id ||
          (item.id === action.payload.id &&
            (item.color !== action.payload.color ||
              item.size !== action.payload.size))
      );
      cartSlice.caseReducers.getTotal(state);
    },
    increaseAmount: (state, action: PayloadAction<ICartProduct>) => {
      const index = state.products.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      state.products[index].quantity += 1;
      state.quantity++;
      cartSlice.caseReducers.getTotal(state);
    },
    decreaseAmount: (state, action: PayloadAction<ICartProduct>) => {
      const index = state.products.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (state.products[index].quantity > 1) {
        state.quantity -= 1;
        state.products[index].quantity--;
      }
      cartSlice.caseReducers.getTotal(state);
    },
    checkout: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    openCart:(state) => {
      state.isOpen=true;
    },
    closeCart:(state) => {
      state.isOpen=false;
    }
  },
});

export const {
  openCart,
  closeCart,
  addProduct,
  increaseAmount,
  decreaseAmount,
  removeProduct,
  getTotal,
  checkout,
  reset,
} = cartSlice.actions;

export default cartSlice.reducer;
