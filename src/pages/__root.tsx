import { Box, Stack } from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';

/**
 * Root layout shell for route content
 */
export const Route = createRootRoute({
  component: () => (
    <Stack
      spacing={0}
      sx={{
        height: '100%',
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          paddingBottom: 4,
        }}
      >
        <Outlet />
      </Box>
    </Stack>
  ),
});
