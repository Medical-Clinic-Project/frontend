import { Button, Stack, TextField, Typography } from "@mui/material";
import { DEPARTMENTS_TEXT } from "@/views/departments/Departments.text";

interface DepartmentsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onCreate: () => void;
}

export function DepartmentsHeader({
  search,
  onSearchChange,
  onCreate,
}: DepartmentsHeaderProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography color="primary.main" sx={{ fontWeight: 700 }}>
          {DEPARTMENTS_TEXT.eyebrow}
        </Typography>
        <Typography component="h1" variant="h2">
          {DEPARTMENTS_TEXT.title}
        </Typography>
        <Typography color="text.secondary">{DEPARTMENTS_TEXT.subtitle}</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          label={DEPARTMENTS_TEXT.searchLabel}
          placeholder={DEPARTMENTS_TEXT.searchPlaceholder}
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ flex: 1 }}
        />
        <Button size="small" onClick={onCreate}>
          {DEPARTMENTS_TEXT.createAction}
        </Button>
      </Stack>
    </Stack>
  );
}
