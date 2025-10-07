# Key Component Implementations

## Critical Component Implementation Details

This document provides detailed implementation examples for the most important components in the Palmer Penguins Explorer application.

## FilterPanel - Responsive Collapsible Panel

```typescript
// FilterPanel.tsx - Responsive collapsible panel
export const FilterPanel: FC = () => {
  const { isTablet, isMobile } = useResponsive()
  const [isCollapsed, setCollapsed] = useState(isMobile)
  const filterCount = useFilterStore(state => state.activeFilterCount)

  if (isMobile) {
    return (
      <>
        <MobileFilterTrigger
          onClick={() => setCollapsed(false)}
          filterCount={filterCount}
        />
        <MobileFilterOverlay
          isOpen={!isCollapsed}
          onClose={() => setCollapsed(true)}
        >
          <FilterContent />
        </MobileFilterOverlay>
      </>
    )
  }

  return (
    <aside
      className={styles.panel}
      data-collapsed={isTablet ? isCollapsed : false}
      aria-label="Data filters"
    >
      {isTablet && (
        <button onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? '▶' : '▼'} Filters
        </button>
      )}
      <FilterContent />
    </aside>
  )
}
```

**Key Features:**

- Responsive behavior: fixed sidebar (desktop), collapsible (tablet), overlay (mobile)
- Accessibility: proper ARIA labeling and keyboard navigation
- State management: connects to filter store for active filter count
- Progressive enhancement: graceful degradation across breakpoints

## SpeciesFilter - Checkboxes with Live Counts

```typescript
// SpeciesFilter.tsx - Checkboxes with live counts
export const SpeciesFilter: FC = () => {
  const { selectedSpecies, speciesCounts, toggleSpecies } = useFilterStore()

  return (
    <fieldset>
      <legend>Species</legend>
      {SPECIES.map(species => (
        <label key={species} className={styles.checkbox}>
          <input
            type="checkbox"
            checked={selectedSpecies.has(species)}
            onChange={() => toggleSpecies(species)}
            aria-describedby={`${species}-count`}
          />
          <span>{species}</span>
          <span
            id={`${species}-count`}
            className={speciesCounts[species] === 0 ? styles.zero : ''}
          >
            ({speciesCounts[species]})
          </span>
        </label>
      ))}
    </fieldset>
  )
}
```

**Key Features:**

- Live count updates based on other active filters
- Accessibility: fieldset/legend structure, aria-describedby for counts
- Visual feedback: zero counts styled differently
- Direct integration with filter store

## ChartTypeSelector - Icon-Based Selection

```typescript
// ChartTypeSelector.tsx - Icon-based selection matching wireframe
export const ChartTypeSelector: FC = () => {
  const navigate = useNavigate()
  const { chartType } = useParams<{ chartType: ChartType }>()

  return (
    <div className={styles.chartSelector} role="tablist">
      <button
        role="tab"
        aria-selected={chartType === 'scatter'}
        onClick={() => navigate('/visualize/scatter')}
        aria-label="Scatter plot"
      >
        📊
      </button>
      <button
        role="tab"
        aria-selected={chartType === 'histogram'}
        onClick={() => navigate('/visualize/histogram')}
        aria-label="Histogram"
      >
        📈
      </button>
      <button
        role="tab"
        aria-selected={chartType === 'boxplot'}
        onClick={() => navigate('/visualize/boxplot')}
        aria-label="Box plot"
      >
        📉
      </button>
    </div>
  )
}
```

**Key Features:**

- ARIA tab pattern for accessible chart type selection
- Route-based state management via React Router
- Visual icon-based interface with text alternatives
- Semantic navigation between chart types

## WelcomeModal - First Visit Experience

```typescript
// WelcomeModal.tsx - First visit experience
export const WelcomeModal: FC = () => {
  const [isOpen, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('palmer-penguins-visited')
    if (!hasVisited) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('palmer-penguins-visited', 'true')
    }
    setOpen(false)
  }

  return (
    <StrudelModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Welcome to Palmer Penguins Explorer"
      size="medium"
    >
      <div className={styles.welcome}>
        <p>Explore data from 344 penguins collected at Palmer Station, Antarctica</p>

        <section>
          <h3>Dataset Variables</h3>
          <dl>
            <dt>Species</dt>
            <dd>Adelie, Chinstrap, or Gentoo</dd>
            <dt>Bill measurements</dt>
            <dd>Length and depth in millimeters</dd>
            <dt>Flipper length</dt>
            <dd>Length in millimeters</dd>
            <dt>Body mass</dt>
            <dd>Weight in grams</dd>
            <dt>Island</dt>
            <dd>Torgersen, Biscoe, or Dream</dd>
            <dt>Sex</dt>
            <dd>Male or Female (some unknown)</dd>
          </dl>
        </section>

        <section>
          <h3>Getting Started</h3>
          <ul>
            <li>Use the <strong>Table</strong> tab to browse the raw data</li>
            <li>Use the <strong>Visualizations</strong> tab to create charts</li>
            <li>Apply <strong>filters</strong> to focus on specific data subsets</li>
            <li>Export your visualizations as PNG or CSV files</li>
          </ul>
        </section>

        <label className={styles.dontShow}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Don't show this again
        </label>
      </div>
    </StrudelModal>
  )
}
```

**Key Features:**

- First-visit detection using localStorage
- User preference persistence for "don't show again"
- Comprehensive dataset introduction and usage guide
- Strudel Kit modal integration for consistent UI

## ScatterPlot - Interactive Chart Component

```typescript
// ScatterPlot.tsx - Interactive D3-powered scatter plot
export const ScatterPlot: FC<ScatterPlotProps> = ({
  data,
  xField,
  yField,
  colorField = 'species'
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const { width, height } = useResponsive()

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Clear previous content
    svg.selectAll('*').remove()

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xField]))
      .range([0, chartWidth])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[yField]))
      .range([chartHeight, 0])

    const colorScale = d3.scaleOrdinal()
      .domain(['adelie', 'chinstrap', 'gentoo'])
      .range(['#FF6B6B', '#4ECDC4', '#45B7D1'])

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 35)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text(formatFieldName(xField))

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -chartHeight / 2)
      .attr('fill', 'black')
      .style('text-anchor', 'middle')
      .text(formatFieldName(yField))

    // Add data points
    const circles = g.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d[xField]))
      .attr('cy', d => yScale(d[yField]))
      .attr('r', 4)
      .attr('fill', d => colorScale(d[colorField]))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d, i) =>
        `Data point ${i + 1}: ${d.species}, ${formatFieldName(xField)}: ${d[xField]}, ${formatFieldName(yField)}: ${d[yField]}`
      )

    // Add interactions
    circles
      .on('mouseenter', (event, d) => {
        const [x, y] = d3.pointer(event, svg.node())
        setTooltip({
          x: x + 10,
          y: y - 10,
          data: d
        })
      })
      .on('mouseleave', () => {
        setTooltip(null)
      })
      .on('focus', (event, d) => {
        const index = data.indexOf(d)
        setFocusedIndex(index)
        setTooltip({
          x: xScale(d[xField]) + margin.left + 10,
          y: yScale(d[yField]) + margin.top - 10,
          data: d
        })
      })
      .on('blur', () => {
        setFocusedIndex(-1)
        setTooltip(null)
      })

    // Keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.classList.contains('data-point')) {
        const currentIndex = Array.from(svg.selectAll('.data-point').nodes())
          .indexOf(document.activeElement as Element)

        let newIndex = currentIndex

        switch (event.key) {
          case 'ArrowRight':
            newIndex = Math.min(currentIndex + 1, data.length - 1)
            break
          case 'ArrowLeft':
            newIndex = Math.max(currentIndex - 1, 0)
            break
          case 'ArrowDown':
            newIndex = Math.min(currentIndex + 10, data.length - 1)
            break
          case 'ArrowUp':
            newIndex = Math.max(currentIndex - 10, 0)
            break
          case 'Escape':
            (document.activeElement as HTMLElement)?.blur()
            return
        }

        if (newIndex !== currentIndex) {
          event.preventDefault()
          const newElement = svg.selectAll('.data-point').nodes()[newIndex] as HTMLElement
          newElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }

  }, [data, xField, yField, colorField, width, height])

  return (
    <div className={styles.chartContainer}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        role="img"
        aria-label={`Scatter plot of ${formatFieldName(xField)} vs ${formatFieldName(yField)}`}
        aria-describedby="chart-description"
      />

      <div id="chart-description" className="sr-only">
        Scatter plot showing the relationship between {formatFieldName(xField)} and {formatFieldName(yField)}
        for {data.length} penguins. Use arrow keys to navigate between data points.
      </div>

      {tooltip && (
        <ChartTooltip
          x={tooltip.x}
          y={tooltip.y}
          data={tooltip.data}
          xField={xField}
          yField={yField}
        />
      )}
    </div>
  )
}
```

**Key Features:**

- D3.js integration for high-performance rendering
- Full keyboard navigation support
- Interactive tooltips on hover and focus
- Responsive sizing based on container dimensions
- Screen reader support with proper ARIA labels
- Color-coded species differentiation

## DataTable - Accessible Data Display

```typescript
// DataTable.tsx - Strudel-powered accessible data table
export const DataTable: FC<DataTableProps> = ({ data, onSort }) => {
  const [sortField, setSortField] = useState<keyof Penguin>('species')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortField, sortDirection])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (field: keyof Penguin) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting
    onSort?.(field, sortDirection)
  }

  const totalPages = Math.ceil(sortedData.length / pageSize)

  return (
    <div className={styles.tableContainer}>
      <StrudelTable
        aria-label={`Penguin data table showing ${data.length} records`}
        className={styles.dataTable}
      >
        <StrudelTableHead>
          <StrudelTableRow>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('species')}
                className={styles.sortButton}
                aria-label={`Sort by species ${sortField === 'species' ? sortDirection : ''}`}
              >
                Species
                {sortField === 'species' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('island')}
                className={styles.sortButton}
                aria-label={`Sort by island ${sortField === 'island' ? sortDirection : ''}`}
              >
                Island
                {sortField === 'island' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('bill_length_mm')}
                className={styles.sortButton}
                aria-label={`Sort by bill length ${sortField === 'bill_length_mm' ? sortDirection : ''}`}
              >
                Bill Length (mm)
                {sortField === 'bill_length_mm' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('bill_depth_mm')}
                className={styles.sortButton}
                aria-label={`Sort by bill depth ${sortField === 'bill_depth_mm' ? sortDirection : ''}`}
              >
                Bill Depth (mm)
                {sortField === 'bill_depth_mm' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('flipper_length_mm')}
                className={styles.sortButton}
                aria-label={`Sort by flipper length ${sortField === 'flipper_length_mm' ? sortDirection : ''}`}
              >
                Flipper Length (mm)
                {sortField === 'flipper_length_mm' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('body_mass_g')}
                className={styles.sortButton}
                aria-label={`Sort by body mass ${sortField === 'body_mass_g' ? sortDirection : ''}`}
              >
                Body Mass (g)
                {sortField === 'body_mass_g' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
            <StrudelTableHeaderCell>
              <button
                onClick={() => handleSort('sex')}
                className={styles.sortButton}
                aria-label={`Sort by sex ${sortField === 'sex' ? sortDirection : ''}`}
              >
                Sex
                {sortField === 'sex' && (
                  <span className={styles.sortIcon}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </StrudelTableHeaderCell>
          </StrudelTableRow>
        </StrudelTableHead>
        <StrudelTableBody>
          {paginatedData.map((penguin, index) => (
            <StrudelTableRow key={`${penguin.species}-${penguin.island}-${index}`}>
              <StrudelTableCell>{penguin.species}</StrudelTableCell>
              <StrudelTableCell>{penguin.island}</StrudelTableCell>
              <StrudelTableCell>
                {penguin.bill_length_mm ? penguin.bill_length_mm.toFixed(1) : '—'}
              </StrudelTableCell>
              <StrudelTableCell>
                {penguin.bill_depth_mm ? penguin.bill_depth_mm.toFixed(1) : '—'}
              </StrudelTableCell>
              <StrudelTableCell>
                {penguin.flipper_length_mm ? penguin.flipper_length_mm.toFixed(0) : '—'}
              </StrudelTableCell>
              <StrudelTableCell>
                {penguin.body_mass_g ? penguin.body_mass_g.toFixed(0) : '—'}
              </StrudelTableCell>
              <StrudelTableCell>{penguin.sex || '—'}</StrudelTableCell>
            </StrudelTableRow>
          ))}
        </StrudelTableBody>
      </StrudelTable>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={sortedData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
```

**Key Features:**

- Strudel Kit table components for consistent styling
- Full keyboard navigation and screen reader support
- Sortable columns with visual indicators
- Pagination for large datasets
- Proper handling of missing values
- Accessible sort button labels with current state
