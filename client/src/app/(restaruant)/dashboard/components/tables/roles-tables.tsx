"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { statusOptions } from "./constants";

import {
  useGetAllRolesQuery,
  usePostRolesMutation,
} from "@/redux/services/roles";

const RolesTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedRoles, setEditedRoles] = useState({});

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [message, setMessage] = useState(null);
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedPermissions((prevState) =>
      checked
        ? [...prevState, name]
        : prevState.filter((permission) => permission !== name)
    );
  };
  const [postRoles] = usePostRolesMutation();
  const handleSubmit = async () => {
    const res = await postRoles({ name, permissions: selectedPermissions });
    if (res.success) {
      setMessage("succesfully created");
    } else {
      setMessage("failed to create role");
    }
  };

  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableEditing: true,
      },

      {
        accessorKey: "active",
        header: "Active",
        enableEditing: false,
      },
    ],
    [editedRoles, validationErrors]
  );

  //call READ hook
  const {
    data: fetchedRoles = [],
    isError: isLoadingRolesError,
    isFetching: isFetchingRoles,
    isLoading: isLoadingRoles,
  } = useGetAllRolesQuery();

  console.log(fetchedRoles, "heydfhskfj");

  //call UPDATE hook

  //CREATE action
  const handleCreateUser: MRT_TableOptions["onCreatingRowSave"] =
    async ({}) => {
      //exit creating mode
    };

  //UPDATE action
  const handleSaveRoles = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
  };

  //DELETE action

  const table = useMaterialReactTable({
    columns,
    data: fetchedRoles || [],
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingRolesError
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
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Set User Permissions</DialogTitle>
        <DialogContent>
          <Box component="form">
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="dense"
              variant="outlined"
            />
            <Box sx={{ marginTop: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(
                      "update_order_status"
                    )}
                    onChange={handleCheckboxChange}
                    name="update_order_status"
                  />
                }
                label="Update Order Status"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPermissions.includes("see_Roles")}
                    onChange={handleCheckboxChange}
                    name="see_Roles"
                  />
                }
                label="See Roles"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPermissions.includes("add_users")}
                    onChange={handleCheckboxChange}
                    name="add_users"
                  />
                }
                label="Add Users"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPermissions.includes("see_customers")}
                    onChange={handleCheckboxChange}
                    name="see_customers"
                  />
                }
                label="See Customers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPermissions.includes("create_roles")}
                    onChange={handleCheckboxChange}
                    name="create_roles"
                  />
                }
                label="Create Roles"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {message && <p>{message}</p>}
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Add New Roles
      </Button>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveRoles}
          disabled={
            Object.keys(editedRoles)?.length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {/* {isUpdatingRoles ? <CircularProgress size={25} /> : "Save"} */}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
    state: {
      isLoading: isLoadingRoles,
      showAlertBanner: isLoadingRolesError,
      showProgressBars: isFetchingRoles,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default RolesTable;
