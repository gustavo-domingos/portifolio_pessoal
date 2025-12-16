import { Box, Stack } from "@mui/material";
import { Hero } from "./Hero";
import { About } from "./About";
import { Header } from "./Header";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { motion } from "framer-motion";


export function Home() {
  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header/>
      
      <Box
        maxWidth="xl"
        mx="auto"
        px={{ xs: 2, sm: 4 }}
        pt={6}
      >
        <Box
          display="flex"
          width="100%"
          flexDirection={{ xs: "column", md: "row" }}
          gap={6}
          justifyContent="center" 
        >
          <Box flex={{ md: 1 }} width="100%">
            <Hero />
          </Box>

          <Box
            flex={{ md: 1 }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            width="100%"
          >
            <Stack spacing={2}> 
              <About />
              <Experience />
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box 
        maxWidth="lg" 
        mx="auto" 
        px={{ xs: 2, sm: 4 }}
        mt={1} 
        mb={6}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Projects />
      </Box>
    </Box>
  );
}