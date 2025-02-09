import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { Master } from "./layouts/master/Master.tsx";
import Loading from "./components/loading.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { languages } from "./i18n.ts";
import ProtectRoute from "./components/protectRoute.tsx";

const LazyHomePage = lazy(() => import("./HomePage.tsx"));
const LazySignIn = lazy(() => import("./pages/sigin.tsx"));
const LazySignUp = lazy(() => import("./pages/signup.tsx"));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Master />,
    children: [
      {
        path: "/:lang",
        element:
        <ProtectRoute> 
          <LazyHomePage />
          </ProtectRoute>
        
      },
      {
        path: "/:lang/signin",
        element: <LazySignIn />,
      },
      {
        path: "/:lang/signup",
        element: <LazySignUp />,
      },
      {
        path: "/",
        element: <Navigate to={`/${languages[0]}`} />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </Suspense>
  </StrictMode>
);
