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

interface SidebarNavigationText {
  ariaLabel: string;
  brand: string;
  closeMenuLabel: string;
  menuLabel: string;
  section: string;
}

interface SidebarNavigationItem {
  exact: boolean;
  href: string;
  icon: (typeof ADMIN_NAVIGATION_ITEMS)[number]["icon"];
  label: string;
}

interface SidebarNavigationLinksProps {
  onNavigate?: () => void;
  pathname: string;
  items: readonly SidebarNavigationItem[];
  text: SidebarNavigationText;
}

function SidebarNavigationLinks({
  onNavigate,
  pathname,
  items,
  text,
}: SidebarNavigationLinksProps) {
  return (
    <List
      component="nav"
      aria-label={text.ariaLabel}
      disablePadding
    >
      {items.map((item) => {
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

function SidebarNavigationDrawerContent({
  onNavigate,
  pathname,
  items,
  text,
}: SidebarNavigationLinksProps) {
  return (
    <Stack sx={{ height: "100%" }}>
      <Toolbar>
        <Stack spacing={0}>
          <Typography variant="h6">
            {text.brand}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {text.section}
          </Typography>
        </Stack>
      </Toolbar>

      <Divider />

      <SidebarNavigationLinks
        pathname={pathname}
        onNavigate={onNavigate}
        items={items}
        text={text}
      />
    </Stack>
  );
}

interface SidebarNavigationProps {
  items: readonly SidebarNavigationItem[];
  text: SidebarNavigationText;
}

export function SidebarNavigation({
  items,
  text,
}: SidebarNavigationProps) {
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
            aria-label={text.menuLabel}
            onClick={() => setIsMobileDrawerOpen(true)}
          >
            <MenuOutlinedIcon />
          </IconButton>

          <Typography variant="h6">
            {text.brand}
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
            "aria-label": text.ariaLabel,
          },
        }}
      >
        <SidebarNavigationDrawerContent
          pathname={pathname}
          items={items}
          text={text}
        />
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
            "aria-label": text.ariaLabel,
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "flex-end" }}
        >
          <IconButton
            aria-label={text.closeMenuLabel}
            onClick={closeMobileDrawer}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Stack>

        <SidebarNavigationDrawerContent
          pathname={pathname}
          onNavigate={closeMobileDrawer}
          items={items}
          text={text}
        />
      </Drawer>
    </>
  );
}

export function AdminNavigation() {
  return (
    <SidebarNavigation
      items={ADMIN_NAVIGATION_ITEMS}
      text={ADMIN_NAVIGATION_TEXT}
    />
  );
}
