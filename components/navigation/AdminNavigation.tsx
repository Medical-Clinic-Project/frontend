"use client";

import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";

import NextLink from "@/components/navigation/NextLink";
import {
  ADMIN_NAVIGATION_DRAWER_WIDTH,
  ADMIN_NAVIGATION_ITEMS,
  ADMIN_NAVIGATION_TEXT,
} from "@/constants/navigation";

interface AdminNavigationLinksProps {
  onNavigate?: () => void;
  pathname: string;
}

function AdminNavigationLinks({
  onNavigate,
  pathname,
}: AdminNavigationLinksProps) {
  return (
    <List
      component="nav"
      aria-label={ADMIN_NAVIGATION_TEXT.ariaLabel}
      disablePadding
    >
      {ADMIN_NAVIGATION_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

        const Icon = item.icon;

        return (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={NextLink}
              href={item.href}
              selected={isActive}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

function AdminNavigationDrawerContent({
  onNavigate,
  pathname,
}: AdminNavigationLinksProps) {
  return (
    <Stack sx={{ height: "100%" }}>
      <Toolbar>
        <Stack spacing={0}>
          <Typography variant="h6">
            {ADMIN_NAVIGATION_TEXT.brand}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {ADMIN_NAVIGATION_TEXT.section}
          </Typography>
        </Stack>
      </Toolbar>

      <Divider />

      <AdminNavigationLinks
        pathname={pathname}
        onNavigate={onNavigate}
      />
    </Stack>
  );
}

export function AdminNavigation() {
  const pathname = usePathname();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] =
    useState(false);

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        component="header"
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          display: { xs: "flex", md: "none" },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label={ADMIN_NAVIGATION_TEXT.menuLabel}
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <MenuOutlinedIcon />
          </IconButton>

          <Typography variant="h6">
            {ADMIN_NAVIGATION_TEXT.brand}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: ADMIN_NAVIGATION_DRAWER_WIDTH,
          flexShrink: 0,
        }}
        slotProps={{
          paper: {
            component: "aside",
            "aria-label": ADMIN_NAVIGATION_TEXT.ariaLabel,
          },
        }}
      >
        <AdminNavigationDrawerContent pathname={pathname} />
      </Drawer>

      <Drawer
        variant="temporary"
        open={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        sx={{
          display: { xs: "block", md: "none" },
        }}
        slotProps={{
          paper: {
            component: "aside",
            "aria-label": ADMIN_NAVIGATION_TEXT.ariaLabel,
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "flex-end" }}
        >
          <IconButton
            aria-label={ADMIN_NAVIGATION_TEXT.closeMenuLabel}
            onClick={closeMobileDrawer}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Stack>

        <AdminNavigationDrawerContent
          pathname={pathname}
          onNavigate={closeMobileDrawer}
        />
      </Drawer>
    </>
  );
}
