import React, { useState, useEffect } from "react";
import { Box, Container, Fade, Grid } from "@mui/material";
import { landingStyles, landingAnimations } from "../../styles/landing.styles";
import { Header, Hero, HowItWorks, WhoIsThisFor, Footer } from "./components";
import { ANIMATION_DURATIONS } from "./types";

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visibility for animations
    setIsVisible(true);

    // Inject CSS animations
    const style = document.createElement("style");
    style.textContent = Object.values(landingAnimations).join("\n");
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box sx={landingStyles.mainContainer}>
      {/* Animated Background Mesh */}
      <Box sx={landingStyles.backgroundMesh} />

      {/* Navigation Header */}
      <Header />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={landingStyles.hero.container}>
        <Fade in={isVisible} timeout={ANIMATION_DURATIONS.fadeIn}>
          <Grid container spacing={6} alignItems="center">
            <Hero />
          </Grid>
        </Fade>
      </Container>

      {/* How It Works */}
      <Fade in={isVisible} timeout={ANIMATION_DURATIONS.fadeIn + 200}>
        <Box>
          <HowItWorks />
        </Box>
      </Fade>

      {/* Who Is This For */}
      <Fade in={isVisible} timeout={ANIMATION_DURATIONS.fadeIn + 400}>
        <Box>
          <WhoIsThisFor />
        </Box>
      </Fade>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
