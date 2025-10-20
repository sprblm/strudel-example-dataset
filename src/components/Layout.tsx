import { Box, Stack } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { SkipLinks } from './a11y/SkipLinks';
import { KeyboardShortcutsProvider } from './a11y/KeyboardShortcutsProvider';
import { LiveRegion } from './a11y/LiveRegion';
import { Footer } from './Footer';

/**
 * Page layout wrapper with skip links and footer
 */
export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <KeyboardShortcutsProvider>
      <Stack
        sx={{
          height: '100%',
          position: 'relative',
        }}
      >
        <SkipLinks />
        <LiveRegion />
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{
            flex: 1,
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          {children}
        </Box>
        <Footer />
      </Stack>
    </KeyboardShortcutsProvider>
  );
};
