import React from 'react';
import {
  Modal,
  Paper,
  Stack,
  Typography,
  IconButton,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppState } from '@/context/ContextProvider';
import { closeHelpModal } from '@/context/actions';
import { FocusTrap } from '@/components/a11y/FocusTrap';

export const HelpModal: React.FC = () => {
  const { state, dispatch } = useAppState();

  const handleClose = () => {
    dispatch(closeHelpModal());
  };

  const keyboardShortcuts = [
    { key: '/', description: 'Focus search/filter input' },
    { key: '?', description: 'Open this help modal' },
    { key: 'Esc', description: 'Close modals and dropdowns' },
    { key: 'Tab', description: 'Navigate between interactive elements' },
    { key: 'Enter/Space', description: 'Activate buttons and links' },
    { key: '↑↓←→', description: 'Navigate chart data points (when focused)' },
  ];

  return (
    <Modal
      open={state.helpModalOpen}
      onClose={handleClose}
      aria-labelledby="help-modal-title"
      aria-describedby="help-modal-description"
    >
      <FocusTrap active={state.helpModalOpen}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography id="help-modal-title" variant="h5" component="h2">
                Palmer Penguins Explorer - Help
              </Typography>
              <IconButton
                onClick={handleClose}
                aria-label="Close help modal"
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Box id="help-modal-description">
              <Typography variant="h6" gutterBottom>
                About the Dataset
              </Typography>
              <Typography paragraph>
                This application explores the Palmer Archipelago (Antarctica)
                penguin dataset, collected and made available by Dr. Kristen
                Gorman and the Palmer Station, Antarctica LTER. The dataset
                contains 344 observations of three penguin species: Adelie,
                Chinstrap, and Gentoo.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Keyboard Navigation
              </Typography>
              <Typography paragraph>
                This application is fully keyboard accessible. Use the following
                shortcuts:
              </Typography>

              <Stack spacing={1} sx={{ mb: 2 }}>
                {keyboardShortcuts.map((shortcut) => (
                  <Stack
                    key={shortcut.key}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <Chip
                      label={shortcut.key}
                      size="small"
                      variant="outlined"
                      sx={{ minWidth: 60, fontFamily: 'monospace' }}
                    />
                    <Typography variant="body2">
                      {shortcut.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Note: The search shortcut (/) only works when not typing in form
                inputs to avoid conflicts with browser search functionality.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Accessibility Features
              </Typography>
              <Typography paragraph>
                • Skip links for faster navigation (press Tab from the top of
                the page)
                <br />
                • All interactive elements are keyboard accessible
                <br />
                • Screen reader compatible with proper ARIA labels
                <br />
                • High contrast focus indicators
                <br />• Live regions announce filter changes
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </FocusTrap>
    </Modal>
  );
};
