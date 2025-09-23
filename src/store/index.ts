import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./ProductReducer";
import authReducer from "./userReducer";

const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
