import Decoration from "@/components/Decoration/Decoration";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function BalloonDecorationPage() {
  return <Decoration />;
}
