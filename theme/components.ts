import { alpha, type Components, type Theme } from "@mui/material/styles";

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      body: {
        minHeight: "100dvh",
        backgroundImage: `radial-gradient(circle at top right, ${alpha(
          theme.palette.primary.light,
          0.14,
        )}, transparent 34rem)`,
      },
    }),
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      variant: "contained",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: theme.spacing(6),
        borderRadius: theme.shape.borderRadius,
        paddingInline: theme.spacing(2.5),
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      fullWidth: true,
      variant: "outlined",
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create(["box-shadow", "border-color"]),
        "&.Mui-focused": {
          boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }),
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        borderRadius:
          typeof theme.shape.borderRadius === "number"
            ? theme.shape.borderRadius * 2
            : theme.shape.borderRadius,
      }),
    },
  },
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius:
          typeof theme.shape.borderRadius === "number"
            ? theme.shape.borderRadius * 2
            : theme.shape.borderRadius,
      }),
    },
  },
  MuiAlert: {
    defaultProps: {
      variant: "outlined",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        alignItems: "center",
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "hover",
    },
    styleOverrides: {
      root: {
        fontWeight: 650,
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
};
