import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation } from "react-router-dom";

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NavButton = ({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active?: boolean;
}) => (
  <Button
    component={RouterLink}
    to={to}
    sx={{
      color: "inherit",
      opacity: active ? 1 : 0.8,
      fontWeight: active ? 700 : 500,
      "&:hover": { opacity: 1 },
    }}
  >
    {label}
  </Button>
);

const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { pathname, hash } = useLocation();

  const isActive = (target: string) =>
    pathname + hash === target || pathname === target;

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(0,9,87,0.9)",
            backdropFilter: "blur(6px)",
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{ textDecoration: "none", color: "inherit", fontWeight: 800, letterSpacing: 0.3 }}
              >
                YourApp.io
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
              <NavButton to="/#about" label="About" active={isActive("/#about")} />
              <NavButton to="/#features" label="Features" active={isActive("/#features")} />
              <NavButton to="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
              <Divider orientation="vertical" flexItem sx={{ mx: 1.5, opacity: 0.2 }} />
              <Button color="inherit" component={RouterLink} to="/auth?mode=login" sx={{ mr: 0.5 }}>
                Log in
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/auth?mode=signup"
                sx={{ fontWeight: 700 }}
              >
                Sign up
              </Button>
            </Box>

            {/* Mobile */}
            <IconButton
              onClick={() => setOpen(true)}
              color="inherit"
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
            Menu
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            <ListItemButton component={RouterLink} to="/#about" onClick={() => setOpen(false)}>
              <ListItemText primary="About" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/#features" onClick={() => setOpen(false)}>
              <ListItemText primary="Features" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/dashboard" onClick={() => setOpen(false)}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </List>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              fullWidth
              component={RouterLink}
              to="/auth?mode=login"
              onClick={() => setOpen(false)}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/auth?mode=signup"
              onClick={() => setOpen(false)}
            >
              Sign up
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
