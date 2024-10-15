"use client";

import { useGetPizzaQuery } from "@/redux/services/pizzas";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Button,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Formik, Form, FieldArray } from "formik";
import { usePostOrderMutation } from "@/redux/services/orders";
import { backendURL } from "@/lib/utils";

const PizzaDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const { data, isLoading } = useGetPizzaQuery(id);
  const [postOrder] = usePostOrderMutation();

  // State to handle modal
  const [isDialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const initialValues = {
    quantity: 1,
    customToppings: [], // Multiple selected toppings will be stored here
  };

  const handleSubmit = async (values) => {
    const orderItems = [
      {
        pizzaId: id,
        quantity: values.quantity,
        customToppings: values.customToppings, // Array of selected topping IDs
      },
    ];
    try {
      await postOrder(orderItems).unwrap();
      setDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
    // Open the success dialog
  };

  const handleClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Card>
        <CardMedia
          crossOrigin="anonymous"
          component="img"
          height="300"
          image={`${backendURL}/${data.imageUrl}`}
          alt={data?.name || "Pizza"}
        />
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {data?.Restaurant?.name}
          </Typography>

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                {/* Toppings Section */}
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <FormLabel component="legend">Choose Toppings:</FormLabel>
                  <FieldArray
                    name="customToppings"
                    render={(arrayHelpers) => (
                      <div>
                        {data?.defaultToppings?.map((topping) => (
                          <FormControlLabel
                            key={topping.id}
                            control={
                              <Checkbox
                                checked={values.customToppings.includes(
                                  topping.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(topping.id);
                                  } else {
                                    const idx = values.customToppings.indexOf(
                                      topping.id
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                            }
                            label={topping.name}
                          />
                        ))}
                      </div>
                    )}
                  />
                </FormControl>

                {/* Quantity Section */}
                <Box display="flex" alignItems="center" mt={3}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Quantity:
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      setFieldValue(
                        "quantity",
                        Math.max(values.quantity - 1, 1)
                      )
                    }
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: 1 }}>
                    {values.quantity}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      setFieldValue("quantity", values.quantity + 1)
                    }
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {/* Order Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  Order
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Order Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your order has been placed successfully! Thank you for ordering.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PizzaDetailPage;
