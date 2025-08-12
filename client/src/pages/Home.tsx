import React from "react";
import { Box, Button, Container, Stack, Typography, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        background:
          `radial-gradient(1200px 600px at -10% -10%, ${theme.palette.primary.light}15, transparent 60%),
           radial-gradient(1200px 600px at 110% 110%, ${theme.palette.secondary.light}15, transparent 60%)`,
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          px: { xs: 2, md: 4 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          YourApp
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="text" onClick={() => navigate("/auth?mode=login")}>Log in</Button>
          <Button
            variant="contained"
            onClick={() => navigate("/auth?mode=signup")}
            endIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Container component="main" sx={{ py: { xs: 6, md: 12 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: 680 }}>
            <Typography variant="h2" fontWeight={800} gutterBottom sx={{ lineHeight: 1.1 }}>
              Launch faster. Look sharper. <br /> Auth that just works.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              A modern starter with enterprise-grade authentication UX, built on MUI.
              Clean, accessible, and production-ready.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate("/auth?mode=signup")}
                endIcon={<RocketLaunchIcon />}
              >
                Create account
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => navigate("/auth?mode=login")}
                endIcon={<SecurityIcon />}
              >
                Log in
              </Button>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ mt: 5 }} alignItems="center">
              <TrendingUpIcon color="primary" />
              <Typography variant="body1" color="text.secondary">
                Built for performance & clarity. Zero CSS thrash, all MUI.
              </Typography>
            </Stack>
          </Box>

          {/* Right visual block */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: 520,
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Quick peek
            </Typography>
            <Box
              sx={{
                borderRadius: 3,
                height: 320,
                border: `1px dashed ${theme.palette.divider}`,
                display: "grid",
                placeItems: "center",
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Replace with your product preview / chart / screenshot
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, px: { xs: 2, md: 4 }, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
