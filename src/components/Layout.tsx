import { Outlet } from "react-router";
import BottomNav from "./BottomNav";
import DataResetNotice from "./DataResetNotice";
import { useState } from "react";

type LayoutProps = {
  dataWasCleared: boolean;
};

function Layout({ dataWasCleared }: LayoutProps) {
  const [isNoticeVisible, setIsNoticeVisible] = useState(dataWasCleared);
  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-120 px-5 pt-6 pb-28 sm:px-6">
        {isNoticeVisible && (
          <DataResetNotice onDismiss={() => setIsNoticeVisible(false)} />
        )}
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

export default Layout;
