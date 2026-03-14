import type { Rule } from "./rules.js";
import { applyRules, restoreCase, toRegExp } from "./rules.js";
import { pluralToSingular } from "./irregulars.js";
import { isUncountable } from "./uncountables.js";

/** Ordered singularization rules (last rule = highest priority, checked first) */
const rules: Rule[] = [
  { pattern: /s$/i, replacement: "" },
  { pattern: /ss$/i, replacement: "ss" },
  { pattern: /(n)ews$/i, replacement: "$1ews" },
  { pattern: /([ti])a$/i, replacement: "$1um" },
  { pattern: /([^f])ves$/i, replacement: "$1fe" },
  { pattern: /(hive)s$/i, replacement: "$1" },
  { pattern: /(tive)s$/i, replacement: "$1" },
  { pattern: /([^aeiouy]|qu)ies$/i, replacement: "$1y" },
  { pattern: /ies$/i, replacement: "y" },
  { pattern: /(s)eries$/i, replacement: "$1eries" },
  { pattern: /(m)ovies$/i, replacement: "$1ovie" },
  { pattern: /(x|ch|ss|sh)es$/i, replacement: "$1" },
  { pattern: /([m|l])ice$/i, replacement: "$1ouse" },
  { pattern: /(bus)es$/i, replacement: "$1" },
  { pattern: /(o)es$/i, replacement: "$1" },
  { pattern: /(shoe)s$/i, replacement: "$1" },
  { pattern: /(octop|vir|radi|nucle|fung|cact|stimul)i$/i, replacement: "$1us" },
  { pattern: /(alias|bias|atlas|status|campus|census)es$/i, replacement: "$1" },
  { pattern: /^(ox)en/i, replacement: "$1" },
  { pattern: /(quiz)zes$/i, replacement: "$1" },
  // Higher-priority rules: these override more general patterns above
  { pattern: /([lr])ves$/i, replacement: "$1f" },
  { pattern: /(cris|ax|test)es$/i, replacement: "$1is" },
  { pattern: /((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, replacement: "$1sis" },
  { pattern: /(^analy)(sis|ses)$/i, replacement: "$1sis" },
  { pattern: /(matr|suff)ices$/i, replacement: "$1ix" },
  { pattern: /(vert|append|ind)ices$/i, replacement: "$1ex" },
  { pattern: /(database)s$/i, replacement: "$1" },
];

/** Add a custom singularization rule */
export function addSingularRule(pattern: string | RegExp, replacement: string): void {
  rules.push({ pattern: toRegExp(pattern), replacement });
}

/** Singularize a word */
export function singularize(word: string): string {
  if (!word || word.trim() === "") return word;

  // Handle compound words (hyphenated)
  if (word.includes("-")) {
    const parts = word.split("-");
    parts[parts.length - 1] = singularize(parts[parts.length - 1]!);
    return parts.join("-");
  }

  const lower = word.toLowerCase();

  // Check uncountables
  if (isUncountable(lower)) return word;

  // Check irregulars
  const irregular = pluralToSingular.get(lower);
  if (irregular) return restoreCase(word, irregular);

  // Apply rules
  const result = applyRules(lower, rules);
  if (result) return restoreCase(word, result);

  return word;
}
