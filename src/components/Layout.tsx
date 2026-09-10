import { Outlet } from "react-router";
import BottomNav from "./BottomNav";

function Layout() {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-120 px-5 pt-6 pb-28 sm:px-6">
        <Outlet/>
      </div>
      <BottomNav/>
    </div>
  );
}

export default Layout;
