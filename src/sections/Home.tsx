import { Box, Stack } from "@mui/material";
import { Hero } from "./Hero";
import { About } from "./About";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { motion } from "framer-motion";


export function Home() {
  return (
    <Box sx={{ minWidth: "100vw", overflowX: "hidden" }}>
      <Box
        maxWidth="xl"
        mx="auto"
        px={4}
        pt={6}
      >
        <Box
          display="flex"
          width="100%"
          flexDirection={{ xs: "column", md: "row" }}
          gap={6}
          alignItems="flex-start"
        >
          <Box flex={1} width="100%">
            <Hero />
          </Box>

          <Box
            flex={1}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            width="100%"
            pt={4}
          >
            <Stack spacing={1} >
              <About />
              <Experience />
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box mt={1} mb={1}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Projects />
      </Box>

      <Box mt={1} mb={1} 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      </Box>
    </Box>
  );
}