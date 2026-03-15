import { describe, it, expect } from "vitest";
import {
  plural,
  singular,
  inflect,
  isPlural,
  isSingular,
  addPluralRule,
  addSingularRule,
  addIrregularRule,
  addUncountableRule,
} from "../src/index.js";

describe("plural", () => {
  const cases: [string, string][] = [
    // Regular plurals
    ["cat", "cats"],
    ["dog", "dogs"],
    ["house", "houses"],
    ["bus", "buses"],
    ["kiss", "kisses"],
    ["box", "boxes"],
    ["match", "matches"],
    ["wish", "wishes"],
    ["baby", "babies"],
    ["city", "cities"],
    ["fly", "flies"],
    ["guy", "guys"],
    ["day", "days"],
    ["key", "keys"],
    ["boy", "boys"],
    ["toy", "toys"],
    // -f/-fe → -ves
    ["knife", "knives"],
    ["wife", "wives"],
    ["life", "lives"],
    ["half", "halves"],
    ["wolf", "wolves"],
    ["leaf", "leaves"],
    ["shelf", "shelves"],
    ["calf", "calves"],
    // -us → -i
    ["cactus", "cacti"],
    ["fungus", "fungi"],
    ["stimulus", "stimuli"],
    ["radius", "radii"],
    ["nucleus", "nuclei"],
    // -um → -a
    ["datum", "data"],
    ["medium", "media"],
    ["stadium", "stadia"],
    // -is → -es
    ["axis", "axes"],
    ["analysis", "analyses"],
    ["crisis", "crises"],
    ["thesis", "theses"],
    ["diagnosis", "diagnoses"],
    // -ex/-ix → -ices
    ["index", "indices"],
    ["matrix", "matrices"],
    ["vertex", "vertices"],
    ["appendix", "appendices"],
    // Irregular
    ["person", "people"],
    ["man", "men"],
    ["woman", "women"],
    ["child", "children"],
    ["tooth", "teeth"],
    ["foot", "feet"],
    ["goose", "geese"],
    ["mouse", "mice"],
    ["ox", "oxen"],
    ["quiz", "quizzes"],
    ["cookie", "cookies"],
    ["movie", "movies"],
    ["human", "humans"],
    ["hero", "heroes"],
    ["potato", "potatoes"],
    ["tomato", "tomatoes"],
    ["volcano", "volcanoes"],
    // Database
    ["database", "databases"],
  ];

  for (const [input, expected] of cases) {
    it(`${input} → ${expected}`, () => {
      expect(plural(input)).toBe(expected);
    });
  }
});

describe("singular", () => {
  const cases: [string, string][] = [
    ["cats", "cat"],
    ["dogs", "dog"],
    ["houses", "house"],
    ["buses", "bus"],
    ["kisses", "kiss"],
    ["boxes", "box"],
    ["matches", "match"],
    ["wishes", "wish"],
    ["babies", "baby"],
    ["cities", "city"],
    ["flies", "fly"],
    ["knives", "knife"],
    ["wives", "wife"],
    ["lives", "life"],
    ["halves", "half"],
    ["wolves", "wolf"],
    ["leaves", "leaf"],
    ["shelves", "shelf"],
    ["calves", "calf"],
    ["cacti", "cactus"],
    ["fungi", "fungus"],
    ["stimuli", "stimulus"],
    ["radii", "radius"],
    ["nuclei", "nucleus"],
    ["data", "datum"],
    ["axes", "axis"],
    ["analyses", "analysis"],
    ["crises", "crisis"],
    ["theses", "thesis"],
    ["diagnoses", "diagnosis"],
    ["matrices", "matrix"],
    ["vertices", "vertex"],
    ["appendices", "appendix"],
    ["indices", "index"],
    ["people", "person"],
    ["men", "man"],
    ["women", "woman"],
    ["children", "child"],
    ["teeth", "tooth"],
    ["feet", "foot"],
    ["geese", "goose"],
    ["mice", "mouse"],
    ["oxen", "ox"],
    ["quizzes", "quiz"],
    ["cookies", "cookie"],
    ["movies", "movie"],
    ["heroes", "hero"],
    ["potatoes", "potato"],
    ["tomatoes", "tomato"],
    ["databases", "database"],
    ["series", "series"],
  ];

  for (const [input, expected] of cases) {
    it(`${input} → ${expected}`, () => {
      expect(singular(input)).toBe(expected);
    });
  }
});

describe("uncountable words", () => {
  const words = [
    "sheep",
    "fish",
    "deer",
    "species",
    "series",
    "money",
    "rice",
    "information",
    "equipment",
    "feedback",
    "deceased",
    "hertz",
    "software",
    "hardware",
    "news",
    "aircraft",
    "moose",
    "bison",
    "salmon",
    "trout",
    "tuna",
    "shrimp",
    "swine",
    "offspring",
  ];

  for (const word of words) {
    it(`${word} is uncountable (plural unchanged)`, () => {
      expect(plural(word)).toBe(word);
    });

    it(`${word} is uncountable (singular unchanged)`, () => {
      expect(singular(word)).toBe(word);
    });
  }
});

describe("case preservation", () => {
  it("preserves uppercase", () => {
    expect(plural("CAT")).toBe("CATS");
    expect(singular("CATS")).toBe("CAT");
  });

  it("preserves title case", () => {
    expect(plural("Cat")).toBe("Cats");
    expect(singular("Cats")).toBe("Cat");
  });

  it("preserves lowercase", () => {
    expect(plural("cat")).toBe("cats");
    expect(singular("cats")).toBe("cat");
  });

  it("preserves case for irregulars", () => {
    expect(plural("Person")).toBe("People");
    expect(singular("People")).toBe("Person");
    expect(plural("PERSON")).toBe("PEOPLE");
  });
});

describe("compound words", () => {
  it("handles hyphenated words", () => {
    expect(plural("mother-in-law")).toBe("mother-in-laws");
    expect(plural("test-case")).toBe("test-cases");
  });
});

describe("inflect", () => {
  it("returns singular for count 1", () => {
    expect(inflect("cats", 1)).toBe("cat");
  });

  it("returns plural for count != 1", () => {
    expect(inflect("cat", 0)).toBe("cats");
    expect(inflect("cat", 2)).toBe("cats");
    expect(inflect("cat", 100)).toBe("cats");
  });

  it("prepends count when inclusive", () => {
    expect(inflect("cat", 1, true)).toBe("1 cat");
    expect(inflect("cat", 3, true)).toBe("3 cats");
    expect(inflect("cat", 0, true)).toBe("0 cats");
  });
});

describe("isPlural", () => {
  it("detects plural words", () => {
    expect(isPlural("cats")).toBe(true);
    expect(isPlural("dogs")).toBe(true);
    expect(isPlural("people")).toBe(true);
    expect(isPlural("children")).toBe(true);
  });

  it("returns true for uncountable words", () => {
    expect(isPlural("sheep")).toBe(true);
    expect(isPlural("fish")).toBe(true);
  });
});

describe("isSingular", () => {
  it("detects singular words", () => {
    expect(isSingular("cat")).toBe(true);
    expect(isSingular("dog")).toBe(true);
    expect(isSingular("person")).toBe(true);
    expect(isSingular("child")).toBe(true);
  });

  it("returns true for uncountable words", () => {
    expect(isSingular("sheep")).toBe(true);
    expect(isSingular("fish")).toBe(true);
  });
});

describe("custom rules", () => {
  it("addPluralRule", () => {
    addPluralRule(/gex$/i, "gices");
    expect(plural("regex")).toBe("regices");
  });

  it("addSingularRule", () => {
    addSingularRule(/gices$/i, "gex");
    expect(singular("regices")).toBe("regex");
  });

  it("addIrregularRule", () => {
    addIrregularRule("cactus", "cacti");
    expect(plural("cactus")).toBe("cacti");
    expect(singular("cacti")).toBe("cactus");
  });

  it("addUncountableRule with string", () => {
    addUncountableRule("pokemon");
    expect(plural("pokemon")).toBe("pokemon");
    expect(singular("pokemon")).toBe("pokemon");
  });

  it("addUncountableRule with regex", () => {
    addUncountableRule(/craft$/i);
    expect(plural("hovercraft")).toBe("hovercraft");
  });
});

describe("edge cases", () => {
  it("handles empty string", () => {
    expect(plural("")).toBe("");
    expect(singular("")).toBe("");
  });

  it("handles whitespace", () => {
    expect(plural("  ")).toBe("  ");
  });

  it("known pluralize bug fixes", () => {
    // "deceased" should not become "deceaseds"
    expect(plural("deceased")).toBe("deceased");
    // "cookie" should not become "cooky"
    expect(plural("cookie")).toBe("cookies");
    // "species" should stay "species"
    expect(plural("species")).toBe("species");
    // "feedback" should stay "feedback"
    expect(plural("feedback")).toBe("feedback");
    // "hertz" should stay "hertz"
    expect(plural("hertz")).toBe("hertz");
  });
});
