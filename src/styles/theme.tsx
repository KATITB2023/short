import { extendTheme } from "@chakra-ui/react";
import { colors } from "~/styles/component/colors";
import { Button } from "~/styles/component/button";
import { Input } from "~/styles/component/input";

const theme = extendTheme({
  fonts: {
    heading: "Bodwars",
    body: "SomarRounded-Regular",
  },
  colors,
  styles: {
    global: {
      body: {
        bg: "navy.1",
        color: "orange",
      },
      "*": {
        "&::-webkit-scrollbar": {
          w: "2",
          h: "1.5",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "orange",
          boxShadow: "inset 0 0 7px black",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "green.1",
          boxShadow: "inset 0 0 2px black",
          borderRadius: "4",
        },
      },
    },
  },
  components: {
    Button,
    Input,
  },
});

export default theme;
