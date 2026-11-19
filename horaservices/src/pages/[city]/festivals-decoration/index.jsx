import FestivalsDecorationLanding from "@/pages/festivals-decoration";

export default function Page({ city }) {
  return <FestivalsDecorationLanding city={city} />;
}

export async function getServerSideProps({ params }) {
  return { props: { city: params.city } };
}