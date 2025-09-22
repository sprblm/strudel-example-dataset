import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePenguinData } from '@/hooks/usePenguinData';
import { Penguin } from '@/types/penguin';
import { formatValue } from '@/utils/dataHelpers';
import { PenguinCardList } from './PenguinCardList';

// Define columns with proper typing and formatting
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
    valueFormatter: ({ value }: { value: number | null | undefined }) =>
      formatValue(value),
  },
  {
    field: 'bill_depth_mm',
    headerName: 'Bill Depth (mm)',
    width: 150,
    sortable: true,
    type: 'number',
    valueFormatter: ({ value }: { value: number | null | undefined }) =>
      formatValue(value),
  },
  {
    field: 'flipper_length_mm',
    headerName: 'Flipper Length (mm)',
    width: 170,
    sortable: true,
    type: 'number',
    valueFormatter: ({ value }: { value: number | null | undefined }) =>
      formatValue(value),
  },
  {
    field: 'body_mass_g',
    headerName: 'Body Mass (g)',
    width: 130,
    sortable: true,
    type: 'number',
    valueFormatter: ({ value }: { value: number | null | undefined }) =>
      formatValue(value),
  },
  {
    field: 'sex',
    headerName: 'Sex',
    width: 100,
    sortable: true,
    valueFormatter: ({ value }: { value: string | null | undefined }) =>
      value ?? '—',
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <PenguinCardList
        penguins={penguins ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    );
  }

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
  const penguinRows = penguins ?? [];

  const rowsWithIds = penguinRows.map((penguin, index) => ({
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
        Showing {penguinRows.length} penguins
      </Typography>
    </Box>
  );
};
