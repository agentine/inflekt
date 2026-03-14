import { pluralize, addPluralRule as _addPluralRule } from "./plural.js";
import { singularize, addSingularRule as _addSingularRule } from "./singular.js";
import { addIrregular } from "./irregulars.js";
import { addUncountable, isUncountable } from "./uncountables.js";

/** Pluralize a word */
export function plural(word: string): string {
  return pluralize(word);
}

/** Singularize a word */
export function singular(word: string): string {
  return singularize(word);
}

/**
 * Inflect a word based on count.
 * Returns the singular form if count is 1, otherwise the plural form.
 * If inclusive is true, prepends the count to the result.
 */
export function inflect(word: string, count: number, inclusive?: boolean): string {
  const result = count === 1 ? singularize(word) : pluralize(word);
  return inclusive ? `${count} ${result}` : result;
}

/** Check if a word is plural */
export function isPlural(word: string): boolean {
  if (isUncountable(word.toLowerCase())) return true;
  return pluralize(singularize(word)) === word || singularize(word) !== word && pluralize(singularize(word)).toLowerCase() === word.toLowerCase();
}

/** Check if a word is singular */
export function isSingular(word: string): boolean {
  if (isUncountable(word.toLowerCase())) return true;
  return singularize(pluralize(word)) === word || singularize(word).toLowerCase() === word.toLowerCase();
}

/** Add a custom pluralization rule */
export function addPluralRule(rule: string | RegExp, replacement: string): void {
  _addPluralRule(rule, replacement);
}

/** Add a custom singularization rule */
export function addSingularRule(rule: string | RegExp, replacement: string): void {
  _addSingularRule(rule, replacement);
}

/** Add an irregular singular/plural pair */
export function addIrregularRule(singular: string, plural: string): void {
  addIrregular(singular, plural);
}

/** Add an uncountable word or pattern */
export function addUncountableRule(word: string | RegExp): void {
  addUncountable(word);
}
