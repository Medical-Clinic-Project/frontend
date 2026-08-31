import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { DEPARTMENTS_TEXT } from "@/views/departments/DepartmentsText";

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
        <Typography variant="subtitle2" color="primary.main">
          {DEPARTMENTS_TEXT.eyebrow}
        </Typography>
        <Typography variant="h1">{DEPARTMENTS_TEXT.title}</Typography>
        <Typography color="text.secondary">{DEPARTMENTS_TEXT.subtitle}</Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        sx={{
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
        <Button size="small" startIcon={<AddOutlinedIcon />} onClick={onCreate}>
          {DEPARTMENTS_TEXT.createAction}
        </Button>
      </Stack>
    </Stack>
  );
}
