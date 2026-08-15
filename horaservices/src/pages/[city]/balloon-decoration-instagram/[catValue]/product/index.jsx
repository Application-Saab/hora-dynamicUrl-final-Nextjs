import { useRouter } from "next/router";
import DecorationCatDetails from "@/pages/balloon-decoration/[catValue]/product/[productName]";

export default function BalloonDecorationInstagramProduct() {
  const router = useRouter();
  const { city, catValue, productName } = router.query || {};

  if (!router.isReady) return null;

  return (
    <div>
      <DecorationCatDetails
        city={city}
        catValue={catValue}
        productName={productName}
      />
    </div>
  );
}