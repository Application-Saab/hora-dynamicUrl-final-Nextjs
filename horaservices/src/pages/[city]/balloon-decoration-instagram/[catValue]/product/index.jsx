import DecorationCatDetails from "@/pages/balloon-decoration/[catValue]/product/[productName]";

const BalloonDecorationInstagramProduct = ({ params }) => {
  const { city, catValue, productName } = params;

  return (
    <div>
      <DecorationCatDetails city={city} catValue={catValue} productName={productName} />
    </div>
  );
};

export default BalloonDecorationInstagramProduct;
