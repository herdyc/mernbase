import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AnimationIcon from "@mui/icons-material/Animation";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* HERO */}
      <Box
        sx={{
          py: { xs: 8, md: 14 },
          background:
            `radial-gradient(1200px 600px at -10% -10%, ${theme.palette.primary.light}15, transparent 60%),
             radial-gradient(1200px 600px at 110% 110%, ${theme.palette.secondary.light}15, transparent 60%)`,
        }}
      >
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h2" fontWeight={900} sx={{ lineHeight: 1.05 }}>
              Build fast. Ship pretty. <br /> Scale with confidence.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
              A modern starter with a professional authentication flow and clean UI.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to="/auth?mode=signup"
                endIcon={<RocketLaunchIcon />}
              >
                Get started
              </Button>
              <Button
                size="large"
                variant="outlined"
                component={RouterLink}
                to="/auth?mode=login"
                endIcon={<SecurityIcon />}
              >
                Log in
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box id="features" sx={{ py: { xs: 6, md: 10 } }}>
        <Container>
          <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 4 }}>
            Features
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <SpeedIcon />,
                title: "Performance-first",
                desc: "No CSS bloat. MUI only. Fast-first rendering and clean code structure.",
              },
              {
                icon: <AutoFixHighIcon />,
                title: "Beautiful by default",
                desc: "Thoughtful spacing, consistent typography, and subtle motion out of the box.",
              },
              {
                icon: <VerifiedUserIcon />,
                title: "Secure Auth",
                desc: "Login & signup flows ready for JWT or cookie sessions with sane defaults.",
              },
              {
                icon: <AnimationIcon />,
                title: "Smooth Motion",
                desc: "Framer Motion for tasteful transitions that don’t get in your way.",
              },
            ].map((f, i) => (
              <Grid key={f.title} item xs={12} sm={6} md={3}>
                <MotionCard
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 16 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  elevation={3}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: (t) => `1px solid ${t.palette.divider}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ fontSize: 36, mb: 1.5, color: "primary.main" }}>{f.icon}</Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.desc}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ABOUT */}
      <Box id="about" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h3" fontWeight={800} gutterBottom>
                  About Us
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  We build reliable, elegant frontends with enterprise pragmatism. This template is a
                  solid foundation for real products: clean architecture, accessible components, and a
                  secure authentication flow wired for <b>http://localhost:5000</b>.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Extend the sections, plug in your backend, and ship. No yak shaving required.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="contained" component={RouterLink} to="/auth?mode=signup">
                    Start free
                  </Button>
                  <Button variant="outlined" component={RouterLink} to="/dashboard">
                    View dashboard
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 16 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  boxShadow: 3,
                  minHeight: 220,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Drop your product screenshot or chart here.
                </Typography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
