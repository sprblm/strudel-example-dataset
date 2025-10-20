import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { usePenguinData } from '@/hooks/usePenguinData';
import { formatValue } from '@/utils/dataHelpers';
import type { Penguin } from '@/types/penguin';

// Define columns with proper typing and formatting
const formatNumericCell: GridColDef<Penguin>['valueFormatter'] = (params) => {
  const value = params?.value;
  return formatValue((value as number | null) ?? null);
};

const formatSexCell: GridColDef<Penguin>['valueFormatter'] = (params) => {
  const value = params?.value;
  return (value as string | null) ? (value as string) : '—';
};

const columns: GridColDef<Penguin>[] = [
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
    valueFormatter: formatNumericCell,
  },
  {
    field: 'bill_depth_mm',
    headerName: 'Bill Depth (mm)',
    width: 150,
    sortable: true,
    type: 'number',
    valueFormatter: formatNumericCell,
  },
  {
    field: 'flipper_length_mm',
    headerName: 'Flipper Length (mm)',
    width: 170,
    sortable: true,
    type: 'number',
    valueFormatter: formatNumericCell,
  },
  {
    field: 'body_mass_g',
    headerName: 'Body Mass (g)',
    width: 130,
    sortable: true,
    type: 'number',
    valueFormatter: formatNumericCell,
  },
  {
    field: 'sex',
    headerName: 'Sex',
    width: 100,
    sortable: true,
    valueFormatter: formatSexCell,
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
      id="data"
      tabIndex={-1}
      sx={{
        height: 600,
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'grey.50',
        },
        '&:focus': {
          outline: 'none',
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
        slotProps={{
          columnsPanel: {
            sx: {
              '& .MuiDataGrid-columnsPanel': {
                '&:focus-within': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              },
            },
          },
          pagination: {
            sx: {
              '& .MuiTablePagination-actions button': {
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px',
                },
              },
            },
          },
        }}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            '&:focus-within': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          },
          '& .MuiDataGrid-cell': {
            '&:focus-within': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          },
        }}
      />
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, px: 1 }}>
        Showing {penguins.length} penguins
      </Typography>
    </Box>
  );
};
