import { Outlet } from "react-router";

export const Master = () => {
  
  return (
    <div>
      
      <main className="flex flex-col min-h-screen w-full sm:w-full md:w-full lg:w-full xl:w-full bg-white ">
        <Outlet />
      </main>
      
    </div>
  );
};
