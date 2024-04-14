import React, { Suspense } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import ShimmerList from "./ShimmerUI";

const Layout = () => {
  return (
    <main>
      <Header />
      <Suspense fallback={<ShimmerList />} />
      <Outlet />
    </main>
  );
};

export default Layout;
