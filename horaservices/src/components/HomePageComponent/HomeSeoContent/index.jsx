import Link from "next/link";
import "./homeseocontent.css";

// Cities where HORA has live teams. Keep in sync with the footer city list.
const LIVE_CITIES = [
  { slug: "delhi", name: "Delhi" },
  { slug: "gurugram", name: "Gurugram" },
  { slug: "noida", name: "Noida" },
  { slug: "ghaziabad", name: "Ghaziabad" },
  { slug: "faridabad", name: "Faridabad" },
  { slug: "bangalore", name: "Bangalore" },
  { slug: "hyderabad", name: "Hyderabad" },
  { slug: "mumbai", name: "Mumbai" },
];

const SERVICES = [
  {
    href: "/balloon-decoration",
    name: "Balloon and flower decoration",
    text: "Birthday, anniversary, baby shower, welcome baby, haldi and first night setups at home or at your venue, from Rs 1,499. Same-day slots in most areas.",
  },
  {
    href: "/venue-list",
    name: "Party venues",
    text: "Banquet halls, rooftops, pubs, farmhouses, villas and game zones with packages, guest capacity and starting prices shown upfront.",
  },
  {
    href: "/chef-near-me",
    name: "Chef for party at home",
    text: "Pick your dishes and guest count, and a chef cooks the full menu in your kitchen. North Indian, South Indian, Chinese, Continental and live barbecue.",
  },
  {
    href: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
    name: "Live catering and food delivery",
    text: "Buffet catering with live counters, or bulk party food delivered hot, for house parties, poojas and office events.",
  },
  {
    href: "/photography",
    name: "Photographers and videographers",
    text: "Verified photographers booked by the hour, for birthdays, maternity and newborn shoots, engagements and weddings.",
  },
];

export const HOME_FAQS = [
  {
    q: "What services can I book on HORA?",
    a: "Balloon and flower decoration, party venues, a chef for your party at home, live catering, party food delivery, photography and videography, plus free digital invitations for your guests.",
  },
  {
    q: "Which cities does HORA serve?",
    a: "Delhi, Gurugram, Noida, Ghaziabad, Faridabad, Bangalore, Hyderabad and Mumbai, with a local team in each city.",
  },
  {
    q: "How much does balloon decoration at home cost?",
    a: "Simple setups start at Rs 1,499. Themed and premium setups cost more depending on the balloons, lights and add-ons you choose. The price you see when you book is the price you pay.",
  },
  {
    q: "Can I book a decoration for the same day?",
    a: "Yes, same-day decoration is available in most areas, subject to slot availability. Booking early in the day gives you the best chance of a slot.",
  },
  {
    q: "Can I plan everything for one party in one place?",
    a: "Yes. You can book the decoration, venue, food and photographer for the same event on HORA, and our team on WhatsApp helps you plan the rest.",
  },
];

export default function HomeSeoContent() {
  return (
    <section className="home-seo" aria-labelledby="home-seo-title">
      <h2 id="home-seo-title">Plan your whole party with HORA</h2>
      <p>
        HORA is a one-stop platform for birthdays, anniversaries, baby showers,
        housewarmings and every celebration in between. Choose a setup, a venue,
        a menu or a photographer, see the price upfront, and book online in a
        few minutes. Our verified decorators, chefs and photographers arrive on
        time, and our team is on WhatsApp if you need help planning.
      </p>

      <h3>What you can book</h3>
      <ul className="home-seo-services">
        {SERVICES.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>{s.name}</Link>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>

      <h3>Popular occasions</h3>
      <p>
        Most bookings are for{" "}
        <Link href="/balloon-decoration/birthday-decoration">birthday decoration</Link>,{" "}
        <Link href="/balloon-decoration/kids-birthday-decoration">kids birthday parties</Link>,{" "}
        <Link href="/balloon-decoration/anniversary-decoration">anniversary surprises</Link>,{" "}
        <Link href="/balloon-decoration/baby-shower-decoration">baby showers</Link> and{" "}
        <Link href="/balloon-decoration/welcome-baby-decoration">welcome baby</Link>{" "}
        setups. You can also create a free digital invitation, share it on
        WhatsApp and track who is coming.
      </p>

      <h3>Party services in your city</h3>
      <ul className="home-seo-cities">
        {LIVE_CITIES.map((c) => (
          <li key={c.slug}>
            <Link href={`/${c.slug}`}>{`Party services in ${c.name}`}</Link>
          </li>
        ))}
      </ul>

      <h3>Frequently asked questions</h3>
      <div className="home-seo-faq">
        {HOME_FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
