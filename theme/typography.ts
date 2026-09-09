import type { ThemeOptions } from "@mui/material/styles";

export const typography: ThemeOptions["typography"] = {
  fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  h1: {
    fontSize: "2.25rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.025em",
  },
  h2: {
    fontSize: "1.875rem",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: "1.25rem",
    fontWeight: 650,
    lineHeight: 1.35,
  },
  button: {
    fontWeight: 650,
    letterSpacing: 0,
    textTransform: "none",
  },
  body1: {
    lineHeight: 1.6,
  },
  body2: {
    lineHeight: 1.55,
  },
};
