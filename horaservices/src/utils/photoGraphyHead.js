import Head from "next/head";

export function SeoMain({ city, scriptTag }) {
  return (
    <Head>
      <title>
        {city
         ? `HORA Photography in ${city} | Professional Event Photography – Birthdays, Weddings & More – Starting at ₹3500`
              : 'HORA Photography : Professional photography for all events - Birthdays, Parties, & Weddings – Starting at ₹3500'}
      </title>

      <meta
        name="description"
        content={
          city
            ? `📸 Capture Every Moment in ${city}! ✨ Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉 in ${city}, our professional photographers are here to make your moments look as magical as they felt.`
            : `📸 Capture Every Moment, Forever! ✨ Welcome to HORA Photography — where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt. Specialized packages for Weddings, Maternity, Baby, Birthday, Newborn, Couples, Anniversaries, Corporate Events & More.`
        }
      />

      <MetaCommon scriptTag={scriptTag} />
    </Head>
  );
}


export function SeoCategory({ city, catValue, scriptTag }) {
  return (
    <Head>
      <title>
        {city
          ?`HORA Photography ${city} ${catValue} by Professionals Photographer, Starting at ₹3500`
            : `HORA Photography ${catValue} by Professionals Photographer, Starting at ₹3500`}
      </title>

      <meta
        name="description"
        content={
          city
            ? `📸 Capture Every Moment, Forever! ✨ Welcome to HORA ${city} ${catValue} — where every click tells your story! 😊 Weddings, Baby Shoots, Birthdays, and more — our professional photographers make your memories magical.`
            : `📸 Capture Every Moment, Forever! ✨ Welcome to HORA ${catValue} — where every click tells your story! 😊 Weddings, Baby Shoots, Birthdays, and more — our professional photographers make your memories magical.`
        }
      />

      <MetaCommon scriptTag={scriptTag} />
    </Head>
  );
}


export function SeoWork({ city, work, scriptTag }) {
  return (
    <Head>
      <title>
        {city
         ? `HORA Photography ${city} ${work.name} by Professionals Photographer, Starting at ₹3500`
            : `HORA Photography ${work.name} by Professionals Photographer, Starting at ₹3500`}
      </title>

      <meta
        name="description"
        content={
          city
            ? `📸 Capture Every Moment, Forever! ✨ Welcome to HORA ${city} ${work?.name} — where every click tells your story! 😊 Weddings, Baby Shoots, Birthdays, and more — our professional photographers make your memories magical.`
            : `📸 Capture Every Moment, Forever! ✨ Welcome to HORA ${work?.name} — where every click tells your story! 😊 Weddings, Baby Shoots, Birthdays, and more — our professional photographers make your memories magical.`
        }
      />

      <MetaCommon scriptTag={scriptTag} />
    </Head>
  );
}

function MetaCommon({ scriptTag }) {
  const keywords = `couple photoshoot, romantic photoshoot for couples, pre wedding photoshoot, pre wedding photography, couple pre wedding photography, candid pre wedding shoot, pre bridal photography, pre wedding shoot price, pre wedding shoot in bangalore, 
    couples photography, maternity photoshoot, maternity photoshoot near me, maternity photo sessions, maternity photoshoot in bangalore, maternity couple photoshoot, mother to be photoshoot, maternity shoot near me, pregnancy photoshoot near me, 
    pregnancy photo shoot, photography in pregnancy, pregnant women photoshoot, motherhood photoshoot, pregnant ladies photoshoot, couple pregnancy photoshoot, seemantham photoshoot, pregnancy photoshoot in bangalore, newborn photography, infant photography,
     baby photography near me, newborn photography near me, newborn photoshoot, infant photographers near me, newborn portraits near me, newborn family photoshoot, family photography with newborn, cake smash photoshoot, first birthday cake smash photoshoot, 
     engagement photo shoot, engagement photoshoot, engagement couple photography, engagement photography, wedding photographer, wedding photographer near me, wedding photoshoot, photographer wedding, candid wedding photography, marriage photoshoot, post wedding photoshoot, 
     bridal photoshoot, traditional photography, wedding photographers in bangalore, marriage photographers in bangalore, birthday photoshoot, first birthday photoshoot, pre birthday photoshoot, birthday celebration photoshoot, birthday photo session, 18th photoshoot, 
     birthday party photographer, event photography, photoshoot for wedding anniversary, anniversary photoshoot, candid photography, cinematic photography, fashion photography, model photography, black and white photography, landscape photography, portrait photography, 
     photographers near me, professional photographer near me, professional photographer, freelance photographer, best photographers near me, photoshoot near me, photographer in bangalore, photography in bangalore, bangalore photoshoot, photography services"
          `;

  return (
    <>
      <meta name="keywords" content={keywords} />
      <meta
        property="og:title"
        content="HORA Photography : Professional photography for all events"
      />
      <meta
        property="og:description"
        content="Professional event photography for weddings, birthdays, baby showers, and more. Book today for stunning, affordable memories — starting at just ₹3500!"
      />
      <meta
        property="og:image"
        content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
      />
      <meta
        property="og:url"
        content="https://horaservices.com/photography"
      />
      <meta property="og:type" content="website" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Hora Services" />
      <link
        rel="icon"
        href="https://horaservices.com/api/uploads/logo-icon.png"
        type="image/x-icon"
      />
      {scriptTag && (
        <script type="application/ld+json">{scriptTag}</script>
      )}
    </>
  );
}
