#!/bin/bash

# Script to help commit files related to compare-data page

# Add all compare-data files to staging
git add src/pages/compare-data/-context/ContextProvider.tsx 2>/dev/null || true
git add src/pages/compare-data/-context/actions.ts 2>/dev/null || true
git add src/pages/compare-data/-tests/compare-data.cy.ts 2>/dev/null || true
git add src/pages/compare-data/_layout.tsx 2>/dev/null || true
git add src/pages/compare-data/_layout/compare.tsx 2>/dev/null || true
git add src/pages/compare-data/_layout/index.tsx 2>/dev/null || true
git add src/pages/compare-data/_layout/new.tsx 2>/dev/null || true

# Commit these changes
git commit -m "feat: remove compare-data page and related components"

echo "Compare-data page removal committed."