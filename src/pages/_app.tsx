import type { AppType } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { api } from "~/utils/api";
import theme from "~/styles/theme";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
