import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      py={4}
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      textAlign="left"
      width="100%"
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Gustavo Alves
      </Typography>

      <Typography variant="h5" color="text.secondary" mt={1}>
        Desenvolvedor Full Stack
      </Typography>

      <Typography variant="body1" maxWidth={500} mt={3} color="text.secondary">
        Especializado em React, Java, TypeScript e sistemas ERP.
      </Typography>

      <Button
          variant="contained"
          size="large"
          sx={{ mt: 4, borderRadius: 2, px: 4 }}
          href="https://github.com/gustavo-domingos/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver Projetos
        </Button>
    </Box>
  );
}