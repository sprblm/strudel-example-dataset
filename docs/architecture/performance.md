# Performance Optimizations

## Performance Requirements

The Palmer Penguins Explorer is designed to meet strict performance requirements:

- **Initial Load**: < 2 seconds to first contentful paint
- **Filter Updates**: < 100ms response time
- **Chart Renders**: < 300ms for visualization updates
- **Bundle Size**: < 500KB total JavaScript
- **Lighthouse Score**: > 90 for performance, accessibility, and best practices

## Bundle Optimization Strategy

### Code Splitting and Lazy Loading

```typescript
// Lazy load chart components to reduce initial bundle size
const lazyLoadCharts = {
  ScatterPlot: lazy(() => import('./charts/ScatterPlot')),
  Histogram: lazy(() => import('./charts/Histogram')),
  BoxPlot: lazy(() => import('./charts/BoxPlot'))
}

// Lazy load heavy dependencies
const ExportUtilities = lazy(() => import('./utils/exportHelpers'))
const AdvancedFilters = lazy(() => import('./components/filters/AdvancedFilters'))

// Route-based code splitting
const TableRoute = lazy(() => import('./routes/TableRoute'))
const VisualizationRoute = lazy(() => import('./routes/VisualizationRoute'))
```

### Bundle Splitting Configuration

```typescript
// vite.config.ts - Optimized bundle splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework chunks
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // State management
          'state': ['zustand'],
          
          // UI framework
          'strudel': ['@strudel-ui/react'],
          
          // Visualization libraries
          'charts': ['d3-scale', 'd3-selection', 'd3-axis', 'd3-shape'],
          
          // Export functionality
          'export': ['html2canvas', 'file-saver'],
          
          // Development tools (only in dev)
          ...(process.env.NODE_ENV === 'development' && {
            'devtools': ['@tanstack/react-query-devtools']
          })
        }
      }
    },
    
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    
    // Generate source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development'
  },
  
  // Asset optimization
  assetsInclude: ['**/*.json'], // Treat JSON as assets for better caching
})
```

## Runtime Performance Optimizations

### Memoization Strategy

```typescript
// Component memoization for expensive renders
const ChartMemo = memo(({ data, config }) => {
  const optimizedData = useMemo(
    () => preprocessForD3(data),
    [data]
  )

  return <ChartComponent data={optimizedData} {...config} />
}, (prev, next) => {
  // Custom comparison for optimal re-rendering
  return shallowEqual(prev.data, next.data) &&
         shallowEqual(prev.config, next.config)
})

// Memoized selectors for expensive computations
export const getFilteredPenguins = createSelector(
  [(state) => state.penguins, (state) => state.filters],
  (penguins, filters) => {
    // Expensive filtering operation is cached
    return penguins.filter(penguin => matchesAllFilters(penguin, filters))
  }
)

// Memoized chart data transformations
export const getChartData = createSelector(
  [getFilteredPenguins, (state) => state.chartConfig],
  (penguins, config) => {
    // Chart-specific data transformation is cached
    return transformDataForChart(penguins, config)
  }
)
```

### Debounced Updates

```typescript
// Debounced URL updates to prevent excessive history entries
const debouncedURLUpdate = useMemo(
  () => debounce(updateURLParams, 100),
  []
)

// Debounced filter announcements for screen readers
const debouncedAnnouncement = useMemo(
  () => debounce((count: number) => {
    announceToScreenReader(`Showing ${count} penguins`)
  }, 300),
  []
)

// Debounced search functionality
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query)
  }, 150),
  []
)
```

### Virtual Scrolling for Large Datasets

```typescript
// Virtual scrolling for data table performance
export const VirtualizedDataTable: FC<VirtualizedTableProps> = ({ 
  data, 
  rowHeight = 40 
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(400)
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / rowHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / rowHeight) + 1,
      data.length
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, containerHeight, rowHeight, data.length])

  const visibleData = useMemo(() => {
    return data.slice(visibleRange.startIndex, visibleRange.endIndex)
  }, [data, visibleRange])

  const totalHeight = data.length * rowHeight
  const offsetY = visibleRange.startIndex * rowHeight

  return (
    <div 
      className={styles.virtualScrollContainer}
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleData.map((row, index) => (
            <TableRow
              key={visibleRange.startIndex + index}
              data={row}
              style={{ height: rowHeight }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Data Loading Optimizations

### Efficient Data Fetching

```typescript
// Optimized data loading with caching and compression
export const useOptimizedDataFetch = () => {
  const [data, setData] = useState<Penguin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for cached data first
        const cached = getCachedData()
        if (cached) {
          setData(cached)
          setLoading(false)
          return
        }

        // Fetch with compression support
        const response = await fetch('/penguins.json', {
          headers: {
            'Accept-Encoding': 'gzip, compress, br'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const rawData = await response.json()
        
        // Validate and transform data
        const validatedData = validateAndTransformData(rawData)
        
        // Cache for future use
        cacheData(validatedData)
        
        setData(validatedData)
        setLoading(false)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}
```

### Data Preprocessing

```typescript
// Preprocess data for optimal filtering and charting performance
export const preprocessPenguinData = (rawData: any[]): ProcessedPenguinData => {
  const processed = rawData.map(penguin => ({
    ...penguin,
    // Pre-compute derived fields
    billRatio: penguin.bill_length_mm / penguin.bill_depth_mm,
    bodyMassCategory: categorizeBMI(penguin.body_mass_g),
    // Normalize strings for consistent filtering
    species: penguin.species.toLowerCase(),
    island: penguin.island.toLowerCase(),
    sex: penguin.sex?.toLowerCase() || 'unknown'
  }))

  // Create lookup maps for O(1) filtering performance
  const speciesMap = new Map<Species, Penguin[]>()
  const islandMap = new Map<Island, Penguin[]>()
  const sexMap = new Map<Sex, Penguin[]>()

  processed.forEach(penguin => {
    // Populate species map
    if (!speciesMap.has(penguin.species)) {
      speciesMap.set(penguin.species, [])
    }
    speciesMap.get(penguin.species)!.push(penguin)

    // Populate island map
    if (!islandMap.has(penguin.island)) {
      islandMap.set(penguin.island, [])
    }
    islandMap.get(penguin.island)!.push(penguin)

    // Populate sex map
    if (!sexMap.has(penguin.sex)) {
      sexMap.set(penguin.sex, [])
    }
    sexMap.get(penguin.sex)!.push(penguin)
  })

  return {
    penguins: processed,
    lookupMaps: { speciesMap, islandMap, sexMap },
    statistics: computeDataStatistics(processed)
  }
}
```

## Chart Rendering Optimizations

### Canvas vs SVG Optimization

```typescript
// Adaptive rendering based on data size
export const AdaptiveChart: FC<ChartProps> = ({ data, type, config }) => {
  const shouldUseCanvas = data.length > 1000 // Use canvas for large datasets
  
  if (shouldUseCanvas) {
    return (
      <CanvasChart 
        data={data} 
        type={type} 
        config={config}
        optimizations={{
          enableWebGL: true,
          useOffscreenCanvas: true,
          batchUpdates: true
        }}
      />
    )
  }
  
  return (
    <SVGChart 
      data={data} 
      type={type} 
      config={config}
      optimizations={{
        useVirtualization: data.length > 500,
        enableTransitions: data.length < 200
      }}
    />
  )
}
```

### D3 Performance Optimizations

```typescript
// Optimized D3 chart rendering
export const OptimizedScatterPlot: FC<ScatterPlotProps> = ({ 
  data, 
  xField, 
  yField 
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    
    // Use requestAnimationFrame for smooth updates
    const updateChart = () => {
      // Batch DOM updates
      const update = svg.selectAll('.data-point')
        .data(data, (d: any) => d.id) // Use key function for efficient updates

      // Enter selection for new points
      const enter = update.enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('r', 0) // Start with radius 0 for animation

      // Update selection for existing points
      const enterUpdate = enter.merge(update)
        .transition()
        .duration(300)
        .ease(d3.easeQuadOut)
        .attr('cx', d => xScale(d[xField]))
        .attr('cy', d => yScale(d[yField]))
        .attr('r', 4)

      // Exit selection for removed points
      update.exit()
        .transition()
        .duration(200)
        .attr('r', 0)
        .remove()
    }

    // Use RAF for smooth animations
    requestAnimationFrame(updateChart)
    
  }, [data, xField, yField])

  return <svg ref={svgRef} />
}
```

## Memory Management

### Component Cleanup

```typescript
// Proper cleanup to prevent memory leaks
export const ChartComponent: FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<D3Chart | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    // Initialize chart
    chartRef.current = new D3Chart(data)
    
    // Setup resize observer
    resizeObserverRef.current = new ResizeObserver(() => {
      chartRef.current?.resize()
    })
    
    return () => {
      // Cleanup chart resources
      chartRef.current?.destroy()
      chartRef.current = null
      
      // Cleanup resize observer
      resizeObserverRef.current?.disconnect()
      resizeObserverRef.current = null
    }
  }, [])

  useEffect(() => {
    // Update chart data
    chartRef.current?.updateData(data)
  }, [data])

  return <div ref={chartRef} />
}
```

### Store Optimization

```typescript
// Optimized Zustand store with cleanup
export const useOptimizedFilterStore = create<FilterStore>((set, get) => ({
  // ... store implementation
  
  // Cleanup function for memory management
  cleanup: () => {
    // Clear large data structures
    set({
      cachedResults: new Map(),
      computationCache: new Map(),
      eventHandlers: new Set()
    })
    
    // Cancel pending operations
    get().cancelPendingOperations?.()
  }
}))

// Auto-cleanup on unmount
export const useStoreCleanup = () => {
  useEffect(() => {
    return () => {
      useOptimizedFilterStore.getState().cleanup()
    }
  }, [])
}
```

## Performance Monitoring

### Real User Monitoring

```typescript
// Performance monitoring utilities
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    getCLS(onCLS)
    getFID(onFID)
    getFCP(onFCP)
    getLCP(onLCP)
    getTTFB(onTTFB)
    
    function onCLS(metric: Metric) {
      reportMetric('CLS', metric.value)
    }
    
    function onFID(metric: Metric) {
      reportMetric('FID', metric.value)
    }
    
    function onFCP(metric: Metric) {
      reportMetric('FCP', metric.value)
    }
    
    function onLCP(metric: Metric) {
      reportMetric('LCP', metric.value)
    }
    
    function onTTFB(metric: Metric) {
      reportMetric('TTFB', metric.value)
    }
  }, [])
}

// Custom performance markers
export const measureChartRenderTime = (chartType: string) => {
  const startTime = performance.now()
  
  return {
    end: () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      reportMetric('chart_render_time', duration, {
        chart_type: chartType,
        data_size: getCurrentDataSize()
      })
    }
  }
}
```

### Performance Budget Enforcement

```typescript
// lighthouse.config.js - Performance budgets
module.exports = {
  ci: {
    assert: {
      assertions: {
        // Core Web Vitals thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Bundle size constraints
        'resource-summary:script:size': ['error', { maxNumericValue: 512000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 25000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 100000 }],
        
        // Performance score
        'categories:performance': ['error', { minScore: 0.9 }]
      }
    }
  }
}
```

## Caching Strategy

### Browser Caching

```typescript
// Service worker for aggressive caching
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/penguins.json')) {
    // Cache dataset for offline use
    event.respondWith(
      caches.open('penguin-data-v1').then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            // Serve from cache
            return response
          }
          
          // Fetch and cache
          return fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
      })
    )
  }
})
```

### Application-Level Caching

```typescript
// Multi-level caching strategy
class CacheManager {
  private memoryCache = new Map<string, any>()
  private persistentCache = new Map<string, any>()
  
  // Memory cache for frequently accessed data
  setMemoryCache(key: string, value: any, ttl = 300000) { // 5 minutes
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }
  
  getMemoryCache(key: string) {
    const item = this.memoryCache.get(key)
    if (!item || Date.now() > item.expires) {
      this.memoryCache.delete(key)
      return null
    }
    return item.value
  }
  
  // Persistent cache for data that survives page reloads
  setPersistentCache(key: string, value: any, ttl = 86400000) { // 24 hours
    try {
      const item = {
        value,
        expires: Date.now() + ttl
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to set persistent cache:', error)
    }
  }
  
  getPersistentCache(key: string) {
    try {
      const item = localStorage.getItem(`cache_${key}`)
      if (!item) return null
      
      const parsed = JSON.parse(item)
      if (Date.now() > parsed.expires) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }
      
      return parsed.value
    } catch (error) {
      console.warn('Failed to get persistent cache:', error)
      return null
    }
  }
}
```