"use client";

import { useState } from "react";
import {
  InputAdornment,
  Link,
  TextField,
  type TextFieldProps,
} from "@mui/material";

const PASSWORD_VISIBILITY_TEXT = {
  show: "Show",
  hide: "Hide",
} as const;

export function PasswordField(props: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

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
              <Link
                component="button"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword
                  ? PASSWORD_VISIBILITY_TEXT.hide
                  : PASSWORD_VISIBILITY_TEXT.show}
              </Link>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
