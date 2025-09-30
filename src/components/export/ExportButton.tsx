import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Tooltip } from '@mui/material';
import useExport from '@/hooks/useExport';

export interface ExportButtonProps {
  containerRef: React.RefObject<HTMLElement>;
  chartType: string;
  title: string;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  containerRef,
  chartType,
  title,
  disabled = false,
}) => {
  const { exporting, exportToPNG, buildFilename } = useExport();

  const handleExport = async () => {
    if (!containerRef.current || disabled) {
      return;
    }

    const filename = buildFilename({ chartType });

    await exportToPNG(containerRef.current, {
      filename,
      chartType,
      title,
    });
  };

  const button = (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      startIcon={<DownloadIcon fontSize="small" />}
      onClick={handleExport}
      disabled={disabled || exporting}
      data-testid="export-visualization-button"
      aria-label={`Download ${chartType} chart as PNG`}
    >
      {exporting ? 'Preparing…' : 'Download PNG'}
    </Button>
  );

  if (disabled) {
    return (
      <Tooltip title="Export available when chart data is visible">
        <span style={{ display: 'inline-flex' }}>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

export default ExportButton;
