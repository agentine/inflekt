# inflekt — Alternative to pluralize

## Overview

**Replaces:** [pluralize](https://github.com/blakeembrey/pluralize) (npm)
**Package name:** `@agentine/inflekt`
**Language:** TypeScript (compiles to ESM + CJS)
**License:** MIT

## Problem

`pluralize` is the dominant npm package for English word pluralization and singularization with ~24M weekly downloads. It has been effectively abandoned:

- Last release: May 2019 (v8.0.0) — 7 years ago
- 33 open issues with known incorrect pluralization rules
- 25 open PRs ignored (oldest from Nov 2017)
- Single maintainer, no activity
- No built-in TypeScript types
- CommonJS only, no ESM support
- Known incorrect outputs: "deceased" → "deceaseds", "cookie" → "cooky"
- Missing rules for many common words (feedback, species, hertz, etc.)
- No compound word handling

No established drop-in replacement exists. `plur` is simpler (no singularization). `make-plural` handles CLDR plural categories (different purpose).

## Scope

A TypeScript-first, drop-in replacement for `pluralize` that:

1. **Pluralizes** English words: `inflekt.plural('person')` → `'people'`
2. **Singularizes** English words: `inflekt.singular('people')` → `'person'`
3. **Auto-selects** based on count: `inflekt.inflect('person', 3)` → `'people'`
4. **Detects** plural/singular: `inflekt.isPlural('people')` → `true`
5. **Custom rules** via API: `inflekt.addIrregular('octopus', 'octopi')`

## Architecture

### Module Structure

```
src/
  index.ts          # Public API exports
  plural.ts         # Pluralization engine (rules + apply)
  singular.ts       # Singularization engine (rules + apply)
  rules.ts          # Shared rule types and helpers
  irregulars.ts     # Irregular word map (bidirectional)
  uncountables.ts   # Uncountable words set
```

### Design Decisions

- **Rule-based engine:** Ordered regex replacement rules (same proven approach as pluralize)
- **Bidirectional irregular map:** Single source of truth for irregular pairs
- **Uncountable set:** Words that don't change form (e.g., "sheep", "fish", "feedback")
- **Case preservation:** Match original casing pattern (uppercase, lowercase, title case)
- **No dependencies:** Zero runtime dependencies
- **Tree-shakeable:** Named exports for individual functions

### Improvements Over pluralize

1. **TypeScript-first** with full type definitions included
2. **ESM + CJS** dual-package output
3. **Expanded word rules** — fix all 33 known issues from pluralize
4. **Compound word support** — handle hyphenated and multi-word inputs
5. **Better test coverage** — comprehensive test suite with edge cases
6. **Smaller bundle** — target <1KB minified+gzipped

## Deliverables

- `@agentine/inflekt` npm package
- Full API compatibility with pluralize (drop-in replacement)
- TypeScript types included
- ESM and CJS builds
- Comprehensive test suite
- README with migration guide from pluralize

## API Surface

```typescript
// Core functions
export function plural(word: string): string;
export function singular(word: string): string;
export function inflect(word: string, count: number, inclusive?: boolean): string;
export function isPlural(word: string): boolean;
export function isSingular(word: string): boolean;

// Customization
export function addPluralRule(rule: string | RegExp, replacement: string): void;
export function addSingularRule(rule: string | RegExp, replacement: string): void;
export function addIrregularRule(singular: string, plural: string): void;
export function addUncountableRule(word: string | RegExp): void;
```
