import { useRef, useState, useEffect } from "react";
import { loginTheme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { get_session } from "../api/api.js";
import { useNavigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();
  const domain = useRef(window.location.host.split(".")[0]);
  const [error, setError] = useState();

  useEffect(() => {
    sessionStorage.removeItem("source_control_jwt");
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    get_session(data.get("access-code")).then((res) => {
      if (res.status === 200) {
        sessionStorage.setItem("source_control_jwt", res.token);
        navigate(res.redirect_path);
      } else {
        setError(res.message);
      }
    });
  };

  const toggleError = () => {
    setError();
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "brand_colors.light",
            color: "brand_colors.dark",
            borderRadius: "16px",
            boxShadow: 25,
            p: 2,
            my: "50%",
            mx: 4,
            display: "flex",
            flexDirection: "column",
            width: "fit-content",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 3,
              mt: "-35px",
              border: 6,
              bgcolor: "brand_colors.primary",
              color: "brand_colors.light",
              width: "50px",
              height: "50px",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: "25px" }} />
          </Avatar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              "& hr": { mx: 2.0 },
            }}
          >
            <Avatar
              sx={{ width: 90, height: "auto" }}
              variant="square"
              src={`https://static.jaminproductions.com/dev/media_control/assets/${domain.current}.png`}
            ></Avatar>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography width="auto" align="left" component="h1" variant="h5">
                Event Media
              </Typography>
              <Typography width="auto" align="left" component="h1" variant="h5">
                Control
              </Typography>
            </Box>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              type="password"
              id="access-code-textfield"
              label="Access code"
              name="access-code"
              autoFocus
              sx={{ input: { color: "brand_colors.dark" } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={toggleError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
