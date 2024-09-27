"use client";

import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Container,
} from "@mui/material";
import LogoutButton from "@/components/ui/LogoutButton";

// Example pizzas data
const pizzas = [
  {
    id: 1,
    name: "Pizza Margherita",
    price: 9.99,
    image: "https://source.unsplash.com/1600x900/?pizza",
    description: "Classic pizza with mozzarella cheese and fresh tomatoes",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 12.99,
    image: "https://source.unsplash.com/1600x900/?pepperoni-pizza",
    description: "Delicious pizza topped with pepperoni and cheese",
  },
  {
    id: 3,
    name: "Vegan Pizza",
    price: 11.99,
    image: "https://source.unsplash.com/1600x900/?vegan-pizza",
    description: "A healthy vegan pizza with plant-based toppings",
  },
  // Add more pizzas as needed
];

const PizzaListPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Welcome to Our Restaruant
        <LogoutButton />
      </Typography>
      <Grid container spacing={4}>
        {pizzas.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  ${product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" color="primary">
                  Shop Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PizzaListPage;
