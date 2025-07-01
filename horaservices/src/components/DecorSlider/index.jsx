import Image from "next/image";
import Link from "next/link";

const DecorSlider = ({
  title,
  viewAllLink,
  data,
  showDiscount = false,
  discountAmount = 0,
  imageSize = { width: 120, height: 120 },
}) => {
  return (
    <section className="premium-slide-decor">
      <div className="premium-slide-decor-header">
        <h2>{title}</h2>
        <Link href={viewAllLink}>View All</Link>
      </div>

      <div className="premium-scroll-wrapper">
        {data.map((item, index) => {
          const numericPrice = parseInt(item.price.replace("₹", "")) || 0;
          const originalPrice = numericPrice + discountAmount;

          return (
            <Link href={item.link} key={index} className="premium-card">
              <div className="premium-img-wrapper">
                <Image
                  src={item.Image}
                  alt={item.title}
                  width={imageSize.width}
                  height={imageSize.height}
                  className="premium-img"
                />
                {showDiscount && (
                  <div className="premium-discount">₹{discountAmount} off</div>
                )}
              </div>
              <div className="premium-content">
                <p className="premium-title">{item.title}</p>
                <div className="premium-price-wrapper">
                  <span className="premium-price">{item.price}</span>
                  {showDiscount && (
                    <span className="premium-original">₹{originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DecorSlider;
