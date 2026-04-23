import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: 4,
            textAlign: "center",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />
          <Typography variant="h5" fontWeight={700}>
            Beklenmedik bir hata oluştu
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={400}>
            Sayfa yüklenirken bir sorun oluştu. Anasayfaya dönerek tekrar deneyebilirsiniz.
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Anasayfaya Dön
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
