/**
 * Venue blog articles — hardcoded data.
 * Each article has: slug, title, metaTitle, metaDescription,
 * publishedDate, readingTime, category, catValue,
 * excerpt, sections[], relatedCities[], closingCta, closingCtaLink, closingCtaLabel.
 *
 * URL pattern: /blog/venue/[slug]
 * Venue listing pages: /[city]/venue-list or /[city]/venue-list/[cat]
 */

export const VENUE_BLOG_ARTICLES = [

  // ─── BIRTHDAY VENUES ─────────────────────────────────────────────────────

  {
    slug: "birthday-party-venue-guide-india-2026",
    title: "How to Choose the Perfect Birthday Party Venue in India (2026 Guide)",
    metaTitle: "Birthday Party Venue Guide India 2026 | HORA Blog",
    metaDescription:
      "Everything you need to know to pick the right birthday party venue in India — banquet halls, rooftops, cafes, farmhouses. What to check, what to ask, and what it costs.",
    publishedDate: "2026-10-10",
    readingTime: 7,
    category: "Birthday Venues",
    catValue: "birthday-venues",
    excerpt:
      "The venue sets the tone for everything. Pick wrong and even great food and decoration can't save it. Here's how to find the right birthday party venue in India — the checks that matter and the ones you can skip.",
    sections: [
      {
        heading: "Banquet hall vs. cafe vs. farmhouse — which suits your birthday?",
        body: "Banquet halls work best for 50+ guests who need air conditioning, a stage and in-house catering. Cafes and restaurants suit intimate birthdays of 15–40 people — lower minimum spend, no booking headache. Farmhouses are the pick for outdoor-feel parties with kids running around or themed decor that needs space. Rooftop venues sit between — great for evenings, awkward in monsoon.",
      },
      {
        heading: "The capacity trap most people fall into",
        body: "A hall listed as '100 capacity' usually means 100 people standing. For a seated dinner with a dance floor that number drops to 60–70. Always ask the venue for their seated dinner capacity specifically, then add 15% buffer. An overcrowded room on a birthday is uncomfortable for guests and unflattering in photos.",
      },
      {
        heading: "What the per-plate price actually includes",
        body: "Most venues quote a per-plate price that covers only the food. The hall rental, table linen, crockery, service staff and sometimes even the stage or projector screen come as line items on top. Ask for an all-inclusive quote and compare venues on that number, not just the per-plate headline.",
      },
      {
        heading: "The outside vendor question",
        body: "Many banquet halls restrict outside caterers or decorators and charge a 'corkage fee' if you bring your own alcohol. This can add ₹10,000–₹30,000 to your bill. Ask explicitly: Can I bring my own decorator? My own DJ? My own cake? The answers will change your effective cost significantly.",
      },
      {
        heading: "Timing: how far in advance to book",
        body: "In metros like Bangalore, Mumbai and Delhi, popular banquet halls on weekends book out 6–8 weeks ahead, especially for Saturdays in October–February. For a weekday or Sunday afternoon birthday you can usually find something 2–3 weeks ahead. If your date is fixed, book the venue before you send invites — not after.",
      },
      {
        heading: "What HORA shows you that most booking platforms don't",
        body: "HORA lists actual package prices with what's included — not just a 'starting from' number. You can filter by guest count, venue type and budget, see photos from real events held at the venue, and compare packages side by side before you even call anyone.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "noida"],
    closingCta: "Browse birthday party venues in your city — compare packages, photos and prices on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Birthday Venues",
  },

  // ─── ANNIVERSARY VENUES ──────────────────────────────────────────────────

  {
    slug: "anniversary-party-venue-ideas-india",
    title: "Anniversary Party Venue Ideas in India — From Intimate to Grand",
    metaTitle: "Anniversary Party Venue Ideas India | HORA Blog",
    metaDescription:
      "Planning an anniversary celebration? Discover the best venue options in India for intimate dinners, milestone parties and silver or golden jubilees — with real cost estimates.",
    publishedDate: "2026-10-15",
    readingTime: 6,
    category: "Anniversary Venues",
    catValue: "anniversary-venues",
    excerpt:
      "An anniversary venue should feel special without feeling like a wedding. Here are the best options for every scale — from a romantic dinner for two to a 200-guest silver jubilee celebration.",
    sections: [
      {
        heading: "Intimate anniversary (2–20 guests) — best venue types",
        body: "Private dining rooms at restaurants are the most underrated option — most fine-dining restaurants have a private room for 10–20 people that can be reserved for a flat hire fee plus minimum spend. Rooftop terraces at boutique hotels work beautifully for 10–30 people, especially in the evening. Both feel exclusive without the logistics of a full banquet hall.",
      },
      {
        heading: "Mid-size anniversary (20–80 guests) — what to look for",
        body: "Look for venues with an attached outdoor area — a garden, terrace or poolside — so guests have room to move between seating and mingling space. Standalone banquet halls with customisable lighting are ideal: amber and gold lighting transforms even a plain hall for an anniversary. Avoid venues with fixed stage setups meant for wedding receptions — they can feel too formal for a family anniversary.",
      },
      {
        heading: "Silver and golden jubilee celebrations (100+ guests)",
        body: "For milestone anniversaries of 25 or 50 years, convention halls and hotel banquet rooms with in-house catering are worth the premium. They handle logistics (parking, washrooms, service staff) that standalone farmhouses often struggle with at this scale. Many hotels also offer special packages for golden and silver jubilees that include a complimentary cake and room for the couple.",
      },
      {
        heading: "Decoration at anniversary venues — what works",
        body: "Anniversary venues look best with floral centrepieces, soft draping and photo displays rather than the balloon walls popular at birthdays. Ask your venue if they have a tie-up with a decorator — many banquet halls have preferred vendors who know the space and can set up and clear within the allowed hours.",
      },
      {
        heading: "Cost breakdown for a 50-person anniversary in a metro",
        body: "Hall rental: ₹15,000–₹40,000. Per-plate food (veg): ₹600–₹1,200. Decoration: ₹8,000–₹25,000. DJ or live music: ₹8,000–₹20,000. Cake: ₹2,000–₹6,000. Total for 50 guests typically lands between ₹60,000 and ₹1,20,000 depending on the city and venue type.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "gurugram"],
    closingCta: "Find the perfect anniversary venue in your city — browse packages and photos on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Anniversary Venues",
  },

  // ─── KIDS BIRTHDAY VENUES ────────────────────────────────────────────────

  {
    slug: "kids-birthday-party-venue-guide-india",
    title: "Kids Birthday Party Venue Guide India — What Parents Need to Know",
    metaTitle: "Kids Birthday Party Venue Guide India | HORA Blog",
    metaDescription:
      "Choosing a venue for a kids birthday party in India? Here's what to check for safety, space, activities and cost — with real tips from parents who've done it.",
    publishedDate: "2026-10-20",
    readingTime: 6,
    category: "Kids Party Venues",
    catValue: "kids-birthday-venues",
    excerpt:
      "Kids parties are a different beast. The venue that works for an adult birthday often falls flat for children — wrong energy, wrong layout, wrong logistics. Here's what actually matters when picking a kids party venue.",
    sections: [
      {
        heading: "Space over style for kids under 8",
        body: "Young children need room to run, not a decorated backdrop for Instagram. For kids under 8 prioritise open floor space — at least 300 sq ft for 20 children. Indoor play zones, activity halls and community clubhouses outperform fancy banquet halls for this age group. The best kids party venues have a padded or grass area where children can be physically active.",
      },
      {
        heading: "Safety checks most parents overlook",
        body: "Walk the venue before booking. Check: Are there sharp edges on furniture at child height? Is the emergency exit clearly marked and unobstructed? Is there a separate adult seating area where parents can supervise without being in the middle of the chaos? Is the kitchen access restricted so children can't wander in? These aren't bureaucratic checks — they determine how relaxed the party actually feels.",
      },
      {
        heading: "Theme venues vs. blank-canvas venues",
        body: "Theme party venues (superhero, princess, jungle) save you decoration cost and planning effort — everything is already set up. The trade-off is a fixed aesthetic you can't change much. Blank-canvas halls give you full control but require a decorator. For children under 6, a theme venue is usually the better value. For 8+ year olds who have strong opinions about their party, a customisable space gives them what they want.",
      },
      {
        heading: "Catering for kids — the things venues don't tell you",
        body: "Kids eat far less than adults but are far more specific about what they eat. Standard per-plate packages designed for adult palates often go largely uneaten. The best kids party venues offer a kids menu — mini sandwiches, nuggets, pizza slices, fruit cups — either included in the package or as an add-on. If yours doesn't, ask if you can bring outside snack boxes.",
      },
      {
        heading: "Timing and duration — what works for kids parties",
        body: "2–2.5 hours is the sweet spot for kids under 8. After that energy crashes and meltdowns begin. Afternoon slots (2–5pm) work better than evening — children are alert, the light is good for photos and it doesn't interfere with bedtimes. Book a morning or early afternoon slot even if the venue offers cheaper rates in the evening.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "noida"],
    closingCta: "Find kids party venues in your city — compare packages, play zones and prices on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Kids Party Venues",
  },

  // ─── ROOFTOP VENUES ──────────────────────────────────────────────────────

  {
    slug: "rooftop-party-venue-guide-india",
    title: "Rooftop Party Venues in India — What to Check Before You Book",
    metaTitle: "Rooftop Party Venue Guide India | HORA Blog",
    metaDescription:
      "Rooftop venues look stunning in photos but have real-world challenges. Here's what to check for weather, noise, capacity and cost before booking a rooftop party venue in India.",
    publishedDate: "2026-10-25",
    readingTime: 5,
    category: "Rooftop Venues",
    catValue: "rooftop-venues",
    excerpt:
      "Rooftop parties photograph beautifully and have an energy that indoor halls can't match. But rooftops come with trade-offs — weather, noise curfews, restricted capacity. Here's how to get the magic without the headaches.",
    sections: [
      {
        heading: "Best months for rooftop parties in Indian cities",
        body: "October to February is rooftop season across most of India — cool evenings, low humidity and no rain risk. March–May can work in the evening in northern cities but are brutal in coastal ones. Avoid June–September unless the venue has a rain cover or pergola. In Bangalore and Pune mild weather extends the rooftop season to nearly year-round, but always have a backup plan.",
      },
      {
        heading: "Noise curfew — the number one rooftop problem",
        body: "Most residential areas in Indian cities have a noise restriction after 10pm. Rooftop venues are particularly exposed — sound travels further outdoors and complaints from neighbours are common. Always ask the venue: What time does music have to stop? Have you received noise complaints? Is there a sound limiter on the PA system? A party that gets shut down at 9:30pm is a party no one will remember fondly.",
      },
      {
        heading: "Capacity is smaller than it looks",
        body: "A rooftop that photographs as spacious often has an actual usable area of 1,000–1,500 sq ft once you account for a bar counter, a small dance floor, tables and service space. That translates to a comfortable capacity of 40–60 people seated, or 80–100 standing. Many venues overstate their rooftop capacity — visit in person and count the tables rather than trusting the number quoted.",
      },
      {
        heading: "What to ask about the terrace setup",
        body: "Ask specifically: Is there a permanent weatherproof cover or only a temporary canopy? How is the flooring — tiles, astroturf, bare concrete? What is the lighting setup — string lights only, or proper event lighting? Is there a service elevator for catering or do staff have to carry everything up stairs? These details determine how the event actually feels on the day.",
      },
      {
        heading: "Cost vs. indoor halls",
        body: "Rooftop venues typically charge 20–40% more than a comparable indoor hall for the same capacity. The premium goes towards the aesthetic, not additional services. If your budget is tight, an indoor hall with terrace access as a secondary area is a smart middle ground — guests get the rooftop moment for photos and sunset drinks without the full rooftop cost.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "gurugram"],
    closingCta: "Browse rooftop party venues in your city — view photos, capacity and pricing on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Rooftop Venues",
  },

  // ─── BANQUET HALLS ───────────────────────────────────────────────────────

  {
    slug: "banquet-hall-booking-guide-india-2026",
    title: "Banquet Hall Booking Guide India 2026 — Prices, Packages & What to Check",
    metaTitle: "Banquet Hall Booking Guide India 2026 | HORA Blog",
    metaDescription:
      "Everything about booking a banquet hall in India — what packages include, hidden costs, how to compare halls, and what to negotiate. Real price ranges for 2026.",
    publishedDate: "2026-11-01",
    readingTime: 8,
    category: "Banquet Halls",
    catValue: "banquet-hall",
    excerpt:
      "Banquet halls are the backbone of party planning in India — but the pricing is confusing, the packages vary wildly, and the hidden costs can blow your budget. Here's how to cut through it.",
    sections: [
      {
        heading: "What a banquet hall package typically includes",
        body: "A standard banquet package covers: hall rental for 4–6 hours, tables and chairs, basic linen, one or two service staff per 50 guests, and food (veg/non-veg menu at a per-plate rate). It usually does not include: extra hours beyond the slot, decoration, DJ or sound system, projector and screen, premium crockery or glassware, bar service, or parking management. Get a written list of inclusions before you agree on price.",
      },
      {
        heading: "Price ranges across Indian cities (2026)",
        body: "Budget halls (capacity 50–100): ₹8,000–₹20,000 for the slot + ₹400–₹600 per plate. Mid-range halls (100–200 capacity): ₹20,000–₹50,000 + ₹600–₹1,000 per plate. Premium halls (200+ capacity): ₹50,000–₹1,50,000 + ₹1,000–₹2,000 per plate. Metros (Mumbai, Delhi, Bangalore) run 30–50% higher than tier-2 cities for the same type of hall.",
      },
      {
        heading: "The 'minimum billing' trap",
        body: "Many halls set a minimum billing amount — typically ₹50,000–₹2,00,000 — regardless of your actual guest count. If you book a hall for 100 guests but only 60 show up, you still pay for 100. Always ask: Is there a minimum billing? What happens if fewer guests attend? Some halls are flexible on this in exchange for a slightly higher per-plate rate.",
      },
      {
        heading: "Timing and slot policies",
        body: "Most banquet halls offer two or three slots per day: morning (8am–1pm), afternoon (1pm–6pm), evening (6pm–11pm or midnight). Slots that cross over — say a party that runs from 4pm to 9pm — typically require booking two slots or paying an overlap fee. Know your running time before you book and confirm the overtime rate in writing.",
      },
      {
        heading: "How to actually compare two halls on price",
        body: "Take the per-plate quote, multiply by your guest count, add the hall rental, add your estimated decoration cost (₹15,000–₹40,000 for most events), and add any per-head fees the hall charges for outside vendors. That's your true event cost. Only compare halls on that final number — not on the headline per-plate rate.",
      },
      {
        heading: "What to negotiate",
        body: "Hall managers have more flexibility than they let on, especially for weekday bookings, off-peak months (June–September) or last-minute dates. Items worth negotiating: complimentary extra hour, waiver of outside decorator fee, free parking or valet, upgrade on linen or crockery, complimentary welcome drinks. Get everything agreed in writing in the booking form — verbal agreements at banquet halls rarely hold.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "noida", "gurugram"],
    closingCta: "Compare banquet halls in your city — real packages, prices and photos on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Banquet Halls",
  },

  // ─── FARMHOUSE VENUES ────────────────────────────────────────────────────

  {
    slug: "farmhouse-party-venue-guide-india",
    title: "Farmhouse Party Venues in India — What You Get and What to Watch Out For",
    metaTitle: "Farmhouse Party Venue Guide India | HORA Blog",
    metaDescription:
      "Farmhouse venues offer space, greenery and a relaxed vibe that banquet halls can't match. Here's what to check before booking — from facilities to noise rules and hidden costs.",
    publishedDate: "2026-11-05",
    readingTime: 6,
    category: "Farmhouse Venues",
    catValue: "farmhouse-venues",
    excerpt:
      "Farmhouses are increasingly popular for birthdays, anniversaries and corporate parties — open space, greenery and no neighbour to complain about the music. But they come with their own set of checks. Here's what to look for.",
    sections: [
      {
        heading: "What makes farmhouses work for parties",
        body: "Space is the main draw — most farmhouses near Indian metros offer 2,000–10,000 sq ft of usable outdoor area, sometimes with a swimming pool, bonfire area and garden. For kids parties, family reunions and large birthday bashes where children and adults need to coexist without getting in each other's way, farmhouses are hard to beat. The relaxed, non-hotel atmosphere also makes guests stay longer and enjoy more.",
      },
      {
        heading: "Facilities to check before you book",
        body: "Ask specifically: Is there a covered area in case of rain? How many clean washrooms are available (1 per 20–25 guests is a minimum)? Is there a commercial kitchen or only a service area? Is there a generator for power backup? Is there a parking area on the property? A farmhouse that fails on any of these turns a fun party into a logistical nightmare.",
      },
      {
        heading: "Catering at farmhouses — your options",
        body: "Unlike banquet halls, most farmhouses let you bring your own caterer. This gives you more control over menu and cost but also more responsibility for setup, service staff and cleanup. Some farmhouses have an empanelled caterer list; others have a fully equipped kitchen that any caterer can use. Know which model the farmhouse operates on before you finalise your catering.",
      },
      {
        heading: "Distance and transport — the hidden planning factor",
        body: "Most farmhouses near Indian metros are 20–40 km from the city centre. That's fine for guests who drive, but can be a problem for elderly family members or for getting vendors (decorators, DJ, cake delivery) to the venue on time, especially on weekday evenings. Factor in traffic, plan for a vendor arrival window of at least 3 hours before guests and confirm that all vendors are willing to travel to the venue.",
      },
      {
        heading: "Cost of a farmhouse party for 100 guests",
        body: "Farmhouse rental: ₹25,000–₹70,000 for a full day. Catering (outside caterer, veg): ₹500–₹900 per plate. Decoration: ₹20,000–₹50,000. DJ and lighting: ₹15,000–₹30,000. Transport for guests (if arranged): ₹8,000–₹15,000. Total for 100 guests typically: ₹1,20,000–₹2,50,000. Farmhouse parties can be very cost-effective per head at larger guest counts where banquet hall rental would spike.",
      },
    ],
    relatedCities: ["bangalore", "delhi", "noida", "gurugram", "hyderabad"],
    closingCta: "Browse farmhouse party venues near your city — view space, amenities and prices on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Farmhouse Venues",
  },

  // ─── BABY SHOWER VENUES ──────────────────────────────────────────────────

  {
    slug: "baby-shower-venue-guide-india",
    title: "Baby Shower Venue Guide India — How to Pick the Right Space",
    metaTitle: "Baby Shower Venue Guide India | HORA Blog",
    metaDescription:
      "Planning a baby shower venue in India? Here's how to choose the right space for size, comfort and vibe — with cost estimates and tips on what to avoid.",
    publishedDate: "2026-11-08",
    readingTime: 5,
    category: "Baby Shower Venues",
    catValue: "baby-shower-venues",
    excerpt:
      "Baby showers are smaller, warmer events than birthdays — the venue should match. Here's how to find a space that feels intimate and special without overpaying for capacity you don't need.",
    sections: [
      {
        heading: "How big a space do you actually need?",
        body: "Most baby showers in India have 20–50 guests, nearly all of whom will be seated. For 30 guests you need roughly 500–600 sq ft of seated space — a small banquet room, a private restaurant dining area or a decorated home living room. Many families overspend on hall capacity they don't use. If your guest list is under 40, a restaurant private room is usually the most cost-effective and comfortable option.",
      },
      {
        heading: "Venue features that matter for baby showers",
        body: "Look for: good air conditioning (the expecting mother needs to be comfortable), clean and accessible washrooms close to the main space, easy access without too many stairs (important for the mother-to-be and older guests), and a space that allows outside decoration. Baby showers rely heavily on theme decoration — balloons, floral centrepieces, photo walls — so a venue that restricts what you can bring in will limit your ability to create the atmosphere.",
      },
      {
        heading: "Timing — why afternoon works best",
        body: "Baby showers work best as afternoon events — typically 1pm to 5pm. The expecting mother is usually more energetic earlier in the day, the light is better for photos, and an afternoon slot is typically cheaper than an evening slot at the same venue. It also avoids the pressure of a late-night event that can be tiring for the guest of honour.",
      },
      {
        heading: "Food and catering for baby showers",
        body: "Baby showers are lighter on food than birthday parties. High-tea style catering — finger sandwiches, mini pastries, fruit platters, mocktails — fits the occasion better than a heavy buffet. Many restaurants and cafes offer a high-tea package specifically for baby showers that is significantly cheaper per head than a full meal. If the expecting mother has dietary restrictions (common in pregnancy), confirm the menu can accommodate them.",
      },
      {
        heading: "Cost estimate for a 30-person baby shower",
        body: "Venue hire (private dining room or small banquet): ₹5,000–₹15,000. High-tea catering at ₹400–₹700 per head: ₹12,000–₹21,000. Decoration (pastel theme): ₹8,000–₹20,000. Cake: ₹2,000–₹5,000. Total: ₹27,000–₹61,000, depending on how elaborate the decoration and food are.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "gurugram"],
    closingCta: "Find baby shower venues in your city — compare spaces, packages and prices on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Baby Shower Venues",
  },

  // ─── CORPORATE PARTY VENUES ──────────────────────────────────────────────

  {
    slug: "corporate-party-venue-guide-india",
    title: "Corporate Party Venue Guide India — Choosing the Right Space for Your Team",
    metaTitle: "Corporate Party Venue Guide India | HORA Blog",
    metaDescription:
      "Planning a corporate party or team celebration in India? Here's how to pick a venue that works for your team size, budget and event format — with real cost estimates for 2026.",
    publishedDate: "2026-11-10",
    readingTime: 6,
    category: "Corporate Party Venues",
    catValue: "corporate-party-venues",
    excerpt:
      "Corporate parties have different requirements from personal celebrations — professional ambience, easy access, invoice-friendly billing and enough variety to keep a diverse team engaged. Here's how to find a venue that delivers all of that.",
    sections: [
      {
        heading: "Define the event format before you look at venues",
        body: "Corporate parties range from a team lunch for 20 to an annual gala for 500. The format — sitdown dinner, cocktail standing event, team activity + dinner, or outdoor team outing — determines the kind of venue you need. A cocktail event for 150 needs 3,000+ sq ft of open space. A sitdown dinner for the same number needs half as much. Fixing the format first saves you from visiting venues that simply won't work.",
      },
      {
        heading: "Location matters more for corporate events than personal ones",
        body: "Employees travelling to a corporate party after work hours are unlikely to go more than 30–45 minutes from the office. Venues near business districts or on metro lines see much better attendance than ones that require a cab from the periphery. If your team is spread across the city, a central location even at a premium is worth it — attendance directly affects the event's success.",
      },
      {
        heading: "What corporate venues should offer on the invoice",
        body: "For corporate bookings, the venue must be able to issue a GST-compliant invoice with their GSTIN, HSN code and a clear itemised breakup. Many standalone banquet halls and farmhouses can't do this. If your company needs to reimburse or report the expense, verify the billing requirements with your finance team before you book — not after.",
      },
      {
        heading: "Team activities at the venue — what's available",
        body: "Many venues now offer add-on team activity packages: trivia nights, cocktail-making workshops, stand-up comedy shows, photo booth setups and live music performances. These are worth the add-on cost for annual parties — they give people something to do and talk about. Ask the venue what activity partners they work with or whether you can bring your own entertainment team.",
      },
      {
        heading: "Cost estimate for a 100-person corporate party",
        body: "Venue hire (evening slot, 5–10pm): ₹30,000–₹70,000. Food and beverage (dinner + welcome drinks): ₹900–₹1,800 per head. DJ and sound: ₹15,000–₹30,000. Decoration (branded backdrop, table centrepieces): ₹20,000–₹40,000. Total: ₹1,55,000–₹3,20,000 for 100 people, before alcohol. Add ₹500–₹1,000 per head if you're including an open bar.",
      },
    ],
    relatedCities: ["bangalore", "mumbai", "delhi", "hyderabad", "gurugram", "noida"],
    closingCta: "Find corporate party venues in your city — view capacity, packages and prices on HORA.",
    closingCtaLink: "/venue-list",
    closingCtaLabel: "Browse Corporate Venues",
  },

];

/**
 * Returns all blog articles (for the listing page).
 */
export function getAllVenueBlogArticles() {
  return VENUE_BLOG_ARTICLES;
}

/**
 * Returns one article by slug (for the detail page).
 */
export function getVenueBlogArticle(slug) {
  return VENUE_BLOG_ARTICLES.find((a) => a.slug === slug) || null;
}
