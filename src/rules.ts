/** A replacement rule: regex pattern + replacement string */
export interface Rule {
  pattern: RegExp;
  replacement: string;
}

/** Apply rules in reverse order (last added = highest priority). Returns null if no match. */
export function applyRules(word: string, rules: Rule[]): string | null {
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i]!;
    if (rule.pattern.test(word)) {
      return word.replace(rule.pattern, rule.replacement);
    }
  }
  return null;
}

/** Convert a string or RegExp to a case-insensitive RegExp */
export function toRegExp(rule: string | RegExp): RegExp {
  if (rule instanceof RegExp) return rule;
  return new RegExp(rule, "i");
}

/** Restore original casing pattern to a transformed word */
export function restoreCase(original: string, transformed: string): string {
  if (original === original.toUpperCase()) return transformed.toUpperCase();
  if (original[0] === original[0]!.toUpperCase()) {
    return transformed[0]!.toUpperCase() + transformed.slice(1);
  }
  return transformed;
}
