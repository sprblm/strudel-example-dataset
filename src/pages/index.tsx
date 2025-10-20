import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { AppLink } from '@/components/AppLink';

export const Route = createFileRoute('/')({
  component: Index,
});

/**
 * Home page component that renders at the root route /
 */
function Index() {
  const DATA_POINTS = [
    {
      label: 'Penguins observed',
      value: '344',
      description:
        'Measurements recorded across expeditions at Palmer Station.',
    },
    {
      label: 'Species represented',
      value: '3',
      description:
        'Adelie, Chinstrap, and Gentoo colonies from nearby islands.',
    },
    {
      label: 'Research seasons',
      value: '3',
      description:
        'Observational notes spanning the 2007 – 2009 field seasons.',
    },
  ];

  const FEATURE_SECTIONS = [
    {
      title: 'Quiet, accessible interface',
      description:
        'Screen reader cues, restrained motion, and clearly labeled controls keep the focus on the data rather than the tooling.',
    },
    {
      title: 'Designed for studio critique',
      description:
        'Bring charts into lectures or reviews with a consistent visual language that echoes research archives rather than product dashboards.',
    },
    {
      title: 'Configurable without friction',
      description:
        'Filters, legend toggles, and share links all live within reach so seminar participants can follow along in real time.',
    },
  ];

  const QUICK_START_ACTIONS = [
    {
      title: 'Open the data table',
      description:
        'Sort, filter, and compare raw measurements to surface patterns for discussion.',
      to: '/penguins/',
      ariaLabel: 'Explore the Palmer Penguins data table',
      ctaLabel: 'View records →',
    },
    {
      title: 'Work through a chart study',
      description:
        'Switch between scatter, histogram, and box plots to interrogate relationships during instruction.',
      to: '/visualizations/',
      ariaLabel: 'Open the Palmer Penguins visualizations workspace',
      ctaLabel: 'Launch visualizations →',
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={{ xs: 8, md: 10 }}>
          <Stack spacing={2}>
            <Typography variant="overline" color="text.secondary">
              Palmer Station • Research archive
            </Typography>
            <Typography variant="h2" component="h1">
              Palmer Penguins Explorer
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 640 }}
            >
              A reserved interface for teaching ecology and statistical
              reasoning. The explorer keeps typography, spacing, and
              interactions restrained so the original field data remains the
              central voice.
            </Typography>
          </Stack>

          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Stack spacing={{ xs: 4, md: 5 }} sx={{ height: '100%' }}>
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    height: '100%',
                  }}
                >
                  <Typography variant="h3" component="h2">
                    Fieldwork translated for seminar use
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Structured notes, clear typographic hierarchy, and neutral
                    tones channel the spirit of archival research portals. Data
                    remains legible on projectors and within printed decks
                    without extra theming work.
                  </Typography>
                </Paper>

                <Stack spacing={2.5}>
                  <Typography variant="overline" color="text.secondary">
                    Start with an activity
                  </Typography>
                  <Stack spacing={1.5}>
                    {QUICK_START_ACTIONS.map((action) => (
                      <Paper
                        key={action.title}
                        component={AppLink}
                        to={action.to}
                        aria-label={action.ariaLabel}
                        sx={{
                          p: { xs: 2.5, md: 3 },
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 1.5, sm: 3 },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          justifyContent: 'space-between',
                          transition:
                            'border-color 0.2s ease, transform 0.2s ease',
                          borderColor: 'rgba(255,255,255,0.12)',
                          '&:hover': {
                            borderColor: 'text.primary',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Box>
                          <Typography variant="h5" component="h3">
                            {action.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {action.description}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {action.ctaLabel}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Dataset index
                  </Typography>
                  <Typography variant="h4" component="h2">
                    Field observations at Palmer Station
                  </Typography>
                </Box>
                <Stack component="dl" spacing={2.5} sx={{ m: 0 }}>
                  {DATA_POINTS.map((point) => (
                    <Box
                      key={point.label}
                      sx={{
                        borderTop: '1px solid',
                        borderColor: 'rgba(255,255,255,0.08)',
                        pt: 1.5,
                      }}
                    >
                      <Typography variant="h5" component="dt">
                        {point.value}
                      </Typography>
                      <Typography
                        component="dd"
                        sx={{
                          margin: 0,
                          fontSize: '0.9rem',
                          color: 'text.secondary',
                        }}
                      >
                        {point.label}
                      </Typography>
                      <Typography
                        component="dd"
                        sx={{
                          margin: 0,
                          mt: 0.5,
                          fontSize: '0.85rem',
                          color: 'text.secondary',
                        }}
                      >
                        {point.description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          <Box component="section">
            <Stack spacing={3}>
              <Stack spacing={1.5}>
                <Typography variant="overline" color="text.secondary">
                  Teaching and tooling
                </Typography>
                <Typography variant="h3" component="h2">
                  Quiet support for inquiry-led lessons
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 720 }}
                >
                  Use the explorer as a neutral companion in workshops, studio
                  critiques, and classrooms. Every component favours legibility,
                  conserving attention for the scientific story instead of the
                  interface.
                </Typography>
              </Stack>
              <Grid container spacing={3}>
                {FEATURE_SECTIONS.map((feature) => (
                  <Grid item xs={12} md={4} key={feature.title}>
                    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack spacing={1.5}>
                        <Typography variant="h5" component="h3">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
