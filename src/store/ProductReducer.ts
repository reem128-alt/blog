import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  category_id: number;
  image: File | string;
  subImages: File[] | string[];
  short_description: string;
  stock: number;
  featured: boolean;
};

export type ProductItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  category_id: number;
  image: File | string;
  subImages: File[] | string[];
  short_description: string;
  stock: number;
  featured: boolean;
  totalProductPrice: number;
};

type InitialState = {
  isOpen: boolean;
  product: ProductItem;
  cart: ProductItem[];
  totalPrice: number;
  totalDiscount: number;
  totalAfterDiscount: number;
  openFloatingCart: boolean;
  searchTerm: string;
};

const loadState = (): InitialState => {
  try {
    const serializedState = localStorage.getItem("productState");
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const saveState = (state: InitialState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("productState", serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState: InitialState = {
  isOpen: false,
  openFloatingCart: false,
  searchTerm: "",
  cart: [],
  product: {
    id: 0,
    title: "",
    price: 0,
    stock: 0,
    image: "",
    description: "",
    short_description: "",
    featured: false,
    subImages: [""],
    category_id: 0,
    discount: 0,
    totalProductPrice: 0,
  },
  totalPrice: 0,
  totalDiscount: 0,
  totalAfterDiscount: 0,
};

const ProductSlice = createSlice({
  name: "product",
  initialState: loadState(),
  reducers: {
    triggerOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
      saveState(state);
    },
    triggerOpenfloatingCard(state, action: PayloadAction<boolean>) {
      state.openFloatingCart = action.payload;
      saveState(state);
    },
    setSerachTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      saveState(state);
    },
    addItem(state, action: PayloadAction<Product>) {
      const productInfo = action.payload;
      const existedProduct = state.cart.find(
        (item) => item.id === productInfo.id && item.title === productInfo.title
      );
      if (existedProduct) {
        existedProduct.stock += 1;
        existedProduct.totalProductPrice += existedProduct.price;
      } else {
        state.cart.push({
          ...productInfo,
          stock: 1,
          totalProductPrice: productInfo.price,
        });
      }
      calculateTotals(state);
      saveState(state);
    },
    increaseQuantity(
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) {
      const productId = action.payload;
      const existedProduct = state.cart.find(
        (item) => item.id === productId.id && item.title === productId.title
      );
      if (existedProduct) {
        existedProduct.stock += 1;
      }
      calculateTotals(state);
      saveState(state);
    },
    decreaseQuantity(
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) {
      const productId = action.payload;
      const existedProduct = state.cart.find(
        (item) => item.id === productId.id && item.title === productId.title
      );
      if (existedProduct) {
        if (existedProduct.stock > 1) {
          existedProduct.stock -= 1;
        } else {
          state.cart = state.cart.filter((item) => item !== existedProduct);
        }
      }
      calculateTotals(state);
      saveState(state);
    },
    removeItem(state, action: PayloadAction<{ id: number; title: string }>) {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (item) => item.id !== productId.id || item.title !== productId.title
      );
      calculateTotals(state);
      saveState(state);
    },
    sum(state) {
      calculateTotals(state);
      saveState(state);
    },
    calculateDiscount(state) {
      calculateTotals(state);
      saveState(state);
    },
    resetCart(state) {
      state.cart = [];
      state.totalAfterDiscount = 0;
      state.totalPrice = 0;
      state.totalDiscount = 0;
      saveState(state);
    },
  },
});

function calculateTotals(state: InitialState) {
  let totalPrice = 0;
  let totalDiscount = 0;
  let totalAfterDiscount = 0;

  state.cart.forEach((item) => {
    const itemTotal = item.price * item.stock;
    const itemDiscount = itemTotal * ((item.discount || 0) / 100);
    totalPrice += itemTotal;
    totalDiscount += itemDiscount;
    totalAfterDiscount += itemTotal - itemDiscount;
  });
  state.totalPrice = Number(totalPrice.toFixed(2));
  state.totalAfterDiscount = Number(totalAfterDiscount.toFixed(2));
  state.totalDiscount = Number(totalDiscount.toFixed(2));
}

export const {
  triggerOpen,
  addItem,
  decreaseQuantity,
  increaseQuantity,
  sum,
  removeItem,
  calculateDiscount,
  triggerOpenfloatingCard,
  setSerachTerm,
  resetCart,
} = ProductSlice.actions;

export default ProductSlice.reducer;
