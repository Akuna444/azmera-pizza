"use client";
import { useSelector } from "react-redux";

import OrderTable from "./components/tables/orders-table";

const Dashboard = () => {
  const data = useSelector((state) => state.userAuth);
  console.log(data, "daytayu");
  return (
    <>
      <OrderTable />
    </>
  );
};

export default Dashboard;
