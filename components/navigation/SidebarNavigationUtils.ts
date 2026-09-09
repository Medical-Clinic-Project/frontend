import type { Theme } from "@mui/material/styles";

export function getSidebarNavigationTransition(
  theme: Theme,
  collapsed: boolean,
  properties: string[],
) {
  return theme.transitions.create(properties, {
    easing: theme.transitions.easing.sharp,
    duration: collapsed
      ? theme.transitions.duration.leavingScreen
      : theme.transitions.duration.enteringScreen,
  });
}
