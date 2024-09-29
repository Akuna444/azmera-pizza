"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { statusOptions } from "./constants";

import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
} from "@/redux/services/orders";
import { RemoveRedEye } from "@mui/icons-material";

const OrderTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  console.log(id, status, "dkfjsk");

  const columns = useMemo<MRT_ColumnDef[]>(() => [
    {
      accessorKey: "id",
      header: "Id",
      enableEditing: false,
      size: 80,
    },
    {
      accessorKey: "pizza.name",
      header: "Name",
      enableEditing: false,
    },
    {
      accessorKey: "customToppings",
      header: "Toppings",
      enableEditing: false,
      Cell: ({ cell }) => {
        console.log(cell, "dkjfskselel");
        return (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            {/* Button to open modal */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              <RemoveRedEye />
            </Button>

            {/* Modal to display the list of items */}
            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>
                <Typography variant="h6">List of Toppings</Typography>
              </DialogTitle>
              <DialogContent>
                {/* List of items */}
                <List>
                  {cell?.row?.original?.customToppings?.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );
      },
    },
    {
      accessorKey: "customer.phone_number",
      header: "Customer",
      enableEditing: false,
    },
    {
      accessorKey: "quantity",
      header: "Quantitiy",
      enableEditing: false,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableEditing: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      editVariant: "select",
      editSelectOptions: statusOptions,
      muiEditTextFieldProps: ({ row }) => ({
        select: true,
        error: !!validationErrors?.state,
        helperText: validationErrors?.state,
        onChange: (event) => (
          setStatus(event.target.value), setId(row.original.id)
        ),
      }),
    },
  ]);

  //call READ hook
  const {
    data: fetchedOrders = [],
    isError: isLoadingOrdersError,
    isFetching: isFetchingOrders,
    isLoading: isLoadingOrders,
  } = useGetAllOrdersQuery();

  const [updateOrder, { isUpdatingOrders }] = useUpdateOrderMutation();

  //call UPDATE hook

  //CREATE action

  //UPDATE action
  const handleSaveOrders = async () => {
    const res = await updateOrder({ status, id });
    console.log(res, "dfkasjtable");
  };

  //DELETE action

  const table = useMaterialReactTable({
    columns,
    data: fetchedOrders || [],
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingOrdersError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),

    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveOrders}
          disabled={
            Object.keys(status).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingOrders ? <CircularProgress size={25} /> : "Save"}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
    state: {
      isLoading: isLoadingOrders,
      showAlertBanner: isLoadingOrdersError,
      showProgressBars: isFetchingOrders,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default OrderTable;
