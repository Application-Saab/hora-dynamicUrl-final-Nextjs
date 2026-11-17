/**
 * Photography blog articles — hardcoded JSX-ready data.
 * Each article has: slug, title, metaTitle, metaDescription,
 * publishedDate, readingTime, category, excerpt, sections[].
 *
 * CMS migration note: structure mirrors a headless-CMS document schema
 * so the migration path is: replace this file with an API fetch,
 * keep the same shape. SEO is unaffected because the routes/slugs stay.
 */

export const PHOTOGRAPHY_BLOG_ARTICLES = [
  {
    slug: "how-to-choose-a-birthday-photographer-in-india",
    title: "How to Choose the Right Birthday Photographer in India",
    metaTitle: "How to Choose a Birthday Photographer in India | HORA Blog",
    metaDescription:
      "Confused about hiring a birthday photographer? Learn what to check — portfolio, pricing, delivery time — before you book anyone for your child's or adult birthday party.",
    publishedDate: "2026-09-10",
    readingTime: 6,
    category: "Birthday Photography",
    categorySlug: "birthday-photography",
    excerpt:
      "Booking a birthday photographer sounds simple until you've scrolled through 40 Instagram profiles and three WhatsApp quotes that all look the same. Here's how to cut through the noise.",
    sections: [
      {
        heading: "Why birthday photography is different from other events",
        body: "Birthday shoots — especially for children — are fast, unpredictable and emotionally charged. A photographer who excels at posed corporate headshots may struggle to capture a toddler mid-smash-cake. The first thing to look for is event-specific experience, not just a good Instagram feed.",
      },
      {
        heading: "Check the portfolio for candid shots, not just setups",
        body: "Any photographer can compose a beautiful shot when the subject is still and the light is controlled. Ask specifically to see candid frames from birthday events — laughing guests, kids running, cake-cutting close-ups. These are the images you'll actually treasure.",
      },
      {
        heading: "Understand what 'editing' means in the quote",
        body: "Basic culling (removing blurred or duplicate frames) is not the same as colour correction, which is not the same as retouching. Confirm whether colour-corrected, print-ready images are included or if they cost extra. A low headline price that excludes editing often ends up more expensive.",
      },
      {
        heading: "Ask about delivery time upfront",
        body: "Standard delivery for a birthday shoot in India ranges from 3 days to 3 weeks depending on the photographer. If you need images for a same-day WhatsApp share or a birthday reel, ask for a same-day preview or 24-hour delivery — some services include this as standard.",
      },
      {
        heading: "Verify the backup plan",
        body: "What happens if your photographer falls sick the morning of the event? A solo photographer has no answer. A platform or agency can send a replacement. Always ask this question before signing off.",
      },
      {
        heading: "Compare total cost, not hourly rate",
        body: "A 2-hour package at ₹4,000 that includes 150 edited photos and a web gallery is better value than a 2-hour shoot at ₹3,000 where editing, travel and gallery hosting are all extra. Build out the full cost before comparing.",
      },
    ],
    closingCta:
      "HORA packages show the final price, delivery time and inclusions upfront — no surprises after the shoot.",
  },

  {
    slug: "maternity-photoshoot-tips-india",
    title: "Maternity Photoshoot Tips for Indian Mothers-to-Be",
    metaTitle: "Maternity Photoshoot Tips India: What to Wear, When to Shoot & More",
    metaDescription:
      "Planning a maternity photoshoot in India? Find out the best time during pregnancy, what outfits work, which poses flatter and how to prepare for a stress-free session.",
    publishedDate: "2026-09-15",
    readingTime: 7,
    category: "Maternity Photography",
    categorySlug: "maternity-photography",
    excerpt:
      "A maternity shoot is one of the few times in your life when you are the sole subject. Getting a few things right beforehand makes the difference between photographs you'll frame and ones you'll forget.",
    sections: [
      {
        heading: "When is the best time for a maternity shoot?",
        body: "Most photographers recommend 30–34 weeks. The bump is fully visible and rounded, but you're still mobile and comfortable enough to try different poses. Earlier than 28 weeks the bump can look ambiguous; later than 36 weeks fatigue and swelling can make the session harder.",
      },
      {
        heading: "Outdoor vs studio: which works better in India?",
        body: "Both work, and the choice depends on your aesthetic. Outdoor sessions — parks, heritage locations, beachfront — give natural light and a sense of space. Studio sessions offer controlled light, draped fabric setups and a private environment, which many mothers prefer for comfort. Morning outdoor shoots (7–9 AM) give the softest light in Indian cities before the heat sets in.",
      },
      {
        heading: "What to wear",
        body: "Flowing fabrics in soft, muted tones (ivory, blush, sage, dusty mauve) photograph well and don't distract from the bump. Avoid busy prints and bright logos. Many photographers carry maternity gowns and drapes; confirm this when booking. If you want traditional wear, a soft georgette saree draped loosely works beautifully.",
      },
      {
        heading: "Poses that flatter",
        body: "The most timeless maternity poses are simple: hands cradling the bump, a profile silhouette against the light, your partner's hands from behind. Avoid poses that require lying flat or twisting the torso. A good photographer will guide you — your job is to relax, not to remember a list.",
      },
      {
        heading: "Include your partner or children",
        body: "Including your partner adds warmth and tells a more complete story. If you have older children, a few frames with them interacting with the bump are often the most emotionally resonant images in the gallery.",
      },
      {
        heading: "Preparation on the day",
        body: "Get a full night of sleep. Eat a proper breakfast. Stay hydrated. Bring a small snack. Wear comfortable shoes you can slip off. The session will take 1–2 hours; a rested, fed mother photographs better than one who rushed from a morning commitment.",
      },
    ],
    closingCta:
      "HORA connects you with verified female photographers for maternity shoots across 17 cities in India.",
  },

  {
    slug: "how-many-photos-should-you-get-from-a-birthday-shoot",
    title: "How Many Photos Should You Get from a Birthday Shoot?",
    metaTitle: "How Many Photos from a Birthday Photoshoot? | HORA Blog",
    metaDescription:
      "Wondering how many edited photos are standard from a birthday photoshoot in India? Learn what's reasonable for 1-hour, 2-hour and half-day packages.",
    publishedDate: "2026-09-20",
    readingTime: 4,
    category: "Birthday Photography",
    categorySlug: "birthday-photography",
    excerpt:
      "The question comes up in almost every booking conversation: 'How many photos will I get?' The honest answer is more nuanced than a single number.",
    sections: [
      {
        heading: "Why 'more photos' isn't always better",
        body: "A photographer who delivers 800 images from a 2-hour birthday shoot is not giving you more value — they're giving you a sorting problem. The industry standard for event photography is 50–100 final, edited images per hour. Within that range, quality culling and consistent editing matter far more than volume.",
      },
      {
        heading: "Typical photo counts by session length",
        body: "A 1-hour birthday shoot: expect 60–100 edited photos. A 2-hour shoot: 120–200. A 3–4 hour event covering setup through cake cut: 200–350. These numbers assume a single photographer. Packages with both a photographer and a videographer will have fewer stills since camera time is shared.",
      },
      {
        heading: "What 'edited' actually means",
        body: "Edited means colour-corrected and exposure-adjusted. It does not automatically mean retouched (skin smoothing, object removal). Confirm which level of editing is included and what the turnaround time is. Lightly edited images in 24 hours are usually more useful than heavily retouched images in 2 weeks.",
      },
      {
        heading: "Ask about the delivery format",
        body: "Web-resolution images (suitable for WhatsApp and social) are not the same as print-ready files (300 DPI). If you want to print a canvas or a photo album, confirm you'll receive high-resolution files, not just web-optimised ones.",
      },
      {
        heading: "The right question to ask",
        body: "Instead of 'how many photos will I get?', ask: 'How many final, colour-corrected images are included, at what resolution, delivered by when?' That gives you the full picture.",
      },
    ],
    closingCta:
      "Every HORA birthday photography package states the number of edited images, resolution and delivery time before you book.",
  },

  {
    slug: "pre-wedding-shoot-locations-india",
    title: "Best Pre-Wedding Shoot Locations Across India",
    metaTitle: "Best Pre-Wedding Shoot Locations in India 2026 | HORA Blog",
    metaDescription:
      "Discover the best pre-wedding photoshoot locations in India — from Rajasthan forts to Goa beaches to Delhi gardens — with tips on the best time to visit each.",
    publishedDate: "2026-09-25",
    readingTime: 8,
    category: "Pre-Wedding Photography",
    categorySlug: "pre-wedding-photography",
    excerpt:
      "The location of a pre-wedding shoot shapes everything: the light, the mood, the outfits that make sense, the story the photos tell. India has an extraordinary range of backdrops — here are the ones that consistently deliver.",
    sections: [
      {
        heading: "Rajasthan: forts, havelis and desert light",
        body: "Jaipur's Amber Fort, Jodhpur's Mehrangarh and Udaipur's lakeside ghats are among the most photographed pre-wedding locations in the country. The warm sandstone catches golden hour light unlike anywhere else. Best season: October to February. Avoid summer — midday heat above 40°C makes extended outdoor shoots impractical.",
      },
      {
        heading: "Goa: beaches, Portuguese architecture and lush interiors",
        body: "Goa works across styles — candid beach frames, dramatic church forecourts, backwater jetties. The northern beaches (Anjuna, Vagator) have a different atmosphere from the south (Palolem, Agonda). The old Latin Quarter in Fontainhas gives a European lane aesthetic that photographs exceptionally well. Best season: November to February.",
      },
      {
        heading: "Delhi NCR: Mughal grandeur and green parks",
        body: "Humayun's Tomb, Lodhi Garden, Mehrauli Archaeological Park and Qutub Minar complex are all accessible in a single day and offer dramatically different looks. For couples who prefer natural settings, Sunder Nursery adjacent to Humayun's Tomb is one of the best-kept secrets in Delhi for photographers.",
      },
      {
        heading: "Coorg, Munnar and the Western Ghats",
        body: "Misty mornings, coffee plantations and waterfalls. The Western Ghats are ideal for couples who want a romantic, lush green look rather than an architectural one. Coorg works year-round except during peak monsoon (June–August), when the roads can be difficult.",
      },
      {
        heading: "Urban shoots: Mumbai and Bangalore",
        body: "For couples who want a contemporary, city-editorial feel rather than a heritage or nature backdrop, Mumbai's Colaba Causeway lanes, Bandra's chapel and stairways or Bangalore's Cubbon Park offer visual variety within a single city. Urban shoots typically have lower travel costs and allow more spontaneity.",
      },
      {
        heading: "Practical tips for any location",
        body: "Book permits early — ASI monuments require photography permits that must be arranged in advance. Carry at least two outfit changes. Plan the session around golden hour (6:30–8 AM or 5–6:30 PM) rather than midday. Always do a recce call with your photographer before the shoot day.",
      },
    ],
    closingCta:
      "HORA photographers across India are familiar with local shooting permits, golden hour timings and the best angles at each location.",
  },

  {
    slug: "candid-vs-traditional-wedding-photography",
    title: "Candid vs Traditional Wedding Photography: What's Right for You?",
    metaTitle: "Candid vs Traditional Wedding Photography India | HORA Blog",
    metaDescription:
      "Can't decide between candid and traditional wedding photography? Understand the difference, what each style costs in India, and how to choose — or combine — both.",
    publishedDate: "2026-10-01",
    readingTime: 6,
    category: "Wedding Photography",
    categorySlug: "wedding-photography",
    excerpt:
      "The candid vs traditional debate comes up in nearly every Indian wedding booking. The right answer depends on what you value — and your parents may have a different answer than you do.",
    sections: [
      {
        heading: "What traditional wedding photography means",
        body: "Traditional photography is posed, deliberate and sequential. The photographer directs the family into frames — groups by age, by side, by ritual. Every shot is intentional. The result is a systematic record of who was there and which rituals happened. It is the kind of photography Indian families have expected at weddings for 60 years, and for good reason.",
      },
      {
        heading: "What candid wedding photography means",
        body: "Candid photography is observational. The photographer blends into the event and waits for genuine moments — a grandmother wiping a tear, the groom seeing the bride for the first time, children falling asleep under the mandap. The best candid images are invisible captures: the subjects don't know the camera was there.",
      },
      {
        heading: "The case for traditional",
        body: "Your great-grandchildren will want to see who attended your wedding. Candid photographers can miss rituals when they're positioned for a different shot. Traditional coverage ensures every family unit, every close relative and every key ritual is documented. It is insurance against gaps.",
      },
      {
        heading: "The case for candid",
        body: "Candid photography produces the images that make people catch their breath. The real emotion of the moment. For social media, for the album you actually look at, for the memory of how the day felt — candid images are usually the ones couples return to.",
      },
      {
        heading: "The practical answer: do both",
        body: "Most Indian wedding packages now include both a traditional and a candid photographer, often one of each. If your budget is limited, a good candid photographer with experience in Indian weddings will naturally cover the key rituals while also capturing the moments in between. Discuss this explicitly during booking.",
      },
      {
        heading: "What to look for in the portfolio",
        body: "For candid: look for sharp focus on fast-moving subjects, natural light handling, and emotional resonance. For traditional: look for consistent lighting, clean backgrounds and sharp group compositions. Both should have consistent colour grading across an album — not a mix of warm, cool and desaturated frames in the same gallery.",
      },
    ],
    closingCta:
      "HORA wedding photography packages include both candid and traditional coverage. See packages for your city.",
  },

  {
    slug: "newborn-photography-safety-tips-india",
    title: "Newborn Photography Safety: What Every Parent Must Know",
    metaTitle: "Newborn Photography Safety Tips India | HORA Blog",
    metaDescription:
      "Newborn photography requires specific safety precautions. Learn what a safe session looks like, what poses to avoid, and what to ask your photographer before booking.",
    publishedDate: "2026-10-05",
    readingTime: 5,
    category: "Newborn Photography",
    categorySlug: "new-born-baby-photography",
    excerpt:
      "Newborn photography produces some of the most beautiful images parents will ever own. It also requires specific knowledge and care. Not every photographer who does birthday or maternity work is qualified to photograph newborns safely.",
    sections: [
      {
        heading: "Why newborn photography is a specialist skill",
        body: "Newborns cannot support their own head, have no temperature regulation and can startle or displace their position without warning. Poses that look effortless in a finished photo often require a spotter, careful setup and sometimes composite editing. A photographer without specific newborn training can cause discomfort or injury through poor posing.",
      },
      {
        heading: "The ideal window: 5–14 days",
        body: "Most newborn sessions are photographed in the first two weeks. Before 5 days the baby may still be yellowish from jaundice and the parents are exhausted from the birth. After 14 days the 'sleepy curly' poses become harder as the baby becomes more alert and less flexible.",
      },
      {
        heading: "Safety poses vs composite poses",
        body: "Some of the most iconic newborn images — the froggy pose, the hanging hammock — are composites: they are created by merging two or more frames in post-processing, with an adult hand always in frame for safety. Ask your photographer which poses are natural (safe alone) and which are composited. Any photographer who attempts composite poses live without a spotter is taking an unacceptable risk.",
      },
      {
        heading: "Props and environment",
        body: "All surfaces, fabrics and props that touch a newborn should be baby-safe, soft and sanitised. The shooting space should be warm (newborns lose body heat quickly when undressed). The photographer should wash hands before and during the session. You have the right to ask about any of these practices.",
      },
      {
        heading: "Questions to ask before booking",
        body: "How many newborn sessions have you photographed? Do you use a spotter for composite poses? What is your safety protocol if the baby becomes distressed? Are all your props clean and sanitised before each session? A good newborn photographer will welcome these questions.",
      },
      {
        heading: "What to prepare at home",
        body: "Feed the baby 20–30 minutes before the photographer arrives. A full, drowsy baby is the ideal session subject. Keep the room warm. Have your own comfort food and water ready — newborn sessions take 2–4 hours, and you will be there the whole time.",
      },
    ],
    closingCta:
      "HORA newborn photographers are verified specialists with confirmed newborn experience and baby-safe equipment.",
  },

  {
    slug: "corporate-event-photography-checklist-india",
    title: "Corporate Event Photography Checklist: What to Brief Your Photographer",
    metaTitle: "Corporate Event Photography Checklist India | HORA Blog",
    metaDescription:
      "Make sure your corporate event is documented properly. This brief checklist covers the must-have shots, turnaround expectations and how to brief your photographer for a conference, product launch or team event.",
    publishedDate: "2026-10-08",
    readingTime: 5,
    category: "Corporate Photography",
    categorySlug: "corporate-photography",
    excerpt:
      "Corporate event photography is often treated as an afterthought — booked a day before the event with no brief. Here's how to get images that are actually useful for PR, LinkedIn and internal comms.",
    sections: [
      {
        heading: "Define the deliverables before the event",
        body: "Are you shooting for a press release, the company website, LinkedIn posts, an internal newsletter, or all of the above? Each use case has different resolution requirements and different compositional priorities. Tell your photographer before the event, not after.",
      },
      {
        heading: "The must-have shot list",
        body: "Wide establishing shot of the venue before attendees arrive. Speaker on stage from front-of-house. Speaker close-up from the side (showing screen context). Audience engagement frames (hands raised, note-taking, interaction). Networking and candid conversations. Award or recognition moments. Group photo of key stakeholders. Any branded signage, product display or registration area.",
      },
      {
        heading: "Share the run-of-show",
        body: "Send your photographer the event schedule — session times, keynote slots, award segments, networking breaks. A photographer who knows the schedule can position correctly for each moment. One who doesn't will miss the keynote speaker's walk-on because they were shooting the welcome desk.",
      },
      {
        heading: "Lighting is the biggest variable at corporate events",
        body: "Conference venues often have mixed stage lighting (warm spots) against ambient cool-white overheads. This is challenging to colour-correct consistently. If you have any control over the AV setup, ask for consistent stage lighting and share the venue layout with your photographer in advance.",
      },
      {
        heading: "Turnaround expectations",
        body: "For PR and press use, a selection of 20–30 web-ready images is often needed within a few hours of the event. For full corporate event coverage, 48–72 hours for a complete edited gallery is standard. Agree on this before the event, not when you're chasing the photographer the next morning.",
      },
    ],
    closingCta:
      "HORA corporate photographers understand PR deadlines and can deliver a quick-turn web gallery alongside the full edited set.",
  },

  {
    slug: "what-to-expect-from-a-baby-shower-photoshoot",
    title: "What to Expect from a Baby Shower Photoshoot in India",
    metaTitle: "Baby Shower Photoshoot India: What to Expect | HORA Blog",
    metaDescription:
      "Planning a baby shower shoot in India? Learn what's typically included, how to coordinate with decorators and caterers, and how to get photos that work for social media and family albums.",
    publishedDate: "2026-10-10",
    readingTime: 5,
    category: "Baby Shower Photography",
    categorySlug: "baby-shower-photography",
    excerpt:
      "Baby shower photography in India often happens inside a decorated home or event hall, with 20–60 guests, games, food and a lot of emotional energy. Here's what a well-planned shoot looks like.",
    sections: [
      {
        heading: "Co-ordinate with your decorator first",
        body: "The photography is only as good as the backdrop. Talk to your photographer about the decoration setup — balloon arches, floral walls, cake table positions — so they can identify the best angles in advance. A photographer who arrives without knowing the layout will spend the first 20 minutes figuring out what they're working with.",
      },
      {
        heading: "What a baby shower shoot should cover",
        body: "Empty venue setup before guests arrive (decoration at its best). Mother-to-be arrival and first reactions. Games and group participation. The cake cut or reveal moment. Gift opening. Group photos with family. Candid moments between guests. Close-up details of the decoration, food table and favour bags.",
      },
      {
        heading: "Timing: when to book the photographer",
        body: "Book the photographer from 30–45 minutes before guests arrive. This gives time to shoot the decorated empty venue and the early setup moments. The photographer can leave 30 minutes after cake cutting if the event is winding down, or stay for the full duration for complete candid coverage.",
      },
      {
        heading: "Reels and video highlights",
        body: "Many HORA baby shower packages include a short reel (60–90 seconds) delivered within 24 hours alongside the photo gallery. If you want a reel for Instagram, confirm this is in the package before booking. A reel needs specific behind-the-scenes frames and short video clips captured during the event — it is not created from still photos.",
      },
      {
        heading: "Guest management during group photos",
        body: "Have someone (a family member or event host) designated to round up guests for group photos. The photographer should not have to chase 40 guests. Two to three group shots — immediate family, full guest group, girlfriends / mother's circle — are standard.",
      },
    ],
    closingCta:
      "HORA baby shower photography packages include a gallery delivered within 24 hours, with optional reel add-on.",
  },

  {
    slug: "wedding-photography-checklist-india",
    title: "Complete Indian Wedding Photography Checklist",
    metaTitle: "Indian Wedding Photography Checklist: Must-Have Shots | HORA Blog",
    metaDescription:
      "Use this checklist to brief your wedding photographer on every ritual, family group and candid moment you want captured — so nothing gets missed on the day.",
    publishedDate: "2026-10-12",
    readingTime: 7,
    category: "Wedding Photography",
    categorySlug: "wedding-photography",
    excerpt:
      "Indian weddings span multiple days, multiple rituals and multiple families. Without a clear brief, even a skilled photographer will miss shots that matter to you. This checklist exists so that doesn't happen.",
    sections: [
      {
        heading: "Pre-wedding day coverage",
        body: "Mehendi ceremony: bride's hands detail, reaction shots, female gathering candids. Haldi: the application moment, family laughter, the bride's expression. Sangeet: performances, audience reactions, couple on stage. Ring ceremony: the exchange, close-up of rings, family witnessing.",
      },
      {
        heading: "Getting-ready shots",
        body: "Bride's makeup and dressing sequence (detail shots of jewellery, shoes, lehenga). Groom's sherwani and pagri. Both sets of parents getting ready. First look between couple if planned. Bridal party / group of close friends.",
      },
      {
        heading: "Ceremony must-haves",
        body: "Baraat entry and dhol players. Groom's expression seeing the bride. Jaimala exchange. Saat phere (each phera). Mangalsutra and sindoor. Vidaai — mother and bride, father and bride. Reception entry. First dance or couple moment.",
      },
      {
        heading: "Family group photos — build the list in advance",
        body: "Bride's immediate family. Groom's immediate family. Bride's extended family. Groom's extended family. Couple with both families together. Couple with bridesmaids. Couple with close friends. Couple alone (portraits). Send this list to your photographer at least 2 days before the wedding.",
      },
      {
        heading: "Details that are often missed",
        body: "Wedding invitation. Bride's shoes and jewellery flat-lay. Wedding cake or mithai table. Table centrepieces and decoration. Rings together. Name cards or seating chart. These detail shots take seconds but complete the visual story of the day.",
      },
      {
        heading: "After the wedding",
        body: "Couple portrait session the day after (when you're rested). Outfits can be re-worn for portraits — many couples choose this over rushed portrait time on the wedding day itself.",
      },
    ],
    closingCta:
      "Share this checklist with your HORA photographer before your wedding — they will use it to plan their shot schedule for the day.",
  },

  {
    slug: "photography-package-price-guide-india-2026",
    title: "Photography Package Price Guide in India (2026)",
    metaTitle: "Photography Package Prices in India 2026 | HORA Blog",
    metaDescription:
      "What does professional photography cost in India in 2026? A realistic breakdown of price ranges for birthday, wedding, maternity, corporate and newborn photography — by city tier.",
    publishedDate: "2026-10-14",
    readingTime: 6,
    category: "Guides",
    categorySlug: null,
    excerpt:
      "Photography pricing in India varies enormously — and the gap between a ₹3,000 quote and a ₹30,000 quote for ostensibly the same event is not always explained. Here's what drives the difference.",
    sections: [
      {
        heading: "What determines photography pricing",
        body: "Four factors drive the price: experience and portfolio quality, session length, inclusions (editing, gallery, reel, album), and city. A photographer in Mumbai or Delhi typically charges 20–40% more than an equivalent photographer in a Tier 2 city, because their operating costs are higher.",
      },
      {
        heading: "Birthday photography pricing",
        body: "Entry-level (1–2 hours, 100 photos, basic edit): ₹3,000–₹6,000. Mid-range (2–3 hours, 150–200 edited photos, colour correction, web gallery): ₹6,000–₹12,000. Premium (3+ hours, 200+ photos, reel, same-day preview, print-ready files): ₹12,000–₹25,000.",
      },
      {
        heading: "Wedding photography pricing",
        body: "Single-day candid coverage: ₹25,000–₹60,000. Multi-day (mehendi through reception, 2–3 photographers, video): ₹80,000–₹2,50,000. Destination wedding photography: ₹1,50,000–₹5,00,000+. These ranges reflect packages where editing and an online album are included.",
      },
      {
        heading: "Maternity photography pricing",
        body: "Studio session (1.5–2 hours, 50–80 edited photos): ₹4,000–₹9,000. Outdoor session with location: ₹6,000–₹15,000. Premium with gown hire, multiple outfits, print-ready album: ₹15,000–₹30,000.",
      },
      {
        heading: "Corporate event photography pricing",
        body: "Half-day event (4 hours, 150 edited images): ₹8,000–₹18,000. Full-day conference: ₹15,000–₹35,000. These rates vary significantly by city — Mumbai and Delhi corporate rates are at the higher end.",
      },
      {
        heading: "What you should never compromise on",
        body: "Editing quality and delivery time. A slightly cheaper package where you receive 1,000 unedited RAW files in 3 weeks is not a deal — it's a problem. Confirm: edited images only, colour corrected, delivered within 48–72 hours (24 hours for quick-turn needs), to a permanent gallery link.",
      },
    ],
    closingCta:
      "All HORA packages show the final price, number of edited images, delivery time and what's included — before you pay anything.",
  },

  {
    slug: "engagement-photoshoot-ideas-india",
    title: "Engagement Photoshoot Ideas for Indian Couples",
    metaTitle: "Engagement Photoshoot Ideas in India 2026 | HORA Blog",
    metaDescription:
      "Looking for engagement photoshoot ideas in India? Discover location ideas, outfit tips, prop suggestions and timing advice for a shoot that reflects your personality.",
    publishedDate: "2026-10-16",
    readingTime: 5,
    category: "Engagement Photography",
    categorySlug: "engagement-photography",
    excerpt:
      "An engagement shoot is different from a pre-wedding shoot — it is typically lower-key, more personal and often the first time a couple has been photographed together professionally. Here's how to make it work.",
    sections: [
      {
        heading: "Treat it as a rehearsal, not a performance",
        body: "The main value of an engagement shoot is comfort. It gives you and your partner the experience of being photographed together before your wedding day — so you know what to do with your hands, how to position yourselves and how to look natural in front of a camera. Approach it with low stakes.",
      },
      {
        heading: "Choose a location that means something",
        body: "The café where you met. The park where he proposed. Your city's most recognisable street. A location with personal significance produces images with more emotional depth than a generic heritage monument — even if the monument is objectively more beautiful.",
      },
      {
        heading: "Outfit coordination, not matching",
        body: "You don't need to wear identical colours, but your outfits should be in the same tonal family. Earth tones, pastels or classic neutrals photograph well together. Avoid logos, text or busy prints on both of you — one of you in a printed outfit works; both in prints creates visual noise.",
      },
      {
        heading: "Bring one meaningful prop",
        body: "A book you both love, the city newspaper from the day you met, a bicycle, a dog. One personal prop adds a layer of story without turning the shoot into a prop showcase. More than two props starts to look forced.",
      },
      {
        heading: "Plan for golden hour but have a backup",
        body: "Golden hour (60 minutes after sunrise, 60 minutes before sunset) gives the most flattering natural light for couples. However, cloud cover, monsoon weather or venue availability may not cooperate. An experienced photographer can produce great engagement images in overcast light or open shade — don't reschedule just because it's not perfectly golden.",
      },
    ],
    closingCta:
      "HORA engagement photographers across India are available for 1–2 hour sessions with 24-hour gallery delivery.",
  },

  {
    slug: "anniversary-photography-india-ideas",
    title: "Anniversary Photography Ideas in India: From Milestone to Everyday Moments",
    metaTitle: "Anniversary Photography Ideas India 2026 | HORA Blog",
    metaDescription:
      "Planning an anniversary photoshoot in India? Discover meaningful ideas for milestone anniversaries, recreating old photos, surprise shoots and intimate home sessions.",
    publishedDate: "2026-10-18",
    readingTime: 5,
    category: "Anniversary Photography",
    categorySlug: "anniversary-photography",
    excerpt:
      "Anniversary photography is the least-booked and most underrated genre in India. Most couples don't think to document their relationship outside of the wedding. Here's why they should — and how to do it well.",
    sections: [
      {
        heading: "Milestone vs annual shoots",
        body: "A 25th or 50th anniversary often calls for a proper shoot — professional, possibly at the original wedding venue, with family. An annual anniversary shoot can be as simple as a 1-hour session at a local park with no more planning than 'wear what you'd wear to dinner'. Both have value; they are different in scope and cost.",
      },
      {
        heading: "Recreating old photos",
        body: "For milestone anniversaries especially, recreating a photo from your wedding or a significant early moment in your relationship is one of the most emotionally resonant things you can do with a camera. Find the original frame. Return to the same location if possible. Wear something in the same colour palette. The contrast of time in a single side-by-side image is extraordinarily moving.",
      },
      {
        heading: "The surprise anniversary shoot",
        body: "One partner plans everything — the location, the photographer, the reason to be there — while the other has no idea. The genuine surprise on a partner's face when the camera appears is the most authentic expression in anniversary photography. The planning partner takes responsibility for the photographer brief entirely.",
      },
      {
        heading: "In-home sessions",
        body: "A documentary-style shoot at home — making coffee together, reading, playing with children, on the balcony at dusk — captures a couple as they actually are, not how they pose for cameras. These images often become the most treasured over time, because they document the real texture of a life together.",
      },
      {
        heading: "What to do with the photos",
        body: "Don't leave them in a web gallery. Print a small album. Frame one or two. Send a print to your parents. A physical photograph outlasts a cloud gallery that gets forgotten in an inbox. Anniversary photos are worth printing.",
      },
    ],
    closingCta:
      "HORA anniversary shoots start from 1 hour with gallery delivery in 24 hours. No elaborate planning required.",
  },
];

/**
 * Get a single article by slug.
 */
export const getPhotographyBlogArticle = (slug) => {
  if (!slug) return null;
  return PHOTOGRAPHY_BLOG_ARTICLES.find((a) => a.slug === slug) || null;
};

/**
 * Get all articles (for listing page and sitemap).
 */
export const getAllPhotographyBlogArticles = () => PHOTOGRAPHY_BLOG_ARTICLES;