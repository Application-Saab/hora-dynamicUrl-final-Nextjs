import FlowerDecorationLanding from "@/pages/flower-decoration";

export default function Page({ city }) {
  return <FlowerDecorationLanding city={city} />;
}

export async function getServerSideProps({ params }) {
  return { props: { city: params.city } };
}