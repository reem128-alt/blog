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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LazyHomePage = lazy(() => import("./HomePage.tsx"));

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Master />,
    children: [
      {
        path: "/:lang",
        element: <LazyHomePage />,
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          />
        </QueryClientProvider>
      </Provider>
    </Suspense>
  </StrictMode>
);
