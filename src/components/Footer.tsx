import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { cleanPath } from '../utils/queryParams.utils';
import { AppLink } from './AppLink';
import { ImageWrapper } from './ImageWrapper';

/**
 * Bottom footer component
 */
export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: '1px solid',
        borderTopColor: (theme) => theme.palette.divider,
        padding: 4,
      }}
    >
      <Container>
        <Grid container>
          <Grid item md={6}>
            <Stack
              direction="row"
              useFlexGap
              sx={{
                flexWrap: 'wrap',
              }}
            >
              <AppLink to="/">Home</AppLink>
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack alignItems="center">
              <Typography component="p" variant="body2" align="center">
                Describe your project, place a copyright statement, or credit
                your funding organizations.
              </Typography>
              <AppLink to="/">
                <ImageWrapper height={60}>
                  <img
                    alt="Penguins Explorer wordmark"
                    src={cleanPath(
                      `${import.meta.env.BASE_URL}/strudel-logo-header.png`
                    )}
                    loading="lazy"
                  />
                </ImageWrapper>
              </AppLink>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
