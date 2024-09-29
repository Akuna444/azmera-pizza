"use client";

import {
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  Button,
  Box,
  Typography,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import { z } from "zod";
import { withZodSchema } from "formik-validator-zod";
import { useDispatch } from "react-redux";
import { restaurantLogin } from "@/redux/features/authActions/restaurantAuthActions";
import { userLogin } from "@/redux/features/authActions/userAuthActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

// Define the Zod schema for validation
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle state for admin/user login

  const toggleForm = () => setIsAdmin(!isAdmin);
  // Initialize Formik with Zod validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: withZodSchema(LoginSchema),
    onSubmit: async (values) => {
      const dataToSend = {
        ...values,
        isAdmin,
      };
      setIsloading(true);
      const res = await dispatch(userLogin(dataToSend));
      console.log("dkfjs", res);
      if (userLogin.fulfilled.match(res)) {
        router.push(isAdmin ? "/dashboard" : "/");
      } else {
        setIsloading(false);
        setError(res?.payload || "Failed to login");
      }
    },
  });

  return (
    <Box
      height="100vh"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6"></Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2">Restaurant</Typography>
                <Switch
                  checked={isAdmin}
                  onChange={toggleForm}
                  color="primary"
                />
              </Box>
            </Box>
          </Box>
          <FormControl error={!!formik.errors.email}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="email-error"
            />
            {formik.touched.email && formik.errors.email && (
              <div id="email-error">{formik.errors.email}</div>
            )}
          </FormControl>

          <FormControl error={!!formik.errors.password}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="password-error"
            />
            {formik.touched.password && formik.errors.password && (
              <div id="password-error">{formik.errors.password}</div>
            )}
          </FormControl>

          {error && <div>{error}</div>}

          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
          >
            {isAdmin ? "Restaurant Login" : "User Login"}
          </Button>

          <p>
            Don&nbsp;t have an account?
            <Link href="/signup">Signup here</Link>
          </p>
        </FormGroup>
      </form>
    </Box>
  );
};

export default LoginPage;
