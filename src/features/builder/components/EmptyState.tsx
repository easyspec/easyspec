import { Box, Button, Typography, Stack, Paper, alpha } from "@mui/material";
import {
  Add as AddIcon,
  FormatListBulleted as FormIcon,
  TipsAndUpdates as TipsIcon,
} from "@mui/icons-material";
import { colors } from "../../../styles/tokens";

interface EmptyStateProps {
  onAddField: () => void;
}

/**
 * Empty state component shown when no fields exist in the form builder
 * Provides clear guidance and call-to-action for users to get started
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ onAddField }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 4,
      }}
    >
      <Paper
        sx={{
          maxWidth: 600,
          p: 6,
          textAlign: "center",
          background: alpha(colors.background.elevated, 0.6),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
          borderRadius: "24px",
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: alpha(colors.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `2px dashed ${alpha(colors.primary.main, 0.3)}`,
                animation: "spin 20s linear infinite",
              },
              "@keyframes spin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            }}
          >
            <FormIcon
              sx={{
                fontSize: 60,
                color: colors.primary.main,
                opacity: 0.8,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              background: colors.primary.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Canvas Awaits
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: colors.text.secondary,
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            Start building your form by adding your first field. Create powerful
            YAML and JSON configurations with a simple, intuitive interface.
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={onAddField}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              background: colors.primary.gradient,
              boxShadow: `0 8px 24px ${alpha(colors.primary.main, 0.3)}`,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                boxShadow: `0 12px 32px ${alpha(colors.primary.main, 0.4)}`,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add Your First Field
          </Button>

          {/* Quick Tips */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${alpha(colors.primary.main, 0.1)}`,
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <TipsIcon sx={{ fontSize: 18, color: colors.accent.gold }} />
              <Typography
                variant="caption"
                sx={{
                  color: colors.accent.gold,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Quick Tips
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                • Use text fields for names, numbers for quantities, and
                booleans for yes/no
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                • Nest objects and arrays to create complex configurations
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                • Share your form via URL - no backend storage required
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
