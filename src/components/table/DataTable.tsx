import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { usePenguinData } from '@/hooks/usePenguinData';
import { formatValue } from '@/utils/dataHelpers';

// Define columns with proper typing and formatting
const columns: GridColDef[] = [
  {
    field: 'species',
    headerName: 'Species',
    width: 120,
    sortable: true,
  },
  {
    field: 'island',
    headerName: 'Island',
    width: 120,
    sortable: true,
  },
  {
    field: 'bill_length_mm',
    headerName: 'Bill Length (mm)',
    width: 150,
    sortable: true,
    type: 'number',
    valueFormatter: (params) => formatValue(params?.value),
  },
  {
    field: 'bill_depth_mm',
    headerName: 'Bill Depth (mm)',
    width: 150,
    sortable: true,
    type: 'number',
    valueFormatter: (params) => formatValue(params?.value),
  },
  {
    field: 'flipper_length_mm',
    headerName: 'Flipper Length (mm)',
    width: 170,
    sortable: true,
    type: 'number',
    valueFormatter: (params) => formatValue(params?.value),
  },
  {
    field: 'body_mass_g',
    headerName: 'Body Mass (g)',
    width: 130,
    sortable: true,
    type: 'number',
    valueFormatter: (params) => formatValue(params?.value),
  },
  {
    field: 'sex',
    headerName: 'Sex',
    width: 100,
    sortable: true,
    valueFormatter: (params) => (params.value ? (params.value as string) : '—'),
  },
  {
    field: 'year',
    headerName: 'Year',
    width: 100,
    sortable: true,
    type: 'number',
  },
];

export const DataTable: React.FC = () => {
  const { data: penguins, isLoading, error, isError } = usePenguinData();

  // Loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography>Loading penguin data...</Typography>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box p={2}>
        <Alert severity="error">
          Failed to load penguin data: {error?.message || 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Add IDs to data for DataGrid (required)
  const rowsWithIds = penguins.map((penguin, index) => ({
    id: index,
    ...penguin,
  }));

  return (
    <Box
      sx={{
        height: 600,
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'grey.50',
        },
      }}
    >
      <DataGrid
        rows={rowsWithIds}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        density="compact"
        // Accessibility props
        aria-label="Palmer Penguins data table"
        // Performance optimization for sorting
        sortingOrder={['asc', 'desc']}
      />
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, px: 1 }}>
        Showing {penguins.length} penguins
      </Typography>
    </Box>
  );
};
