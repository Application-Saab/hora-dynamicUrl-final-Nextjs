import { themeFilters, NamingCeremonyThemes } from "./themeFilters";

/* ──────────────────────────────────────────────────────────────
 * Theme-page content (fixes "Duplicate, Google chose different
 * canonical than user" in Search Console).
 *
 * Before this file, every theme page under a city + category —
 * /gurugram/balloon-decoration/kids-birthday-decoration/mermaid,
 * /…/mario, /…/boss and 45 more — rendered byte-identical body
 * copy, because DecorationCatCityPage keyed all of its content off
 * catValue + city and never off theme. Roughly 4,000 words were
 * shared across all of them, with only the <title>, <h1> and the
 * product grid differing. Google read the set as near-duplicates of
 * the parent category page (which also serves the unfiltered
 * superset of products) and canonicalised them all onto the parent.
 *
 * Each theme below carries its own motifs, palette, props and
 * audience, so the intro paragraph and the FAQ answers composed
 * from them differ in substance and not just in a swapped noun.
 * ────────────────────────────────────────────────────────────── */

const THEME_DATA = {
  mermaid: {
    label: "Mermaid",
    motifs: "scalloped shell backdrops, tail cut-outs and pearl strings",
    palette: "sea green, coral pink, pearl white and soft lilac",
    props: "a shimmer-foil tail, starfish and shell danglers, and a bubble-balloon wall",
    bestFor: "girls turning three to nine",
    note: "Under-sea setups photograph best against a plain wall, so the shell arch and the bubble clusters read clearly in pictures.",
  },
  mario: {
    label: "Mario",
    motifs: "pipe arches, question-mark blocks and brick-pattern backdrops",
    palette: "red, blue, yellow and grass green",
    props: "foil mushroom and star balloons, a cardboard warp pipe and a coin-block photo corner",
    bestFor: "kids turning five to twelve who are already into gaming",
    note: "The pipe arch doubles as an entry frame, which works well in flats where the party area is a single room.",
  },
  boss: {
    label: "Boss Baby",
    motifs: "briefcase props, bow-tie cut-outs and black-and-gold backdrops",
    palette: "black, white, gold and sky blue",
    props: "a suit-and-tie standee, foil briefcase balloons and a gold name board",
    bestFor: "first and second birthdays, and photo-led celebrations",
    note: "A popular pick for cake-smash shoots, so the backdrop is kept clean with the balloon work framing the seat.",
  },
  unicorn: {
    label: "Unicorn",
    motifs: "horn-and-ear cut-outs, cloud clusters and rainbow tails",
    palette: "pastel pink, lavender, mint and gold",
    props: "a 3D unicorn head, pastel balloon rainbow and tulle cloud draping",
    bestFor: "girls turning two to eight",
    note: "Pastel latex fades under harsh light, so the setup is planned away from direct afternoon sun where possible.",
  },
  jungle: {
    label: "Jungle",
    motifs: "leaf garlands, animal face cut-outs and vine draping",
    palette: "forest green, tan, mustard and burnt orange",
    props: "giraffe and lion cut-outs, palm-leaf fans and a wooden-crate cake table",
    bestFor: "first birthdays and mixed-age gatherings",
    note: "Leaf work needs wall height, so ceiling vines are used in low-ceiling rooms instead of a full canopy.",
  },
  dinosaur: {
    label: "Dinosaur",
    motifs: "fern backdrops, footprint floor decals and rock-texture props",
    palette: "moss green, charcoal, amber and terracotta",
    props: "a T-rex standee, dino-egg balloon clusters and a volcano cake backdrop",
    bestFor: "kids turning four to ten",
    note: "The standee is the anchor piece, so it is placed where guests enter rather than behind the cake table.",
  },
  cocomelon: {
    label: "Cocomelon",
    motifs: "watermelon motifs, nursery-rhyme cut-outs and polka-dot backdrops",
    palette: "grass green, watermelon red, sky blue and sunshine yellow",
    props: "a JJ character standee, melon-slice balloons and an alphabet-block cake table",
    bestFor: "first and second birthdays",
    note: "Designed low to the ground so toddlers can be photographed in front of it without a step or a prop chair.",
  },
  barbie: {
    label: "Barbie",
    motifs: "hot-pink backdrops, mirror panels and ribbon curtains",
    palette: "hot pink, blush, silver and white",
    props: "a doll-box photo frame, sequin backdrop and a pink balloon arch",
    bestFor: "girls turning five to twelve, and teen birthdays",
    note: "The doll-box frame is the most-photographed element, so it gets the clearest wall in the room.",
  },
  "astronaut-space": {
    label: "Astronaut Space",
    motifs: "planet clusters, star canopies and rocket cut-outs",
    palette: "navy, silver, chrome purple and white",
    props: "a foil rocket, chrome planet balloons and a fairy-light star ceiling",
    bestFor: "kids turning four to eleven",
    note: "Works best with the room lights dimmed, so the fairy-light ceiling is wired to a separate switch.",
  },
  hero: {
    label: "Super Hero",
    motifs: "comic-panel backdrops, city-skyline cut-outs and action-word props",
    palette: "red, royal blue, yellow and black",
    props: "a skyline silhouette, comic speech-bubble props and a cape-and-mask corner",
    bestFor: "kids turning four to ten",
    note: "The cape corner is set up as a small activity area, which keeps younger guests occupied between cake and games.",
  },
  avengers: {
    label: "Avengers",
    motifs: "shield emblems, hero-crest backdrops and metallic panels",
    palette: "crimson, gunmetal, gold and deep blue",
    props: "a shield centrepiece, hero-crest balloon columns and an emblem cake backdrop",
    bestFor: "kids turning six to thirteen",
    note: "Crest work is printed to order, so this setup needs a little more notice than a plain balloon theme.",
  },
  hulk: {
    label: "Hulk",
    motifs: "cracked-wall backdrops, fist props and torn-panel cut-outs",
    palette: "emerald green, charcoal, purple and silver",
    props: "a fist cut-out, green chrome balloon columns and a smash-wall photo panel",
    bestFor: "kids turning five to eleven",
    note: "The smash-wall panel is free-standing, so it can be moved outdoors for daylight photographs.",
  },
  "spider-man": {
    label: "Spider Man",
    motifs: "web backdrops, skyline silhouettes and mask cut-outs",
    palette: "red, navy, black and white",
    props: "a web-string wall, mask balloons and a skyline cake backdrop",
    bestFor: "kids turning four to eleven",
    note: "The web wall is strung rather than printed, so it can be sized to fit a narrow corridor wall.",
  },
  princess: {
    label: "Princess",
    motifs: "castle backdrops, tulle draping and crown cut-outs",
    palette: "blush pink, cream, gold and powder blue",
    props: "a castle panel, a tulle-and-fairy-light canopy and a crown cake topper",
    bestFor: "girls turning two to nine",
    note: "The canopy needs a ceiling hook or rod, so a wall-mounted version is used where drilling is not possible.",
  },
  elsa: {
    label: "Elsa",
    motifs: "snowflake backdrops, icicle strings and frost-effect panels",
    palette: "ice blue, white, silver and periwinkle",
    props: "a snowflake arch, icicle danglers and a shimmer-fabric cake backdrop",
    bestFor: "girls turning three to nine",
    note: "Silver and white reflect flash strongly, so the setup is angled to avoid glare in photographs.",
  },
  "mickey-mouse": {
    label: "Mickey Mouse",
    motifs: "ear-shaped balloon clusters, polka-dot backdrops and glove props",
    palette: "red, black, white and yellow",
    props: "an ear-cluster arch, polka-dot curtain and a red-and-white cake table skirt",
    bestFor: "first to fifth birthdays",
    note: "The ear clusters read instantly in photos, which is why they are placed at eye level rather than overhead.",
  },
  "mickey-minnie": {
    label: "Mickey and Minnie",
    motifs: "paired ear clusters, bow cut-outs and polka-dot panels",
    palette: "red, pink, black and white",
    props: "twin ear arches, an oversized bow and a two-tone cake backdrop",
    bestFor: "twins, siblings and joint birthdays",
    note: "Built as two mirrored halves, so each child gets their own side of the backdrop for photographs.",
  },
  "paw": {
    label: "Paw Patrol",
    motifs: "paw-print decals, rescue-badge cut-outs and vehicle props",
    palette: "red, blue, yellow and white",
    props: "character standees, paw-print floor decals and a badge-shaped cake backdrop",
    bestFor: "kids turning two to seven",
    note: "Floor decals are the part toddlers interact with most, so they are laid on a clear stretch away from the cake.",
  },
  "pikachu-pokemon": {
    label: "Pokemon and Pikachu",
    motifs: "poke-ball clusters, lightning-bolt cut-outs and badge panels",
    palette: "yellow, red, white and navy",
    props: "poke-ball balloons, a bolt-shaped name board and a badge photo wall",
    bestFor: "kids turning five to twelve",
    note: "Poke-ball balloons are assembled on site in two halves, so the finish stays clean even in humid weather.",
  },
  minecraft: {
    label: "Minecraft",
    motifs: "pixel-block backdrops, cube props and grass-texture panels",
    palette: "grass green, dirt brown, stone grey and sky blue",
    props: "stacked foam cubes, a pixel-grid backdrop and a block-style name board",
    bestFor: "kids turning six to thirteen",
    note: "Everything is built on a square grid, so the backdrop can be extended or trimmed to match the wall exactly.",
  },
  circus: {
    label: "Circus",
    motifs: "big-top draping, bunting rows and ticket-booth props",
    palette: "red, white, mustard and teal",
    props: "a striped canopy, carnival bunting and a popcorn-cart dessert corner",
    bestFor: "first and second birthdays, and large guest lists",
    note: "The canopy needs a centre anchor point, so an open living area suits it better than a narrow room.",
  },
  candy: {
    label: "Candyland",
    motifs: "lollipop stands, candy-swirl backdrops and sweet-jar displays",
    palette: "bubblegum pink, mint, lemon and white",
    props: "giant lollipop props, a swirl backdrop and a filled sweet-jar table",
    bestFor: "kids turning three to ten",
    note: "The sweet-jar table doubles as the return-gift station, which saves setting up a second corner.",
  },
  car: {
    label: "Car",
    motifs: "road-track floor runners, traffic-sign props and tyre-stack props",
    palette: "red, black, white and signal yellow",
    props: "a track runner, chequered-flag bunting and a car-shaped cake backdrop",
    bestFor: "kids turning two to eight",
    note: "The track runner gives small guests something to play along, so it is laid in the open floor area.",
  },
  traffic: {
    label: "Traffic",
    motifs: "signal-light props, zebra-crossing runners and road-sign cut-outs",
    palette: "red, amber, green and charcoal",
    props: "a working-look signal prop, sign cut-outs and a crossing floor runner",
    bestFor: "kids turning two to six",
    note: "A popular learning-themed pick for playschool birthdays, where the signs are used in the party games.",
  },
  football: {
    label: "Sport Football",
    motifs: "pitch-line floor work, goal-post props and jersey-number backdrops",
    palette: "grass green, white, black and team accent colour",
    props: "a mini goal post, black-and-white ball balloons and a numbered jersey backdrop",
    bestFor: "kids turning five to thirteen",
    note: "The jersey number is printed with the birthday age, which makes it the main photo piece.",
  },
  cricket: {
    label: "Cricket",
    motifs: "pitch-stripe backdrops, stump props and scoreboard panels",
    palette: "grass green, white, navy and gold",
    props: "a stump-and-bail set, a scoreboard name board and ball-shaped balloons",
    bestFor: "kids turning six to thirteen, and sports-themed family parties",
    note: "The scoreboard is customised with the child's name and age, so it works as both décor and a photo prop.",
  },
  "tom-jerry": {
    label: "Tom and Jerry",
    motifs: "cheese-wedge props, chase-scene cut-outs and mousehole panels",
    palette: "sky blue, mustard, grey and brown",
    props: "character standees, cheese-shaped balloons and a mousehole photo corner",
    bestFor: "kids turning three to nine",
    note: "The mousehole corner sits at child height, which gets more use than a full-size backdrop at this age.",
  },
  doremon: {
    label: "Doremon",
    motifs: "pocket-door props, bell cut-outs and gadget panels",
    palette: "cobalt blue, white, red and yellow",
    props: "an anywhere-door standee, bell balloons and a gadget-shelf backdrop",
    bestFor: "kids turning four to ten",
    note: "The door standee is built as an entry frame, so guests walk through it on arrival.",
  },
  shinchan: {
    label: "Shinchan",
    motifs: "cartoon-panel backdrops, character cut-outs and bold-outline props",
    palette: "red, yellow, white and black",
    props: "a character standee, comic-panel backdrop and a bold-outline name board",
    bestFor: "kids turning five to eleven",
    note: "Heavy outlines photograph well in low light, which suits evening indoor parties.",
  },
  "motu-patlu": {
    label: "Motu Patlu",
    motifs: "samosa props, character cut-outs and street-scene backdrops",
    palette: "orange, yellow, green and red",
    props: "character standees, a samosa-cart dessert corner and a street-scene panel",
    bestFor: "kids turning four to ten",
    note: "The samosa cart is used as the snack table, which keeps the food area part of the theme.",
  },
  masha: {
    label: "Masha and Bear",
    motifs: "forest-cottage backdrops, pine cut-outs and jam-jar props",
    palette: "pine green, red, cream and brown",
    props: "character standees, a cottage-window panel and a jam-jar dessert shelf",
    bestFor: "kids turning two to seven",
    note: "The cottage panel is free-standing, so the setup can move to a balcony or garden for daylight photos.",
  },
  bluey: {
    label: "Bluey",
    motifs: "family-character cut-outs, backyard panels and paw-print accents",
    palette: "heeler blue, tan, orange and cream",
    props: "character standees, a backyard-fence panel and a paw-print balloon garland",
    bestFor: "kids turning two to seven",
    note: "The fence panel is low and wide, which suits a cake-smash or a floor-level play setup.",
  },
  naruto: {
    label: "Naruto",
    motifs: "headband props, village-crest panels and scroll cut-outs",
    palette: "orange, navy, slate and white",
    props: "a crest backdrop, scroll danglers and headband-style bunting",
    bestFor: "kids turning eight to fifteen, and teen birthdays",
    note: "Leans older than most kids themes, so the balloon work is kept minimal and the panels do the talking.",
  },
  sonic: {
    label: "Sonic",
    motifs: "loop-track props, ring clusters and speed-streak backdrops",
    palette: "cobalt blue, gold, red and white",
    props: "gold ring balloons, a loop-track cut-out and a speed-streak photo wall",
    bestFor: "kids turning four to eleven",
    note: "The gold rings are hung at staggered heights so they read as motion rather than a flat row.",
  },
  minion: {
    label: "Minion",
    motifs: "goggle cut-outs, denim-overall panels and banana props",
    palette: "yellow, denim blue, black and white",
    props: "goggle-shaped balloons, a denim-texture backdrop and banana bunting",
    bestFor: "kids turning three to nine",
    note: "Yellow dominates the frame, so a white or pale wall behind keeps the photographs from looking flat.",
  },
  krishna: {
    label: "Krishna",
    motifs: "peacock-feather work, matki props and floral garlands",
    palette: "peacock blue, marigold, gold and cream",
    props: "a matki-and-swing centrepiece, feather danglers and marigold garlands",
    bestFor: "Janmashtami celebrations and first birthdays",
    note: "Fresh marigold is used where available, which gives the setup a different finish from an all-balloon theme.",
  },
  butterfly: {
    label: "Butterfly",
    motifs: "wing cut-outs, flutter walls and floral vine work",
    palette: "lilac, blush, mint and gold",
    props: "a 3D flutter wall, pastel garlands and a wing-shaped photo frame",
    bestFor: "girls turning two to eight",
    note: "The flutter wall is assembled piece by piece on site, so it is sized to the wall rather than pre-made.",
  },
  flamingo: {
    label: "Flamingo",
    motifs: "tropical leaf work, flamingo cut-outs and pineapple props",
    palette: "flamingo pink, palm green, gold and white",
    props: "a leaf-and-flamingo backdrop, pineapple props and a pink balloon arch",
    bestFor: "kids turning four to ten, and summer and poolside parties",
    note: "Holds up well outdoors, so it is one of the few kids themes regularly set up on terraces.",
  },
  panda: {
    label: "Panda",
    motifs: "bamboo props, ear-cluster balloons and monochrome panels",
    palette: "black, white, bamboo green and blush",
    props: "a panda-face backdrop, bamboo stalks and ear-cluster balloon columns",
    bestFor: "first and second birthdays",
    note: "The monochrome base means the cake and the outfit carry the colour, which parents often plan around.",
  },
  lion: {
    label: "Lion King",
    motifs: "savanna backdrops, mane cut-outs and acacia-tree props",
    palette: "amber, ochre, deep brown and sunset orange",
    props: "a mane-framed photo panel, savanna silhouette backdrop and rock-ledge cake stand",
    bestFor: "first birthdays and jungle-adjacent celebrations",
    note: "The rock-ledge cake stand is the signature piece and needs a firm surface, so the table is checked on arrival.",
  },
  kitty: {
    label: "Kitty",
    motifs: "bow cut-outs, whisker panels and polka-dot backdrops",
    palette: "red, white, pink and black",
    props: "an oversized bow, face-shaped balloons and a dotted curtain backdrop",
    bestFor: "girls turning two to eight",
    note: "The oversized bow is the anchor piece and is mounted above the cake table rather than behind it.",
  },
  dogs: {
    label: "Super Dogs",
    motifs: "paw-print work, kennel props and badge cut-outs",
    palette: "red, blue, tan and white",
    props: "character standees, a kennel photo corner and paw-print garlands",
    bestFor: "kids turning three to eight",
    note: "The kennel corner is built child-sized, so it works as a play spot as well as a backdrop.",
  },
  shark: {
    label: "Baby Shark",
    motifs: "wave backdrops, fin cut-outs and bubble clusters",
    palette: "ocean blue, yellow, coral and white",
    props: "a fin-shaped arch, bubble balloon clusters and a wave-edge cake backdrop",
    bestFor: "first and second birthdays",
    note: "Built at toddler height, since this theme is almost always booked for one- and two-year-olds.",
  },
  elephant: {
    label: "Elephant",
    motifs: "pastel elephant cut-outs, cloud clusters and bunting rows",
    palette: "grey, blush, mint and cream",
    props: "an elephant silhouette, pastel cloud balloons and fabric bunting",
    bestFor: "first birthdays, baby welcomes and naming ceremonies",
    note: "Gentle enough for a newborn shoot, which is why it carries across from baby welcome to first birthday.",
  },
  aeroplane: {
    label: "Aeroplane",
    motifs: "cloud clusters, runway floor runners and propeller props",
    palette: "sky blue, white, red and silver",
    props: "a plane cut-out, cloud balloon clusters and a runway floor strip",
    bestFor: "kids turning two to eight",
    note: "Clouds are hung at two heights to give the setup depth, which a flat backdrop does not achieve.",
  },
  "bow-theme": {
    label: "Bow Theme",
    motifs: "oversized bows, ribbon curtains and pearl strings",
    palette: "blush, cream, gold and soft red",
    props: "a statement bow, ribbon backdrop and pearl-string danglers",
    bestFor: "first birthdays, baby showers and photo-led parties",
    note: "Fabric-led rather than balloon-led, so it suits parents who want a softer finish than a balloon arch.",
  },
  pig: {
    label: "Peppa Pig",
    motifs: "muddy-puddle floor decals, character cut-outs and cloud panels",
    palette: "bubblegum pink, red, sky blue and white",
    props: "character standees, puddle floor decals and a cloud-and-sun backdrop",
    bestFor: "kids turning two to six",
    note: "The puddle decals are the part toddlers head for first, so they are laid clear of the cake table.",
  },
  "1st-birthday": {
    label: "1st Birthday",
    motifs: "milestone number props, month-photo banners and pastel arches",
    palette: "chosen to match the outfit, commonly blush, mint, cream and gold",
    props: "a large number one, a twelve-month photo banner and a cake-smash corner",
    bestFor: "first birthdays and cake-smash shoots",
    note: "Planned around the photographer's angle, so the number and the smash corner share the best-lit wall.",
  },
  "6-month-birthday": {
    label: "6 Month Birthday",
    motifs: "half-cake props, milestone boards and soft pastel work",
    palette: "pastel pink or blue with cream and gold",
    props: "a half-number prop, milestone board and a low pastel balloon garland",
    bestFor: "half-birthday celebrations and milestone photo sessions",
    note: "Everything sits low to the floor, since the baby is photographed seated or propped rather than standing.",
  },
  "harry-potter": {
    label: "Harry Potter",
    motifs: "house-crest banners, floating-candle effects and spellbook props",
    palette: "burgundy, gold, bottle green and parchment",
    props: "house banners, hanging candle props and a spellbook cake table",
    bestFor: "kids turning seven to fourteen",
    note: "The hanging candles need ceiling anchors, so a rod-mounted version is used where drilling is not allowed.",
  },
  fairy: {
    label: "Fairy",
    motifs: "fairy-light canopies, wing cut-outs and floral vine work",
    palette: "lilac, mint, blush and warm gold",
    props: "a lit canopy, wing-shaped props and a toadstool cake stand",
    bestFor: "girls turning two to nine",
    note: "Lighting carries this one, so it is set up for an evening party rather than a midday one.",
  },
  cow: {
    label: "Cow",
    motifs: "spot-pattern panels, barn props and sunflower accents",
    palette: "black, white, sunflower yellow and barn red",
    props: "a spot-print backdrop, barn-door panel and sunflower garlands",
    bestFor: "first and second birthdays, and farm-theme parties",
    note: "The spot print is bold enough to read from across a room, which suits larger gatherings.",
  },
  parrot: {
    label: "Parrot",
    motifs: "tropical leaf work, feather cut-outs and perch props",
    palette: "emerald, scarlet, gold and turquoise",
    props: "a leaf backdrop, feather danglers and a perch-style photo frame",
    bestFor: "kids turning three to nine",
    note: "Strong colour contrast means it photographs well even without extra lighting.",
  },
  lelo: {
    label: "Lelo",
    motifs: "character cut-outs, playful panels and bright balloon work",
    palette: "orange, teal, yellow and white",
    props: "character standees, a bright balloon garland and a name-board backdrop",
    bestFor: "kids turning three to eight",
    note: "Built around a single feature wall, which keeps it workable in compact flats.",
  },
  "card-games": {
    label: "Card Games",
    motifs: "suit-symbol cut-outs, card-fan backdrops and chip-stack props",
    palette: "red, black, white and gold",
    props: "oversized card props, a suit-symbol garland and a chip-stack table display",
    bestFor: "teen birthdays, game nights and adult celebrations",
    note: "Reads more grown-up than the character themes, so it is often booked for milestone adult birthdays.",
  },
  "binny-the-pow": {
    label: "Binny the Pow",
    motifs: "character cut-outs, action-panel backdrops and bright accents",
    palette: "red, blue, yellow and white",
    props: "a character standee, action-panel backdrop and a bold name board",
    bestFor: "kids turning four to ten",
    note: "The standee is the recognisable piece, so it is placed where guests see it on arrival.",
  },
  pop: {
    label: "Kpop",
    motifs: "stage-light panels, album-art backdrops and lightstick props",
    palette: "lilac, hot pink, silver and black",
    props: "a stage-style backdrop, lightstick props and a marquee name board",
    bestFor: "teen birthdays and fan-group parties",
    note: "Built to look like a small stage, so the room is arranged with a clear front for group photographs.",
  },
};

/* Themes outside the kids set (naming ceremony, annaprashan and so
 * on) still get their own label, which keeps their copy distinct
 * from the plain category page even without a hand-written record. */
const ALL_THEME_OPTIONS = [...themeFilters, ...NamingCeremonyThemes];

const toTitle = (slug) =>
  String(slug || "")
    .trim()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** Human label for a theme slug, from the theme list where possible. */
export const getThemeLabel = (themeValue) => {
  if (!themeValue) return "";
  const key = String(themeValue).trim().toLowerCase();
  if (THEME_DATA[key]) return THEME_DATA[key].label;

  const match = ALL_THEME_OPTIONS.find(
    (t) => String(t.value).trim().toLowerCase() === key,
  );
  return match ? match.label.trim() : toTitle(key);
};

/** Category label without a trailing "Decoration", e.g. "kids birthday". */
const catShort = (catValue) =>
  String(catValue || "")
    .replace(/-/g, " ")
    .replace(/\s*decoration\s*$/i, "")
    .trim()
    .toLowerCase();

/**
 * Theme-specific intro paragraph for a theme page.
 *
 * Composed from the theme's own motifs, palette, props and audience,
 * so two themes under the same city and category produce materially
 * different copy rather than one swapped noun.
 *
 * Returns null when there is no theme (i.e. a plain category page),
 * so the category page keeps rendering exactly as it does today.
 */
export const getThemeIntro = (themeValue, catValue, city) => {
  if (!themeValue) return null;

  const key = String(themeValue).trim().toLowerCase();
  const data = THEME_DATA[key];
  const label = getThemeLabel(themeValue);
  const where = city ? ` in ${city}` : "";
  const cat = catShort(catValue) || "birthday";

  if (!data) {
    return `${label} ${cat} decoration${where} is set up at your home by a HORA decorator, with the balloon work, the backdrop and the name board built around the ${label} look rather than added on afterwards. Browse the ${label} designs below to see the full setup and the price before you book, then pick a slot that suits you. Every design is costed up front with no charge added on the day, and the decorator brings everything needed to complete the setup in your room.`;
  }

  return `${label} ${cat} decoration${where} is built around ${data.motifs}, worked in ${data.palette}. A typical ${label} setup includes ${data.props}, assembled at your home by a HORA decorator on the day of the party. It is a favourite for ${data.bestFor}. ${data.note} Browse the ${label} designs below to compare what each one includes and what it costs, then book the slot you want — the price you see is the price you pay, with nothing added on the day.`;
};

/**
 * Theme-specific FAQs, returned in the shape FAQSection expects.
 * Prepended to the existing city + category FAQs so each theme page
 * opens with questions that are actually about that theme.
 */
export const getThemeFaqs = (themeValue, catValue, city) => {
  if (!themeValue) return [];

  const key = String(themeValue).trim().toLowerCase();
  const data = THEME_DATA[key];
  const label = getThemeLabel(themeValue);
  const where = city ? ` in ${city}` : "";
  const cityName = city || "your city";
  const cat = catShort(catValue) || "birthday";

  const includes = data
    ? `${data.props}, worked in ${data.palette}`
    : `the balloon work, a themed backdrop and a personalised name board`;

  const motifLine = data
    ? ` The design leans on ${data.motifs}, so the ${label} look comes through in the setup itself rather than in a few add-on props.`
    : "";

  return [
    {
      question: `What is included in a ${label} ${cat} decoration${where}?`,
      answer: `A standard ${label} setup includes ${includes}. The decorator brings everything to your home and builds it on site, which usually takes two to three hours depending on the design you pick.${motifLine} Each design listed below shows its own inclusions and price, so you can see exactly what you are getting before you book.`,
    },
    {
      question: `How much does ${label} decoration cost${where}?`,
      answer: `${label} setups${where} start from around Rs 1,499 for a compact single-wall design, with the larger backdrops and arch-led setups typically landing between Rs 2,500 and Rs 9,000. What moves the price is the balloon count, whether the design uses chrome and foil balloons or plain latex, and the extras you add such as a lit name board or fresh flowers. Every price shown on the designs below is final and includes the setup — nothing is added on the day.`,
    },
    {
      question: `Can I customise the ${label} setup${where}?`,
      answer: data
        ? `Yes. The colours are the easiest thing to change — the usual ${data.palette} palette can be shifted to match an outfit or a cake, and the name board is personalised with the birthday child's name and age as standard. You can also swap individual props in and out, so if you want more of ${data.props.split(",")[0].trim()} and less of the rest, tell the team when you book. If you have a reference picture from Instagram or Pinterest, send it across and we will tell you honestly how close we can get it in your room.`
        : `Yes. The colours, the name board and the individual props can all be adjusted, and the name board is personalised with the birthday child's name and age as standard. If you have a reference picture, send it across when you book and the team will tell you how close they can get it in your space.`,
    },
    {
      question: `Do you set up ${label} decoration at home${where}?`,
      answer: `Yes — home setups are the bulk of what we do${city ? ` in ${cityName}` : ""}. A decorator comes to your flat or house with everything needed, builds the ${label} setup in the room you choose, and clears away the packaging before leaving. Same-day slots run in most areas if you book early in the day, and midnight slots are available for surprises with a few hours notice. We also set up in banquet halls, hotels and farmhouses, so mention the venue when you book and the decorator will plan the access and the scale accordingly.`,
    },
  ];
};

/** FAQPage JSON-LD for the theme FAQs, or null when there are none. */
export const getThemeFaqSchema = (faqs = []) => {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
};

export default THEME_DATA;
