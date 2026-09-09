"use client";

import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  type TextFieldProps,
} from "@mui/material";
import { AUTH_TEXT } from "@/views/auth/AuthText";

export function PasswordField(props: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const visibilityLabel = showPassword
    ? AUTH_TEXT.passwordVisibility.hide
    : AUTH_TEXT.passwordVisibility.show;

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={visibilityLabel}>
                <IconButton
                  aria-label={visibilityLabel}
                aria-pressed={showPassword}
                  edge="end"
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
