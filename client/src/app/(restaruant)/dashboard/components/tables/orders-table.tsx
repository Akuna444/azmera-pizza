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
import { Box, Button, Typography } from "@mui/material";

import { statusOptions } from "./constants";

import { useGetAllOrdersQuery } from "@/redux/services/orders/orders";

const OrderTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedOrders, setEditedOrders] = useState({});

  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
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
        accessorKey: "customToppings[0].name",
        header: "Toppings",
        enableEditing: false,
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
      },
    ],
    [editedOrders, validationErrors]
  );

  //call READ hook
  const {
    data: fetchedOrders = [],
    isError: isLoadingOrdersError,
    isFetching: isFetchingOrders,
    isLoading: isLoadingOrders,
  } = useGetAllOrdersQuery();

  //call UPDATE hook

  //CREATE action
  const handleCreateUser: MRT_TableOptions["onCreatingRowSave"] =
    async ({}) => {
      //exit creating mode
    };

  //UPDATE action
  const handleSaveOrders = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
  };

  //DELETE action

  const table = useMaterialReactTable({
    columns,
    data: fetchedOrders[0]?.orderItems || [],
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
    onCreatingRowSave: handleCreateUser,
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveOrders}
          disabled={
            Object.keys(editedOrders)?.length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {/* {isUpdatingOrders ? <CircularProgress size={25} /> : "Save"} */}
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
