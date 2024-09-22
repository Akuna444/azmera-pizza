"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Router } from "@toolpad/core";
import {
  LocalPizza,
  People,
  SupervisedUserCircleOutlined,
  AddBoxRounded,
} from "@mui/icons-material";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function DashboardLayoutNavigationLinks({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = React.useState("/dashboard");

  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return (
    // preview-start
    <AppProvider
      navigation={[
        {
          segment: "dashboard",
          title: "Orders",
          icon: <AddBoxRounded />,
        },
        {
          segment: "add-menu",
          title: "Add Menu",
          icon: <LocalPizza />,
        },
        {
          segment: "roles",
          title: "Role",
          icon: <SupervisedUserCircleOutlined />,
        },
        {
          segment: "users",
          title: "Users",
          icon: <People />,
        },
      ]}
      branding={{
        title: "Pizza",
      }}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout>
        <Box
          sx={{
            p: 2,
          }}
        >
          {children}
        </Box>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
