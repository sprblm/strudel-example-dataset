# Responsive Design Patterns

## Requirements
1. Charts must resize with container
2. Minimum dimensions: 300x200
3. Maximum dimensions: 100% of container

## Implementation Guidelines

### ResizeObserver Pattern

```tsx
class ResizeObserverComponent {
  observer: ResizeObserver | null = null;

  componentDidMount() {
    const container = this.containerRef.current;
    if (!container) return;

    this.observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height  = entry.contentRect;
        this.setState({ width, height });
      }
    });
    this.observer.observe(container);
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }
}
```

### Best Practices
- Use relative units (%, vw, vh) for container sizing
- Set min-width/min-height on chart container
- Debounce resize events if processing heavy