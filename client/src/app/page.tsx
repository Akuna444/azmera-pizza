"use client";

import LogoutButton from "@/components/ui/LogoutButton";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.userAuth);

  return (
    <div>
      Home <LogoutButton />
    </div>
  );
}
