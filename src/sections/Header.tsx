import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';


export function Header() {
  const whatsappUrl = "https://wa.me/5547992434138"; 

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      component={motion.div}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl"> 
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          component="a"
          href="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            cursor: 'pointer' 
          }}
        >
          Gustavo
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          
          <Button 
            color="inherit" 
            href="https://github.com/gustavo-domingos" 
            target="_blank" 
            rel="noopener noreferrer"
            startIcon={<GitHubIcon/>}
          >
            GitHub
          </Button>

          <Button 
            color="inherit" 
            href="https://www.linkedin.com/in/gustavo-alves-da-silva1" 
            target="_blank" 
            rel="noopener noreferrer"
            startIcon={<LinkedInIcon />}
          >
            LinkedIn
          </Button>

          <Button 
            color="inherit" 
            href="mailto:alvesdasilvag185@gmail.com"
            startIcon={<MailOutlineIcon />}
          >
            E-mail
          </Button>

          <Button 
            variant="contained"
            size="small"
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
          >
            WhatsApp
          </Button>
        </Box>
        
      </Toolbar>
      </Container>
    </AppBar>
  )
}