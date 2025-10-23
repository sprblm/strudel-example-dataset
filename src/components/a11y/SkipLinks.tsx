import { Box, Link } from '@mui/material';
import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="skip-link"
    onFocus={(e) => {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }}
  >
    {children}
  </Link>
);

export const SkipLinks: React.FC = () => {
  return (
    <Box
      component="nav"
      aria-label="Skip links"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10000,
      }}
    >
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#filters">Skip to filters</SkipLink>
      <SkipLink href="#data">Skip to data</SkipLink>
    </Box>
  );
};
