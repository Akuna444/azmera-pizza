import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import StoreProvider from '@/app/providers/StoreProvider';

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout(props) {
  const { children } = props;
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <StoreProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider> </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
