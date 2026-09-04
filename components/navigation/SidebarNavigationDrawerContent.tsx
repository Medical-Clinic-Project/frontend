"use client";

import { type ElementType, type ReactNode } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import NextLink from "@/components/navigation/NextLink";
import { getSidebarNavigationTransition } from "@/components/navigation/SidebarNavigationUtils";
import { SIDEBAR_NAVIGATION_DRAWER_WIDTH } from "@/constants/navigation";

export interface SidebarNavigationText {
  ariaLabel: string;
  brand: string;
  closeMenuLabel: string;
  collapseLabel: string;
  expandLabel: string;
  menuLabel: string;
  section: string;
  signOutLabel: string;
  signingOutLabel: string;
}

export interface SidebarNavigationItem {
  exact: boolean;
  href: string;
  icon: ElementType;
  label: string;
}

interface SidebarNavigationLinksProps {
  collapsed: boolean;
  items: readonly SidebarNavigationItem[];
  onNavigate?: () => void;
  pathname: string;
  text: SidebarNavigationText;
}

export interface SidebarNavigationDrawerContentProps
  extends SidebarNavigationLinksProps {
  isLoggingOut: boolean;
  onSignOut: () => void;
  onToggleCollapse?: () => void;
}

function CollapsibleLabel({
  children,
  collapsed,
}: {
  children: ReactNode;
  collapsed: boolean;
}) {
  return (
    <Stack
      sx={(theme) => ({
        minWidth: 0,
        maxWidth: collapsed ? 0 : SIDEBAR_NAVIGATION_DRAWER_WIDTH,
        overflow: "hidden",
        opacity: collapsed ? 0 : 1,
        transition: getSidebarNavigationTransition(theme, collapsed, [
          "max-width",
          "opacity",
        ]),
      })}
    >
      {children}
    </Stack>
  );
}

function SidebarNavigationLinks({
  collapsed,
  onNavigate,
  pathname,
  items,
  text,
}: SidebarNavigationLinksProps) {
  return (
    <List component="nav" aria-label={text.ariaLabel} disablePadding>
      {items.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <ListItem key={item.href} disablePadding>
            <Tooltip
              title={item.label}
              placement="right"
              disableFocusListener={!collapsed}
              disableHoverListener={!collapsed}
              disableTouchListener={!collapsed}
            >
              <ListItemButton
                component={NextLink}
                href={item.href}
                selected={isActive}
                aria-current={isActive ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                onClick={onNavigate}
                sx={{
                  gap: collapsed ? 0 : 1,
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({
                    minWidth: collapsed ? 0 : theme.spacing(5),
                    justifyContent: "center",
                    color: "inherit",
                    transition: getSidebarNavigationTransition(theme, collapsed, [
                      "min-width",
                    ]),
                  })}
                >
                  <Icon />
                </ListItemIcon>

                <CollapsibleLabel collapsed={collapsed}>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { noWrap: true } }}
                  />
                </CollapsibleLabel>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
}

export function SidebarNavigationDrawerContent({
  collapsed,
  isLoggingOut,
  items,
  onNavigate,
  onSignOut,
  onToggleCollapse,
  pathname,
  text,
}: SidebarNavigationDrawerContentProps) {
  const toggleLabel = collapsed ? text.expandLabel : text.collapseLabel;
  const signOutLabel = isLoggingOut ? text.signingOutLabel : text.signOutLabel;

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0, minWidth: 0 }}>
      <Toolbar
        sx={{
          gap: collapsed ? 0 : 1,
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        <CollapsibleLabel collapsed={collapsed}>
          <Stack spacing={0}>
            <Typography variant="h6" noWrap>
              {text.brand}
            </Typography>

            <Typography variant="caption" color="text.secondary" noWrap>
              {text.section}
            </Typography>
          </Stack>
        </CollapsibleLabel>

        {onToggleCollapse && (
          <Tooltip title={toggleLabel} placement="right">
            <IconButton aria-label={toggleLabel} onClick={onToggleCollapse}>
              {collapsed ? <ChevronRightOutlinedIcon /> : <ChevronLeftOutlinedIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Divider />

      <SidebarNavigationLinks
        collapsed={collapsed}
        pathname={pathname}
        onNavigate={onNavigate}
        items={items}
        text={text}
      />

      <Stack component="footer" sx={{ mt: "auto" }}>
        <Divider />

        <List disablePadding>
          <ListItem disablePadding>
            <Tooltip
              title={signOutLabel}
              placement="right"
              disableFocusListener={!collapsed || isLoggingOut}
              disableHoverListener={!collapsed || isLoggingOut}
              disableTouchListener={!collapsed || isLoggingOut}
            >
              <ListItemButton
                aria-label={text.signOutLabel}
                disabled={isLoggingOut}
                onClick={onSignOut}
                sx={{
                  gap: collapsed ? 0 : 1,
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={(theme) => ({
                    minWidth: collapsed ? 0 : theme.spacing(5),
                    justifyContent: "center",
                    color: "inherit",
                    transition: getSidebarNavigationTransition(theme, collapsed, [
                      "min-width",
                    ]),
                  })}
                >
                  {isLoggingOut ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LogoutOutlinedIcon />
                  )}
                </ListItemIcon>

                <CollapsibleLabel collapsed={collapsed}>
                  <ListItemText
                    primary={signOutLabel}
                    slotProps={{ primary: { noWrap: true } }}
                  />
                </CollapsibleLabel>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Stack>
    </Stack>
  );
}
