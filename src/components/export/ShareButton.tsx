import { useEffect, useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { Button, Tooltip } from '@mui/material';

interface ShareButtonProps {
  getShareUrl: () => string;
  disabled?: boolean;
}

type ShareStatus = 'idle' | 'success' | 'error';

const COPY_RESET_DELAY = 2000;

const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const selectedRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch (error) {
    succeeded = false;
  }

  if (selectedRange) {
    selection?.removeAllRanges();
    selection?.addRange(selectedRange);
  }

  document.body.removeChild(textarea);

  return succeeded;
};

const copyToClipboard = async (text: string) => {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return fallbackCopy(text);
};

const statusLabel: Record<ShareStatus, string> = {
  idle: 'Share Link',
  success: 'Link Copied!',
  error: 'Copy Failed',
};

export const ShareButton: React.FC<ShareButtonProps> = ({
  getShareUrl,
  disabled = false,
}) => {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      return undefined;
    }
    const timer = window.setTimeout(() => setStatus('idle'), COPY_RESET_DELAY);
    return () => window.clearTimeout(timer);
  }, [status]);

  const handleShare = async () => {
    if (disabled || copying) return;
    const url = getShareUrl();
    setCopying(true);
    try {
      const success = await copyToClipboard(url);
      setStatus(success ? 'success' : 'error');
    } catch (error) {
      setStatus('error');
    } finally {
      setCopying(false);
    }
  };

  const label = statusLabel[status];
  const button = (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      startIcon={<ShareIcon fontSize="small" />}
      onClick={handleShare}
      disabled={disabled || copying}
      data-testid="share-visualization-button"
      aria-label="Copy shareable visualization link"
    >
      {label}
    </Button>
  );

  if (disabled) {
    return (
      <Tooltip title="Share link available once data loads">
        <span style={{ display: 'inline-flex' }}>{button}</span>
      </Tooltip>
    );
  }

  return (
    <>
      {button}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: 0,
        }}
      >
        {status === 'idle'
          ? ''
          : status === 'success'
            ? 'Share link copied to clipboard'
            : 'Unable to copy share link'}
      </span>
    </>
  );
};

export default ShareButton;

export const TESTING_EXPORTS = {
  fallbackCopy,
  copyToClipboard,
};
