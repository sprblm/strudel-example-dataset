import { Box, Stack } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { SkipLinks } from './a11y/SkipLinks';
import { KeyboardShortcutsProvider } from './a11y/KeyboardShortcutsProvider';
import { LiveRegion } from './a11y/LiveRegion';
import { Footer } from './Footer';
import { TopBar } from './TopBar';

/**
 * Basic layout with navbar and footer
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
        <TopBar />
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
