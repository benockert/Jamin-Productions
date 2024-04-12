import React, { useState } from "react";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
  marginTop: "5px",
  padding: "5px",
};

const sections = ["About", "Services", "Testimonials", "Gallery"];

function NavBar({ mode }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 60,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <img
                src={mode === "dark" ? "jp-logo-dark.png" : "jp-logo-light.png"}
                style={logoStyle}
                alt=""
                onClick={() => scrollToSection("home")}
              />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {sections.map((item) => (
                  <MenuItem
                    onClick={() => scrollToSection(item.toLowerCase())}
                    sx={{ py: "6px", px: "18px", borderRadius: 2 }}
                  >
                    <Typography variant="h6" color="text.primary">
                      {item}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="call 8608789692"
                  color="inherit"
                >
                  <PhoneIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="email jamin productions"
                  color="inherit"
                >
                  <MailOutlineIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px", borderRadius: 2 }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  {sections.map((item) => (
                    <MenuItem
                      onClick={() => scrollToSection(item.toLowerCase())}
                    >
                      {item}
                    </MenuItem>
                  ))}
                  <Divider />
                  <IconButton
                    size="large"
                    aria-label="call 8608789692"
                    color="inherit"
                    href="tel:8608789692"
                  >
                    <PhoneIcon />
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="email jamin productions"
                    color="inherit"
                    href="mailto:jaminproductions2@gmail.com"
                  >
                    <MailOutlineIcon />
                  </IconButton>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

NavBar.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
};

export default NavBar;
