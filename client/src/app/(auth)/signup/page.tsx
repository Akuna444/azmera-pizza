"use client";

import {
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  Button,
  Box,
  Switch,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { z } from "zod";
import { withZodSchema } from "formik-validator-zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendURL } from "@/lib/utils";

// Define the Zod schema for validation
const UserRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
});

const RestaurantRegisterSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
});

const SignUpPage = () => {
  const [isRestaurant, setIsRestaurant] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restaurantImage, setRestaurantImage] = useState(null);

  // Toggle between User and Restaurant forms
  const toggleForm = () => setIsRestaurant(!isRestaurant);

  // Formik setup for User registration
  const userFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      phone_number: "",
    },
    validate: withZodSchema(UserRegisterSchema),
    onSubmit: async (values) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        setLoading(true);
        const { status } = await axios.post(
          `${backendURL}/api/auth/register`,
          { ...values, restaurantImage },
          config
        );
        setLoading(false);
        if (status >= 200 && status < 300) {
          router.push("/signin");
        }
      } catch (error) {
        setLoading(false);
        setError(
          error?.response?.data?.message || "Error during user registration"
        );
      }
    },
  });

  const handleFileChange = (e) => {
    setRestaurantImage(e.target.files[0]);
  };

  // Formik setup for Restaurant registration
  const restaurantFormik = useFormik({
    initialValues: {
      name: "",
      location: "",
    },
    validate: withZodSchema(RestaurantRegisterSchema),
    onSubmit: async (values) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        setLoading(true);
        const { data, status } = await axios.post(
          `${backendURL}/api/restaurant/add`,
          values,
          config
        );
        if (status >= 200 && status < 300) {
          router.push(`/add-admin?id=${data.restaurant.id}`);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setError(
          error?.response?.data?.message ||
            "Error during restaurant registration"
        );
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
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {isRestaurant ? "Restaurant Registration" : "User Registration"}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Restaurant</Typography>
            <Switch
              checked={isRestaurant}
              onChange={toggleForm}
              color="primary"
            />
          </Box>
        </Box>

        {/* Render User Registration Form */}
        {!isRestaurant && (
          <form onSubmit={userFormik.handleSubmit}>
            <FormGroup sx={{ gap: "16px" }}>
              <FormControl error={!!userFormik.errors.name}>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input
                  id="name"
                  name="name"
                  value={userFormik.values.name}
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                />
              </FormControl>

              <FormControl error={!!userFormik.errors.email}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userFormik.values.email}
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                />
              </FormControl>

              <FormControl error={!!userFormik.errors.password}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userFormik.values.password}
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                />
              </FormControl>

              <FormControl error={!!userFormik.errors.location}>
                <InputLabel htmlFor="location">Location</InputLabel>
                <Input
                  id="location"
                  name="location"
                  value={userFormik.values.location}
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                />
              </FormControl>

              <FormControl error={!!userFormik.errors.phone_number}>
                <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={userFormik.values.phone_number}
                  onChange={userFormik.handleChange}
                  onBlur={userFormik.handleBlur}
                />
              </FormControl>

              {error && <div>{error}</div>}

              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                color="primary"
              >
                {loading ? "Loading..." : "Register as User"}
              </Button>
            </FormGroup>
          </form>
        )}

        {/* Render Restaurant Registration Form */}
        {isRestaurant && (
          <form onSubmit={restaurantFormik.handleSubmit}>
            <FormGroup sx={{ gap: "16px" }}>
              <FormControl error={!!restaurantFormik.errors.name}>
                <InputLabel htmlFor="name">Restaurant Name</InputLabel>
                <Input
                  id="name"
                  name="name"
                  value={restaurantFormik.values.name}
                  onChange={restaurantFormik.handleChange}
                  onBlur={restaurantFormik.handleBlur}
                />
              </FormControl>

              <FormControl error={!!restaurantFormik.errors.location}>
                <InputLabel htmlFor="location">Location</InputLabel>
                <Input
                  id="location"
                  name="location"
                  value={restaurantFormik.values.location}
                  onChange={restaurantFormik.handleChange}
                  onBlur={restaurantFormik.handleBlur}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="restaurantImage">
                  restaurant Image
                </InputLabel>
                <Input
                  id="restaurantImage"
                  name="restaurantImage"
                  type="file"
                  onChange={handleFileChange}
                />
              </FormControl>

              {error && <div>{error}</div>}

              <Button type="submit" variant="contained" color="primary">
                Register as Restaurant
              </Button>
            </FormGroup>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default SignUpPage;
