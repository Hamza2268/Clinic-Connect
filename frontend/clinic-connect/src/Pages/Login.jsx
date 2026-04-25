import { useContext, useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert,
  Box,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../Style/LogIn.module.css";
import { AuthContext } from "../Context/AuthProviderContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, token, user, userType, isLoggedIn, loading, forgetPassword } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgetPassword = async () => {
    try {
      await forgetPassword(formData.email);
      toast.success("Password reset email sent!");
      alert("forget  successful! (Check email for reset instructions)");
    } catch (error) {
      alert(error.message || "forget failed. Please try again.");
      toast.error("Failed to send password reset email.");
      console.error("forgetpass error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        // console.log("Form submitted:", formData);
        const { type } = await login(formData.email, formData.password);
        toast.success("Login successful!");
        // alert("Login successful! (Check console for form data)");
        console.log(type);
        if (type === "patient") {
          navigate("/Services");
        } else if (type === "doctor") {
          navigate("/Doctor/patients");
        } else if (type === "pharmacist") {
          navigate("/pharmacist/prescriptions");
        } else if (type === "lab_technician") {
          navigate("/labTechnician/requests");
        } else if (type === "admin") {
          navigate("/Admin");
        }
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
      alert(error.message || "login failed. Please try again.");
      console.error("login error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.LoginPage}>
      <Toaster position="top-right" />
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress style={{ color: "#53629e" }} />
          <div
            style={{
              marginTop: "16px",
              color: "#53629e",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            Loading, please wait...
          </div>
        </div>
      )}
      {!loading && (
        <Container className="py-1">
          <div className="col-xl-10 col-xxl-8 mx-auto">
            <Row className="align-items-center g-lg-5 py-5">
              <Col lg={6} className="text-center text-lg-start ">
                <Typography
                  variant="h2"
                  component="h1"
                  className="display-4 fw-bold lh-1 mb-3"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontFamily: "Alan Sans, Outfit",
                  }}
                >
                  Welcome to Clinic Community
                </Typography>
                <Typography
                  variant="h5"
                  className="col-lg-10 mx-auto mx-lg-0"
                  sx={{
                    color: "text.secondary",
                    fontSize: "1.25rem",
                    fontFamily: "Alan Sans, Outfit",
                  }}
                >
                  Join us today and start your journey. Create an account to
                  Explore, Check, and grow healthy.
                </Typography>
              </Col>

              {/* Right side - Login form */}
              <Col md={10} lg={6} className="mx-auto">
                <Paper
                  elevation={3}
                  className="p-4 p-md-5 rounded-3 shadow-lg"
                  sx={{
                    backgroundColor: "background.paper",
                    fontFamily: "Alan Sans, Outfit",
                  }}
                >
                  <div className={styles.logoIcon}>
                    <Diversity2Icon style={{ color: "white", fontSize: 30 }} />
                  </div>
                  <Box component="div">
                    {/* Email field */}
                    <Box sx={{ mb: 3, fontFamily: "Alan Sans, Outfit" }}>
                      <TextField
                        fullWidth
                        label="Email address"
                        name="email"
                        type="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        error={!!errors.email}
                        variant="outlined"
                        placeholder="name@example.com"
                        sx={{ fontFamily: "Alan Sans, Outfit" }}
                      />
                      {errors.email && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {errors.email}
                        </Alert>
                      )}
                    </Box>

                    {/* Password field */}
                    <Box
                      style={{ position: "relative" }}
                      sx={{ mb: 3, fontFamily: "Alan Sans, Outfit" }}
                    >
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        className={styles.input}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        error={!!errors.password}
                        variant="outlined"
                        placeholder="Password"
                      />

                      <button
                        type="button"
                        onClick={handleClickShowPassword}
                        className={styles.eyeButton}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                      {errors.password && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {errors.password}
                        </Alert>
                      )}
                    </Box>

                    {/* Remember me checkbox */}
                    <Box className="mb-2">
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                          />
                        }
                        label="Remember me"
                      />
                    </Box>

                    {/* Forget password link */}
                    <Box className="mb-2">
                      <Link
                        //   href="#forget-password"
                        underline="hover"
                        sx={{
                          fontSize: "0.8rem",
                          color: "text.secondary",
                          fontFamily: "Alan Sans, Outfit",
                        }}
                        onClick={handleForgetPassword}
                      >
                        Forget Password
                      </Link>
                    </Box>

                    {/* Submit button */}
                    <button
                      onClick={handleSubmit}
                      className={styles.loginButton}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#53629e")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#53629e")
                      }
                    >
                      Log in
                    </button>

                    {/* Sign up link */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        fontFamily: "Alan Sans, Outfit",
                      }}
                    >
                      Don't Have an account?{" "}
                      <Link href="/Signup" underline="hover">
                        Sign up
                      </Link>
                    </Typography>

                    {/* Terms */}
                    <hr className="my-4" />
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.secondary",
                        textAlign: "center",
                        fontFamily: "Alan Sans, Outfit",
                      }}
                    >
                      By clicking Sign up, you agree to the terms of use.
                    </Typography>
                  </Box>
                </Paper>
              </Col>
            </Row>
          </div>
        </Container>
      )}
    </div>
  );
}
