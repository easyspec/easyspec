import React from "react";
import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  DynamicForm as BrandIcon,
  Favorite as HeartIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { landingColors, landingStyles } from "../../../styles/landing.styles";
import { alpha } from "@mui/material";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={landingStyles.footer.container}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={landingStyles.footer.logoBox}>
                  <BrandIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "white" }}
                  >
                    EasySpec
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha("#FFFFFF", 0.5) }}
                  >
                    Where Business Meets Code
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: alpha("#FFFFFF", 0.6), maxWidth: 300 }}>
                Bridge the gap between business and technical teams with smart
                forms that export to any configuration format.
              </Typography>
            </Stack>
          </Grid>

          {/* Product Column */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: landingColors.primary.light,
                fontWeight: 700,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Product
            </Typography>
            <Stack spacing={1.5}>
              {[{ name: "Builder", path: "/builder" }].map((item) => (
                <Typography
                  key={item.name}
                  component="a"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  sx={{
                    ...landingStyles.footer.link,
                    cursor: "pointer",
                  }}
                >
                  {item.name}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Resources Column */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: landingColors.accent.teal,
                fontWeight: 700,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Resources
            </Typography>
            <Stack spacing={1.5}>
              {[
                { name: "Documentation", path: "/docs" },
                { name: "FAQ", path: "/faq" },
              ].map((item) => (
                <Typography
                  key={item.name}
                  component="a"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  sx={{
                    ...landingStyles.footer.link,
                    cursor: "pointer",
                    "&:hover": {
                      color: landingColors.accent.teal,
                    },
                  }}
                >
                  {item.name}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Open Source Column */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: landingColors.accent.lime,
                fontWeight: 700,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Open Source
            </Typography>
            <Stack spacing={1.5}>
              <Typography
                component="a"
                href="https://github.com/easyspec/easyspec"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...landingStyles.footer.link,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": {
                    color: landingColors.accent.lime,
                  },
                }}
              >
                <GitHubIcon sx={{ fontSize: 18 }} />
                GitHub
              </Typography>
              <Typography
                sx={{
                  color: alpha("#FFFFFF", 0.4),
                  fontSize: "0.75rem",
                }}
              >
                MIT License
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider
          sx={{
            borderColor: alpha(landingColors.primary.main, 0.1),
            my: 6,
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography
              sx={{ color: alpha("#FFFFFF", 0.5), fontSize: "0.875rem" }}
            >
              © 2025 EasySpec. All rights reserved.
            </Typography>
            {[
              { name: "Privacy Policy", path: "/privacy" },
              { name: "Terms of Service", path: "/terms" },
            ].map((item) => (
              <Typography
                key={item.name}
                component="a"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                sx={{
                  color: alpha("#FFFFFF", 0.5),
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    color: landingColors.primary.main,
                  },
                }}
              >
                {item.name}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              sx={{ color: alpha("#FFFFFF", 0.5), fontSize: "0.875rem" }}
            >
              Built with
            </Typography>
            <HeartIcon
              sx={{
                color: landingColors.primary.main,
                fontSize: "1rem",
                animation: "heartbeat 1.5s ease-in-out infinite",
              }}
            />
            <Typography
              sx={{ color: alpha("#FFFFFF", 0.5), fontSize: "0.875rem" }}
            >
              in Switzerland 🇨🇭 🏔️
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
