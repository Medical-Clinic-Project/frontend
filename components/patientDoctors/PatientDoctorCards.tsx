import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { APP_ROUTES } from "@/constants/routes";
import NextLink from "@/components/navigation/NextLink";
import type { PatientDoctor } from "@/types/patientDoctor";
import { PATIENT_DOCTORS_TEXT } from "@/views/patientDoctors/PatientDoctorsText";

interface PatientDoctorCardsProps {
  doctors: readonly PatientDoctor[];
}

export function PatientDoctorCards({ doctors }: PatientDoctorCardsProps) {
  return (
    <Stack
      component="ul"
      spacing={2}
      sx={{ listStyle: "none", p: 0, m: 0 }}
    >
      {doctors.map((doctor) => (
        <Card component="li" key={doctor.id}>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography component="h2" variant="h5">
                {doctor.fullName}
              </Typography>
              <Chip label={doctor.departmentName} size="small" sx={{ alignSelf: "flex-start" }} />
            </Stack>
          </CardContent>
          <CardActions>
            <Stack direction="row" sx={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                component={NextLink}
                href={APP_ROUTES.patientDoctorDetails(doctor.id)}
                variant="text"
                endIcon={<ArrowForwardOutlinedIcon />}
              >
                {PATIENT_DOCTORS_TEXT.detailsAction}
              </Button>
            </Stack>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );
}
