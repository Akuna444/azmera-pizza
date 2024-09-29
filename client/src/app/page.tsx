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
import { useGetAllPizzasQuery } from "@/redux/services/pizzas";
import Link from "next/link";

const PizzaListPage = () => {
  const { data: pizzas, isLoading } = useGetAllPizzasQuery();
  if (isLoading) {
    return <p>Loading...</p>;
  }
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
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {product?.Restaurant?.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/order/${product.id}`}>
                  {" "}
                  <Button size="small" variant="contained" color="primary">
                    Order
                  </Button>{" "}
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PizzaListPage;
