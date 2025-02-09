import { Outlet } from "react-router";
import { Cookies } from "../../contexts/Cookies";
import { ThemeProvider } from "../../contexts/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RootLayout = () => {
  return (
    <Cookies>
      <ThemeProvider>
        <ToastContainer
          className="w-32 h-12 z-10"
          position="top-left"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Outlet  />
      </ThemeProvider>
    </Cookies>
  );
};
