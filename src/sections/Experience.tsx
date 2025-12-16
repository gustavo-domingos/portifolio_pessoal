import { Box, Typography } from "@mui/material";

export function Experience() {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Experiência
      </Typography>

      <Box mt={2}>
        <Typography variant="h6" fontWeight="medium">
          Desenvolvedor Full Stack
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lince Tech - 04/2023 - 04/2025
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Desenvolvimento e manutenção de sistemas ERP utilizando Java, JavaScript, Live server SQL, HTML, Jquery e HTML
        </Typography>
      </Box>
    </Box>
  );
}