"use client";

import {
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  Button,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import { z } from "zod";
import { withZodSchema } from "formik-validator-zod";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { backendURL } from "@/lib/utils";
import { useState } from "react";

// Define the Zod schema for validation
const AddAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
});

const AddAdminPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  const restaurantId = searchParams.get("id");

  // Initialize Formik with Zod validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      phone_number: "",
    },
    validate: withZodSchema(AddAdminSchema),
    onSubmit: async (values) => {
      console.log("submit vals", values);

      try {
        // Configure header's Content-Type as JSON
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        setIsloading(true);
        const { status } = await axios.post(
          `${backendURL}/api/auth/add-manager`, // Change endpoint as needed
          { ...values, restaurantId },
          config
        );

        if (status >= 200 && status < 300) {
          router.push(`/signin`);
        }
      } catch (error) {
        setIsloading(false);
        setError(error?.response?.data?.message || "Failed to add admin");
        console.log(error);
      }
    },
  });

  if (!restaurantId) {
    return <>Please Add Restaruant first</>;
  }

  return (
    <Box
      height="100vh"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // Defines 2 columns with equal width
        gap: 2, // Adds spacing between columns
      }}
    >
      <Box
        sx={{
          backgroundColor: "yellow",
        }}
      ></Box>

      <form onSubmit={formik.handleSubmit}>
        <h2>Add Admin</h2>
        <FormGroup
          sx={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: "8px", // Adjust gap between form elements
          }}
        >
          <FormControl error={!!formik.errors.name}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="name-error"
            />
            {formik.touched.name && formik.errors.name && (
              <div id="name-error">{formik.errors.name}</div>
            )}
          </FormControl>

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

          <FormControl error={!!formik.errors.location}>
            <InputLabel htmlFor="location">Location</InputLabel>
            <Input
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="location-error"
            />
            {formik.touched.location && formik.errors.location && (
              <div id="location-error">{formik.errors.location}</div>
            )}
          </FormControl>

          <FormControl error={!!formik.errors.phone_number}>
            <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
            <Input
              id="phone_number"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="phone-number-error"
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <div id="phone-number-error">{formik.errors.phone_number}</div>
            )}
          </FormControl>
          {error && <p>{error}</p>}
          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </FormGroup>
      </form>
    </Box>
  );
};

export default AddAdminPage;
