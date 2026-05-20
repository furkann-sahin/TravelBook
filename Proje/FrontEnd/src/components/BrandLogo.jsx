import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function BrandLogo({
  to = "/",
  clickable = true,
  showText = true,
  iconSize = 32,
  text = "TravelBook",
  textVariant = "h5",
  textColor = "primary.main",
  gap = 1,
  sx,
  iconSx,
  textSx,
  children,
}) {
  const content = (
    <>
      <Box
        component="img"
        src="/favicon.svg"
        alt="TravelBook logosu"
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: 1,
          display: "block",
          ...iconSx,
        }}
      />
      {showText ? (
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 800,
            color: textColor,
            letterSpacing: "-0.5px",
            ...textSx,
          }}
        >
          {text}
        </Typography>
      ) : null}
      {children}
    </>
  );

  if (!clickable) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap, ...sx }}>
        {content}
      </Box>
    );
  }

  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        display: "flex",
        alignItems: "center",
        gap,
        textDecoration: "none",
        ...sx,
      }}
    >
      {content}
    </Box>
  );
}
