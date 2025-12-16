import { Box, Typography } from "@mui/material";

export function About() {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Sobre mim
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
Full-Stack Developer com formação em Análise e Desenvolvimento de Sistemas e 2 anos de atuação na Lince Tech. Experiência completa no desenvolvimento e manutenção de sistemas ERP, utilizando Java e JavaScript. Proficiente em metodologias ágeis (Kanban) e ferramentas de desenvolvimento (Git/GitHub). Focado em trabalhar em equipe para aplicar minhas habilidades na otimização e melhoria contínua de sistemas complexos.
      </Typography>
    </Box>
  );
}