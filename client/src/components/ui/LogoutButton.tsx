"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/features/authActions/userAuthActions";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/signin");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
