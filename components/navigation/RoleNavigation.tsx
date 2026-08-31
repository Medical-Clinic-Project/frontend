"use client";

import { AppBar, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import NextLink from "@/components/navigation/NextLink";

interface RoleNavigationItem {
  label: string;
  href: string;
  exact: boolean;
}

interface RoleNavigationProps {
  brand: string;
  section: string;
  ariaLabel: string;
  items: readonly RoleNavigationItem[];
}

export function RoleNavigation({
  brand,
  section,
  ariaLabel,
  items,
}: RoleNavigationProps) {
  const pathname = usePathname();

  return (
    <AppBar
      component="header"
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 3 }}
            useFlexGap
            sx={{
              width: "100%",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              py: { xs: 1.5, sm: 0 },
            }}
          >
            <Stack spacing={0}>
              <Typography variant="h6">{brand}</Typography>
              <Typography variant="caption" color="text.secondary">
                {section}
              </Typography>
            </Stack>

            <Stack
              component="nav"
              direction="row"
              spacing={1}
              useFlexGap
              aria-label={ariaLabel}
              sx={{ flexWrap: "wrap" }}
            >
              {items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                return (
                  <Button
                    key={item.href}
                    component={NextLink}
                    href={item.href}
                    size="small"
                    variant={isActive ? "contained" : "text"}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
