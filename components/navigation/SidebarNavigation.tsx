"use client";

import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  AppBar,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import {
  SidebarNavigationDrawerContent,
  type SidebarNavigationItem,
  type SidebarNavigationText,
} from "@/components/navigation/SidebarNavigationDrawerContent";
import { getSidebarNavigationTransition } from "@/components/navigation/SidebarNavigationUtils";
import { SIDEBAR_NAVIGATION_DRAWER_WIDTH } from "@/constants/navigation";
import { useLogout } from "@/hooks/useLogout";

interface SidebarNavigationProps {
  items: readonly SidebarNavigationItem[];
  text: SidebarNavigationText;
}

export function SidebarNavigation({ items, text }: SidebarNavigationProps) {
  const pathname = usePathname();
  const { isLoggingOut, logout } = useLogout();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((collapsed) => !collapsed);
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

          <Typography variant="h6">{text.brand}</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open
        sx={(theme) => {
          const drawerWidth = isDesktopCollapsed
            ? theme.spacing(9)
            : SIDEBAR_NAVIGATION_DRAWER_WIDTH;
          const transition = getSidebarNavigationTransition(
            theme,
            isDesktopCollapsed,
            ["width"],
          );

          return {
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            transition,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
              overflowX: "hidden",
              transition,
            },
          };
        }}
        slotProps={{
          paper: {
            component: "aside",
            "aria-label": text.ariaLabel,
          },
        }}
      >
        <SidebarNavigationDrawerContent
          collapsed={isDesktopCollapsed}
          isLoggingOut={isLoggingOut}
          pathname={pathname}
          items={items}
          text={text}
          onSignOut={() => void logout()}
          onToggleCollapse={toggleDesktopCollapse}
        />
      </Drawer>

      <Drawer
        variant="temporary"
        open={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_NAVIGATION_DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        slotProps={{
          paper: {
            component: "aside",
            "aria-label": text.ariaLabel,
          },
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
          <IconButton aria-label={text.closeMenuLabel} onClick={closeMobileDrawer}>
            <CloseOutlinedIcon />
          </IconButton>
        </Stack>

        <SidebarNavigationDrawerContent
          collapsed={false}
          isLoggingOut={isLoggingOut}
          pathname={pathname}
          onNavigate={closeMobileDrawer}
          items={items}
          text={text}
          onSignOut={() => void logout()}
        />
      </Drawer>
    </>
  );
}
