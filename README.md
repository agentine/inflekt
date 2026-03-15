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
| `"cookie"` → `"cookies"` | ❌ (`"cooky"`) | ✅ |
| `"deceased"` → `"deceased"` | ❌ (`"deceaseds"`) | ✅ |
| Uncountable: feedback, species, hertz | ❌ | ✅ |
| Compound/hyphenated words | ❌ | ✅ |

## Installation

```bash
npm install @agentine/inflekt
```

Requires Node.js >=20.

## Usage

```typescript
import { plural, singular, inflect, isPlural, isSingular } from '@agentine/inflekt';

// Pluralize
plural('person');        // 'people'
plural('cookie');        // 'cookies'
plural('cactus');        // 'cacti'
plural('analysis');      // 'analyses'
plural('matrix');        // 'matrices'

// Singularize
singular('people');      // 'person'
singular('cookies');     // 'cookie'
singular('analyses');    // 'analysis'
singular('matrices');    // 'matrix'
singular('cacti');       // 'cactus'

// Count-based inflection
inflect('cat', 1);       // 'cat'
inflect('cat', 3);       // 'cats'
inflect('cat', 3, true); // '3 cats'
inflect('cat', 0, true); // '0 cats'

// Detection
isPlural('cats');        // true
isPlural('sheep');       // true  (uncountable)
isSingular('cat');       // true
isSingular('fish');      // true  (uncountable)
```

### Case preservation

inflekt preserves the original casing pattern of the input word.

```typescript
plural('cat');     // 'cats'
plural('Cat');     // 'Cats'
plural('CAT');     // 'CATS'
plural('Person');  // 'People'
plural('PERSON');  // 'PEOPLE'
```

### Compound words

Hyphenated words are supported — the last component is inflected.

```typescript
plural('mother-in-law');   // 'mother-in-laws'
plural('test-case');       // 'test-cases'
```

## API

### `plural(word: string): string`

Returns the plural form of `word`. Preserves original casing. Returns uncountable words unchanged.

```typescript
plural('leaf');      // 'leaves'
plural('datum');     // 'data'
plural('feedback');  // 'feedback'  (uncountable)
```

### `singular(word: string): string`

Returns the singular form of `word`. Preserves original casing. Returns uncountable words unchanged.

```typescript
singular('leaves');   // 'leaf'
singular('data');     // 'datum'
singular('sheep');    // 'sheep'  (uncountable)
```

### `inflect(word: string, count: number, inclusive?: boolean): string`

Returns the singular form when `count === 1`, otherwise the plural form. If `inclusive` is `true`, the count is prepended with a space.

```typescript
inflect('cat', 1);        // 'cat'
inflect('cat', 2);        // 'cats'
inflect('cat', 1, true);  // '1 cat'
inflect('cat', 5, true);  // '5 cats'
```

### `isPlural(word: string): boolean`

Returns `true` if the word appears to be in plural form, or is uncountable.

```typescript
isPlural('cats');     // true
isPlural('cat');      // false
isPlural('sheep');    // true  (uncountable)
```

### `isSingular(word: string): boolean`

Returns `true` if the word appears to be in singular form, or is uncountable.

```typescript
isSingular('cat');    // true
isSingular('cats');   // false
isSingular('fish');   // true  (uncountable)
```

### `addPluralRule(rule: string | RegExp, replacement: string): void`

Registers a custom pluralization rule. Rules added later take precedence over earlier ones. `replacement` follows the same capture-group syntax as `String.prototype.replace`.

```typescript
addPluralRule(/gex$/i, 'gices');
plural('regex');  // 'regices'
```

### `addSingularRule(rule: string | RegExp, replacement: string): void`

Registers a custom singularization rule. Rules added later take precedence.

```typescript
addSingularRule(/gices$/i, 'gex');
singular('regices');  // 'regex'
```

### `addIrregularRule(singular: string, plural: string): void`

Registers a custom irregular word pair.

```typescript
addIrregularRule('pokemon', 'pokemon');  // treat as uncountable-like irregular
addIrregularRule('octopus', 'octopi');
```

### `addUncountableRule(word: string | RegExp): void`

Registers a word or pattern as uncountable — `plural` and `singular` return it unchanged.

```typescript
addUncountableRule('pokemon');
plural('pokemon');     // 'pokemon'
singular('pokemon');   // 'pokemon'

addUncountableRule(/craft$/i);
plural('hovercraft');  // 'hovercraft'
plural('aircraft');    // 'aircraft'
```

## Pluralization rules overview

Rules are applied in priority order (higher-priority rules override lower ones). The engine checks, in sequence:

1. **Empty/whitespace** — returned as-is.
2. **Compound words** — hyphenated inputs split on `-`; the last segment is inflected recursively.
3. **Uncountables** — words in the uncountable set or matching an uncountable regex are returned unchanged.
4. **Irregulars** — exact matches in the irregular map (e.g. `person` → `people`) are returned with case preserved.
5. **Regex rules** — applied in reverse registration order (last registered = highest priority).

### Pluralization regex rules (ordered, last = highest priority)

| Pattern | Replacement | Example |
|---|---|---|
| `$` | `s` | cat → cats |
| `s$` | `s` | bus → bus (no-op) |
| `(bu\|mis\|gas)s$` | `$1ses` | bus → buses |
| `([ti])um$` | `$1a` | datum → data |
| `([ti])a$` | `$1a` | data → data (no-op) |
| `sis$` | `ses` | analysis → analyses |
| `(?:([^f])fe\|...)f$` | `$1$2ves` | knife → knives |
| `(hive)s?$` | `$1s` | hive → hives |
| `([^aeiouy]\|qu)y$` | `$1ies` | baby → babies |
| `(x\|ch\|ss\|sh)$` | `$1es` | box → boxes |
| `([ml])ouse$` | `$1ice` | mouse → mice |
| `([ml])ice$` | `$1ice` | mice → mice (no-op) |
| `^(ox)$` | `$1en` | ox → oxen |
| `(quiz)$` | `$1zes` | quiz → quizzes |
| `(database)s?$` | `$1s` | database → databases |
| `([^aeiou])ies$` | `$1ies` | babies → babies (no-op) |
| `(ch\|sh\|x\|ss)es$` | `$1es` | boxes → boxes (no-op) |
| `(alias\|status\|...)$` | `$1es` | status → statuses |
| `(buffal\|tomat\|...)o$` | `$1oes` | tomato → tomatoes |
| `(matr\|append)ix$\|(vert\|ind)ex$` | `$1$2ices` | matrix → matrices |
| `(octop\|vir\|...)us$` | `$1i` | cactus → cacti |
| `(octop\|vir\|...)i$` | `$1i` | cacti → cacti (no-op) |
| `(ax\|test)is$` | `$1es` | axis → axes |

### Singularization regex rules (ordered, last = highest priority)

| Pattern | Replacement | Example |
|---|---|---|
| `s$` | `` | cats → cat |
| `ss$` | `ss` | kiss → kiss (no-op) |
| `(n)ews$` | `$1ews` | news → news (uncountable, no-op) |
| `([ti])a$` | `$1um` | data → datum |
| `([^f])ves$` | `$1fe` | knives → knife |
| `(hive)s$` | `$1` | hives → hive |
| `(tive)s$` | `$1` | natives → native |
| `([^aeiouy]\|qu)ies$` | `$1y` | babies → baby |
| `ies$` | `y` | series (handled by irregulars) |
| `(s)eries$` | `$1eries` | series → series (no-op) |
| `(m)ovies$` | `$1ovie` | movies → movie |
| `(x\|ch\|ss\|sh)es$` | `$1` | boxes → box |
| `([ml])ice$` | `$1ouse` | mice → mouse |
| `(bus)es$` | `$1` | buses → bus |
| `(o)es$` | `$1` | tomatoes → tomato |
| `(shoe)s$` | `$1` | shoes → shoe |
| `(octop\|vir\|...)i$` | `$1us` | cacti → cactus |
| `(alias\|status\|...)es$` | `$1` | statuses → status |
| `^(ox)en` | `$1` | oxen → ox |
| `(quiz)zes$` | `$1` | quizzes → quiz |
| `([lr])ves$` | `$1f` | halves → half |
| `(cris\|ax\|test)es$` | `$1is` | axes → axis |
| `((a)naly\|...)ses$` | `$1sis` | analyses → analysis |
| `(matr\|suff\|append)ices$` | `$1ix` | matrices → matrix |
| `(vert\|ind)ices$` | `$1ex` | vertices → vertex |
| `(database)s$` | `$1` | databases → database |

## Irregular words

These word pairs bypass the regex rules entirely. Both directions are registered (singular ↔ plural).

| Singular | Plural |
|---|---|
| person | people |
| man | men |
| woman | women |
| child | children |
| tooth | teeth |
| foot | feet |
| goose | geese |
| ox | oxen |
| mouse | mice |
| quiz | quizzes |
| cookie | cookies |
| movie | movies |
| rookie | rookies |
| smoothie | smoothies |
| hero | heroes |
| potato | potatoes |
| tomato | tomatoes |
| volcano | volcanoes |
| tornado | tornadoes |
| torpedo | torpedoes |
| domino | dominoes |
| mosquito | mosquitoes |
| echo | echoes |
| veto | vetoes |
| dingo | dingoes |
| leaf | leaves |
| life | lives |
| genus | genera |
| opus | opera |
| oasis | oases |
| cactus (via rule) | cacti |
| I | we |
| me | us |
| he / she | they |
| is | are |
| was | were |
| has | have |
| this | these |
| that | those |

_And many more — see [`src/irregulars.ts`](src/irregulars.ts) for the complete list._

## Uncountable words

These words have the same singular and plural form:

`adulthood`, `advice`, `agenda`, `aircraft`, `alcohol`, `ammo`, `analytics`, `anime`, `athletics`, `bison`, `blood`, `bream`, `buffalo`, `butter`, `carp`, `cash`, `chassis`, `chess`, `clothing`, `cod`, `commerce`, `cooperation`, `corps`, `debris`, `deceased`, `deer`, `diabetes`, `digestion`, `elk`, `electricity`, `emoji`, `equipment`, `evidence`, `evolution`, `faith`, `feedback`, `firmware`, `fish`, `flora`, `flounder`, `fun`, `furniture`, `gallows`, `garbage`, `gold`, `golf`, `graffiti`, `grass`, `grouse`, `hardware`, `headquarters`, `health`, `herpes`, `hertz`, `highs`, `homework`, `honesty`, `ice`, `information`, `jeans`, `justice`, `kudos`, `labour`/`labor`, `legislation`, `leisure`, `linguistics`, `livestock`, `lows`, `luggage`, `machinery`, `mackerel`, `mail`, `mathematics`, `media`, `metadata`, `money`, `moose`, `mud`, `music`, `news`, `nutrition`, `offspring`, `plankton`, `pliers`, `police`, `pollution`, `premises`, `rain`, `racism`, `research`, `rice`, `salmon`, `scissors`, `series`, `sewage`, `shambles`, `sheep`, `shrimp`, `software`, `spam`, `species`, `staff`, `swine`, `tennis`, `thanks`, `traffic`, `transportation`, `trousers`, `trout`, `tuna`, `vermicelli`, `weather`, `wheat`, `whitebait`, `wholesale`, `wildlife`, `willpower`, `you`

## Known edge cases and fixes

inflekt deliberately fixes all known incorrect outputs from `pluralize`:

| Word | pluralize | inflekt |
|---|---|---|
| `"cookie"` | `"cooky"` | `"cookies"` |
| `"deceased"` | `"deceaseds"` | `"deceased"` |
| `"feedback"` | `"feedbacks"` | `"feedback"` |
| `"species"` | `"speciess"` | `"species"` |
| `"hertz"` | `"hertzs"` | `"hertz"` |
| `"scissors"` | `"scissorss"` | `"scissors"` |
| `"series"` | `"seriess"` | `"series"` |
| `"emoji"` | `"emojis"` | `"emoji"` |
| `"agenda"` | varies | `"agenda"` |
| `"media"` | `"medias"` | `"media"` |

Additional edge cases handled:

- **Empty string** — returned as-is: `plural("") === ""`
- **Whitespace-only string** — returned as-is: `plural("  ") === "  "`
- **Already-plural input to `plural`** — returns unchanged: `plural("cats") === "cats"`
- **Already-singular input to `singular`** — returns unchanged: `singular("cat") === "cat"`
- **Uncountable words** — `isPlural` and `isSingular` both return `true`

## Migration from pluralize

`@agentine/inflekt` is a drop-in replacement. Update your import:

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
| `pluralize.addPluralRule(r, s)` | `addPluralRule(r, s)` |
| `pluralize.addSingularRule(r, s)` | `addSingularRule(r, s)` |
| `pluralize.addIrregularRule(s, p)` | `addIrregularRule(s, p)` |
| `pluralize.addUncountableRule(w)` | `addUncountableRule(w)` |

### Behaviour differences

- inflekt ships with TypeScript types — no separate `@types/pluralize` package needed.
- inflekt exports **named functions** rather than a default object. Update any usage of `pluralize(word)` to `plural(word)`.
- inflekt produces correct output for `cookie`, `deceased`, `feedback`, `species`, `hertz`, and all other words that pluralize gets wrong.

## License

MIT
