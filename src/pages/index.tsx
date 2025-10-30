import {
  Box,
  Button,
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
      value: '5',
      description:
        'Observational notes spanning the 2021 – 2025 field seasons.',
    },
  ];

  const FEATURE_SECTIONS = [
    {
      title: 'Investigate species differences',
      description:
        'Swap between scatter, histogram, and box plots to observe how measurements shift across species, islands, and sex.',
    },
    {
      title: 'Surface story starters',
      description:
        'Contextual callouts highlight notable trends, such as Gentoo body mass or Adelie bill depth, to kick off inquiry-led dialogue.',
    },
    {
      title: 'Shareable classroom activities',
      description:
        'Link directly to data tables or chart studies so students can revisit analysis asynchronously or extend it at home.',
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
    <Box component="main">
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 8, md: 12 },
        }}
      >
        <Stack spacing={{ xs: 8, md: 10 }}>
          <Stack spacing={2}>
            <Typography variant="overline" color="text.secondary">
              Palmer Station • 2021–2025 field seasons
            </Typography>
            <Typography variant="h2" component="h1">
              Palmer Penguins Explorer
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 640 }}
            >
              Explore 344 penguins observed at Palmer Station, Antarctica across
              the 2021–2025 field seasons. Compare Adelie, Chinstrap, and Gentoo
              colonies to surface questions about habitat, body mass, and
              seasonal change in your classroom or workshop.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Button
                component={AppLink}
                to="/penguins/"
                variant="contained"
                size="large"
                color="primary"
              >
                Open data workspace
              </Button>
              <Button
                component={AppLink}
                to="/visualizations/"
                variant="outlined"
                size="large"
              >
                Launch visualizations
              </Button>
            </Stack>
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
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h3" component="h2">
                    Fieldwork translated for seminar use
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ground lessons in firsthand Antarctic research with
                    ready-to-use visuals, guiding prompts, and lightweight
                    exports for slides or handouts so no extra formatting is
                    required.
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
                          borderRadius: 3,
                          border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: (theme) => theme.palette.primary.main,
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
                        <Typography variant="body2" color="primary.main">
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
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
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
                        borderTop: (theme) =>
                          `1px solid ${theme.palette.divider}`,
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

          <Divider />

          <Box component="section">
            <Stack spacing={3}>
              <Stack spacing={1.5}>
                <Typography variant="overline" color="text.secondary">
                  Explore the research
                </Typography>
                <Typography variant="h3" component="h2">
                  Real questions anchored in Antarctic field science
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 720 }}
                >
                  Use the explorer to guide discussions about how penguin
                  species adapt to different islands, how body measurements
                  correlate with survival strategies, and how climate signals
                  emerge across five field seasons.
                </Typography>
              </Stack>
              <Grid container spacing={3} alignItems="stretch">
                {FEATURE_SECTIONS.map((feature) => (
                  <Grid item xs={12} md={4} key={feature.title}>
                    <Paper
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Stack spacing={1.5} alignItems="flex-start">
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
