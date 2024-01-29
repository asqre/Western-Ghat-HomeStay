import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@material-tailwind/react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider>
        <Toaster richColors position="top-right" />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
