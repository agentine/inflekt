# @agentine/inflekt

[![npm version](https://img.shields.io/npm/v/@agentine/inflekt.svg)](https://www.npmjs.com/package/@agentine/inflekt)
[![npm downloads](https://img.shields.io/npm/dm/@agentine/inflekt.svg)](https://www.npmjs.com/package/@agentine/inflekt)
[![CI](https://github.com/agentine/inflekt/actions/workflows/ci.yml/badge.svg)](https://github.com/agentine/inflekt/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

TypeScript-first pluralization and singularization engine — drop-in replacement for [pluralize](https://github.com/blakeembrey/pluralize).

## Why inflekt?

| | pluralize | @agentine/inflekt |
|---|---|---|
| TypeScript types included | ❌ | ✅ |
| ESM support | ❌ | ✅ |
| CJS support | ✅ | ✅ |
| Zero dependencies | ✅ | ✅ |
| Actively maintained | ❌ (last release 2019) | ✅ |
| "cookie" → "cookies" | ❌ ("cooky") | ✅ |
| "deceased" → "deceased" | ❌ ("deceaseds") | ✅ |
| Uncountable: feedback, species, hertz | ❌ | ✅ |
| Compound/hyphenated words | ❌ | ✅ |

## Installation

```bash
npm install @agentine/inflekt
```

## Usage

```typescript
import { plural, singular, inflect, isPlural, isSingular } from '@agentine/inflekt';

plural('person');        // 'people'
plural('cookie');        // 'cookies'
plural('cactus');        // 'cacti'

singular('people');      // 'person'
singular('cookies');     // 'cookie'
singular('analyses');    // 'analysis'

inflect('cat', 1);       // 'cat'
inflect('cat', 3);       // 'cats'
inflect('cat', 3, true); // '3 cats'

isPlural('cats');         // true
isSingular('cat');        // true
```

## API

### `plural(word: string): string`

Returns the plural form of a word.

### `singular(word: string): string`

Returns the singular form of a word.

### `inflect(word: string, count: number, inclusive?: boolean): string`

Returns singular when count is 1, plural otherwise. If `inclusive` is true, prepends the count.

### `isPlural(word: string): boolean`

Returns true if the word is in plural form (or is uncountable).

### `isSingular(word: string): boolean`

Returns true if the word is in singular form (or is uncountable).

### `addPluralRule(rule: string | RegExp, replacement: string): void`

Add a custom pluralization rule.

### `addSingularRule(rule: string | RegExp, replacement: string): void`

Add a custom singularization rule.

### `addIrregularRule(singular: string, plural: string): void`

Add a custom irregular word pair.

### `addUncountableRule(word: string | RegExp): void`

Add a word or pattern that should not be pluralized/singularized.

## Migration from pluralize

`@agentine/inflekt` is a drop-in replacement. Change your import:

```diff
- const pluralize = require('pluralize');
+ import { plural, singular, inflect, isPlural, isSingular, addPluralRule, addSingularRule, addIrregularRule, addUncountableRule } from '@agentine/inflekt';
```

Function mapping:

| pluralize | inflekt |
|---|---|
| `pluralize(word)` | `plural(word)` |
| `pluralize.singular(word)` | `singular(word)` |
| `pluralize(word, count)` | `inflect(word, count)` |
| `pluralize(word, count, true)` | `inflect(word, count, true)` |
| `pluralize.isPlural(word)` | `isPlural(word)` |
| `pluralize.isSingular(word)` | `isSingular(word)` |
| `pluralize.addPluralRule(...)` | `addPluralRule(...)` |
| `pluralize.addSingularRule(...)` | `addSingularRule(...)` |
| `pluralize.addIrregularRule(...)` | `addIrregularRule(...)` |
| `pluralize.addUncountableRule(...)` | `addUncountableRule(...)` |

## License

MIT
