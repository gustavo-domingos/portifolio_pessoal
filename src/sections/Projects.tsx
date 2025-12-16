import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

const projects = [
  { 
    title: "CRM Delice", 
    desc: "Sistema de Gerenciamento de Clientes (CRM) feito em colaboração com Lucas Vicenti e Kaua Melchioretto. Stack: Kotlin, Spring Boot, Exposed, JWT, ZoHo, Docker (Backend) e React, Vite, MUI, TypeScript (Frontend).",
    siteLink: "https://crm-delice-webservice.onrender.com/app/login",
    repoBack: "https://github.com/LucasVicenti12/rex_project_back",
    repoFront: "https://github.com/KauaMelchioretto/crm-delice-front"
  },
  { 
    title: "Portfólio Pessoal", 
    desc: "Este próprio site, construído para demonstrar habilidades em desenvolvimento frontend. Tecnologias utilizadas: React, Vite, Material UI (MUI) e animações com Framer Motion.",
    siteLink: "https://gustavo-domingos.github.io/",
    repoFront: "https://github.com/gustavo-domingos/gustavo-domingos.github.io",
  },
  { 
    title: "Horas Complementares", 
    desc: "Sistema de gestão para simplificar a burocracia de horas complementares em instituições de ensino. API robusta construída com Java e Spring Boot, focada em otimizar o processo para alunos e professores.",
    repoBack: "https://github.com/gustavo-domingos/aquarus-back-project/tree/master/complementary-activities",
  },
  { 
    title: "Mensageria", 
    desc: "Sistema simples de mensageria para envio de e-mails, com API em Spring Boot e UI em React. Totalmente containerizado usando Docker e Docker Compose, demonstrando habilidades de full-stack e deployment.",
    repoBack: "https://github.com/gustavo-domingos/superman-messaging",
  }
];

export function Projects() {
  return (
    <Box id="projects-section" maxWidth="xl" mx="auto" px={4} py={8}>
      <Typography variant="h4" fontWeight="bold" mb={6} textAlign="center">
        Projetos
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="stretch"
        gap={4}
        flexWrap="wrap"
      >
        {projects.map((project, index) => (
          <Box
            key={index}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 calc(25% - 32px)" },
              minWidth: { xs: "100%", sm: "300px" },
            }}
          >
            <Card
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              sx={{
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                p: 1
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {project.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.desc}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    
                    {project.siteLink && (
                        <Button 
                            variant="contained" 
                            size="small" 
                            href={project.siteLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Ver Site
                        </Button>
                    )}

                    {project.repoBack && (
                        <Button 
                            variant="outlined" 
                            size="small" 
                            href={project.repoBack} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Back-end
                        </Button>
                    )}
                    
                    {project.repoFront && (
                        <Button 
                            variant="outlined" 
                            size="small" 
                            href={project.repoFront} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            // startIcon={<GitHub />}
                        >
                            Front-end
                        </Button>
                    )}
                    
                    {!project.siteLink && !project.repoBack && !project.repoFront && (
                        <Button variant="outlined" size="small">
                            Ver Projeto
                        </Button>
                    )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}