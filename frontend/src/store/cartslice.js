import { createSlice }  from "@reduxjs/toolkit";

const InitialState = {
    items: JSON.parse(localStorage.getItem("cart")) || [],

};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const exist = state.item.find((p) => p.id === item.id);

            if(exist){
                exist.quantity += 1;
            }else{
                state.item.push({...item,quantity: 1});

            }

            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter((p) => p.id !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        increaseQty: (state, action) => {
            const item = state.items.find((p) => p.id === action.payload);
            if(item) item.quantity += 1;
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        decreaseQty: (state, action) => {
            const item = state.items.find((p) => p.id === action.payload);
            if(item && item.quantity > 1) item.quantity -= 1;
            localStorage.setItem("cart", JSON.stringify(state.items));
        },
    },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;