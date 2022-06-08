import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const theme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: "#16161D",
        _dark: "#ade3b8",
      },
      heroGradientStart: {
        default: "#7928CA",
        _dark: "#e3a7f9",
      },
      heroGradientEnd: {
        default: "#FF0080",
        _dark: "#fbec8f",
      },
    },
    radii: {
      button: "12px",
    },
  },
  colors: {
    black: "#16161D",
  },
  // fonts: {
  //   mono: `'Montserrat', sans-serif`,
  //   heading: `'Montserrat', sans-serif`,
  //   body: `'Montserrat', sans-serif`,
  // },
  breakpoints,
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
