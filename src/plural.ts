import type { Rule } from "./rules.js";
import { applyRules, restoreCase, toRegExp } from "./rules.js";
import { singularToPlural } from "./irregulars.js";
import { isUncountable } from "./uncountables.js";

/** Ordered pluralization rules (last rule = highest priority, checked first) */
const rules: Rule[] = [
  { pattern: /$/i, replacement: "s" },
  { pattern: /s$/i, replacement: "s" },
  { pattern: /(bu|mis|gas)s$/i, replacement: "$1ses" },
  { pattern: /([ti])um$/i, replacement: "$1a" },
  { pattern: /([ti])a$/i, replacement: "$1a" },
  { pattern: /sis$/i, replacement: "ses" },
  { pattern: /(?:([^f])fe|([aeiou]l|[^aeiou][a-z]*)f)$/i, replacement: "$1$2ves" },
  { pattern: /(hive)s?$/i, replacement: "$1s" },
  { pattern: /([^aeiouy]|qu)y$/i, replacement: "$1ies" },
  { pattern: /(x|ch|ss|sh)$/i, replacement: "$1es" },
  { pattern: /([m|l])ouse$/i, replacement: "$1ice" },
  { pattern: /([m|l])ice$/i, replacement: "$1ice" },
  { pattern: /^(ox)$/i, replacement: "$1en" },
  { pattern: /(quiz)$/i, replacement: "$1zes" },
  { pattern: /(database)s?$/i, replacement: "$1s" },
  { pattern: /([^aeiou])ies$/i, replacement: "$1ies" },
  { pattern: /(ch|sh|x|ss)es$/i, replacement: "$1es" },
  // These higher-priority rules override more general ones above
  { pattern: /(alias|bias|atlas|status|campus|census|focus|nexus|plexus|sinus|syllabus|viscus)$/i, replacement: "$1es" },
  { pattern: /(buffal|tomat|volcan|her|potat|torped|vet)o$/i, replacement: "$1oes" },
  { pattern: /(matr|vert|append)ix|ex$/i, replacement: "$1ices" },
  { pattern: /(octop|vir|radi|nucle|fung|cact|stimul)us$/i, replacement: "$1i" },
  { pattern: /(octop|vir|radi|nucle|fung|cact|stimul)i$/i, replacement: "$1i" },
  { pattern: /(ax|test)is$/i, replacement: "$1es" },
];

/** Add a custom pluralization rule */
export function addPluralRule(pattern: string | RegExp, replacement: string): void {
  rules.push({ pattern: toRegExp(pattern), replacement });
}

/** Pluralize a word */
export function pluralize(word: string): string {
  if (!word || word.trim() === "") return word;

  // Handle compound words (hyphenated)
  if (word.includes("-")) {
    const parts = word.split("-");
    parts[parts.length - 1] = pluralize(parts[parts.length - 1]!);
    return parts.join("-");
  }

  const lower = word.toLowerCase();

  // Check uncountables
  if (isUncountable(lower)) return word;

  // Check irregulars
  const irregular = singularToPlural.get(lower);
  if (irregular) return restoreCase(word, irregular);

  // Apply rules
  const result = applyRules(lower, rules);
  if (result) return restoreCase(word, result);

  return word;
}
