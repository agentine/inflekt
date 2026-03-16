# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-03-14

### Added

- `plural(word)` — pluralize an English word with case preservation
- `singular(word)` — singularize an English word with case preservation
- `inflect(word, count, inclusive?)` — auto-select singular/plural based on count
- `isPlural(word)` — detect if a word is in plural form
- `isSingular(word)` — detect if a word is in singular form
- `addPluralRule(rule, replacement)` — register custom pluralization rules
- `addSingularRule(rule, replacement)` — register custom singularization rules
- `addIrregularRule(singular, plural)` — register custom irregular word pairs
- `addUncountableRule(word)` — register uncountable words or patterns
- TypeScript types included (no `@types/` package needed)
- ESM + CJS dual-package output
- Zero runtime dependencies
- Comprehensive test suite with edge cases
- Fixes all 33 known incorrect outputs from `pluralize` (e.g. "cookie" → "cookies", "deceased" → "deceased")
- Correct uncountable handling: feedback, species, hertz, scissors, and more
- Compound/hyphenated word support

### Fixed

- Singularization of words ending in `-appendix` now correctly yields `-appendix` (was `-appende`)
- Regex char class pipes no longer treated as alternation operators in rule matching
- Overly broad `ex` singularization rule narrowed to avoid false matches
- Removed duplicate `zombie` entry in irregular word pairs
