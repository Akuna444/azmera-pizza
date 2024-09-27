"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { z } from "zod";
import { withZodSchema } from "formik-validator-zod";
import {
  useGetAllToppingsQuery,
  usePostToppingsMutation,
} from "@/redux/services/toppings";
import { usePostPizzasMutation } from "@/redux/services/pizzas";
import { useState } from "react";

// Define the Zod schema for validation
const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  defaultToppings: z
    .array(z.string())
    .min(1, "At least one topping must be selected"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(1, "Minimum price is 1"),
});

const AddToMenu = () => {
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [newTopping, setNewTopping] = useState("");
  const [addingError, setAddingError] = useState(null);
  const { data: toppings, isLoading: toppingIsLoading } =
    useGetAllToppingsQuery();
  const [postTopping, { isLoading: addingToppingIsLoading }] =
    usePostToppingsMutation();
  const [postPizzas, { isLoading: addingPizzaIsLoading }] =
    usePostPizzasMutation();
  // Initialize Formik with Zod validation
  const formik = useFormik({
    initialValues: {
      name: "",
      defaultToppings: [],
      price: "",
    },
    validate: withZodSchema(FormSchema),
    onSubmit: async (values) => {
      console.log(values, "from submission");
      const res = await postPizzas(values);
      console.log(res, "fjs");

      // Handle form submission
    },
  });

  // Handle checkbox change for toppings
  const handleToppingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      formik.setFieldValue("defaultToppings", [
        ...formik.values.defaultToppings,
        value,
      ]);
    } else {
      formik.setFieldValue(
        "defaultToppings",
        formik.values.defaultToppings.filter((topping) => topping !== value)
      );
    }
  };

  const handleAddTopping = async () => {
    if (!isAddingTopping) {
      setIsAddingTopping(true);
      return;
    }

    if (newTopping.length < 3) {
      setAddingError("Too short");
      return;
    }
    const res = await postTopping({ name: newTopping });
    console.log(res, "efj");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "400px",
        margin: "auto",
        mt: "50px",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        {/* Name Field */}
        <FormControl error={!!formik.errors.name}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div>{formik.errors.name}</div>
          )}
        </FormControl>

        {/* Toppings Checkboxes */}
        <FormGroup>
          {toppingIsLoading && <p>Is Loading...</p>}
          {toppings &&
            toppings.map((topping, i) => {
              return (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      value={topping.id}
                      checked={formik.values.defaultToppings.includes(
                        topping.id
                      )}
                      onChange={handleToppingsChange}
                    />
                  }
                  label={topping.name}
                />
              );
            })}
          {isAddingTopping && (
            <Box>
              <Input
                type="text"
                value={newTopping}
                onChange={(e) => setNewTopping(e.target.value)}
              />
              <Button onClick={() => setIsAddingTopping(false)}>Cancel</Button>
            </Box>
          )}{" "}
          {addingError && <p>{addingError}</p>}
          <Button disabled={addingToppingIsLoading} onClick={handleAddTopping}>
            Add
          </Button>
        </FormGroup>
        {formik.touched.defaultToppings && formik.errors.defaultToppings && (
          <div>{formik.errors.defaultToppings}</div>
        )}

        {/* Price Field */}
        <FormControl error={!!formik.errors.price}>
          <InputLabel htmlFor="price">Price</InputLabel>
          <Input
            id="price"
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <div>{formik.errors.price}</div>
          )}
        </FormControl>

        {/* Submit Button */}
        <Button
          disabled={addingPizzaIsLoading}
          type="submit"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddToMenu;
