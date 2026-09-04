import type { Theme } from "@mui/material/styles";

export function getDashboardCategoryColors(
  theme: Theme,
  categories: readonly string[],
): string[] {
  const palette = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
  ];
  const colorsByCategory = new Map(
    [...new Set(categories)]
      .sort((first, second) => first.localeCompare(second))
      .map((category, index) => [
        category,
        palette[index % palette.length]!,
      ]),
  );

  return categories.map(
    (category) => colorsByCategory.get(category) ?? theme.palette.primary.main,
  );
}
