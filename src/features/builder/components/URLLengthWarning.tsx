import {
  Alert,
  AlertTitle,
  Collapse,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface URLLengthWarningProps {
  urlLength: number;
  maxLength?: number;
  warningThreshold?: number;
}

/**
 * Component that displays warnings when URL length approaches browser limits
 * Helps users understand when their form configuration is too large for URL sharing
 */
export const URLLengthWarning: React.FC<URLLengthWarningProps> = ({
  urlLength,
  maxLength = 2048, // Common browser limit for URLs
  warningThreshold = 0.7, // Show warning at 70% of max length
}) => {
  const percentage = (urlLength / maxLength) * 100;
  const showWarning = urlLength > maxLength * warningThreshold;
  const isError = urlLength > maxLength;

  if (!showWarning) {
    return null;
  }

  return (
    <Collapse in={showWarning}>
      <Alert
        severity={isError ? "error" : "warning"}
        icon={isError ? <ErrorIcon /> : <WarningIcon />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>
          {isError ? "URL Too Long" : "URL Length Warning"}
        </AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {isError
            ? `Your form configuration exceeds the maximum URL length (${urlLength.toLocaleString()} / ${maxLength.toLocaleString()} characters). Some browsers may not support this link.`
            : `Your form configuration is approaching the maximum URL length (${urlLength.toLocaleString()} / ${maxLength.toLocaleString()} characters).`}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            color={isError ? "error" : "warning"}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ mt: 1, display: "block", opacity: 0.8 }}
        >
          {isError
            ? "Consider simplifying your form or using a backend storage solution."
            : "Consider keeping your form configuration concise for better compatibility."}
        </Typography>
      </Alert>
    </Collapse>
  );
};
