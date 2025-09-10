import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskReducer";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
