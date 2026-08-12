// 'use client';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// // const BannerSlider = ({ images = [] }) => {
//   return (
//     <div className="banner-slider-container">
     
//       <Swiper
//         modules={[Pagination, Autoplay]}
//         pagination={{ clickable: true }}
//         autoplay={true}
//         loop={true}
//       >
//         {images.map((img, index) => (
//           <SwiperSlide key={index}>
//             <Image
//               src={img}
//               alt={`Banner ${index + 1}`}
//               width={1500}
//               loading="eager"
//               className="banner-image"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//       </div>

//   );
// };

// export default BannerSlider;

'use client';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';

 
const BannerSlider = ({ images = [], showSeeMore = false }) => {
   const router = useRouter();
    const handleSeeMoreClick = () => {
    router.push('/balloon-decoration');
  };
  return (
    <div className="banner-slider-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={true}
        loop={true}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="banner-slide-wrapper">
              <Image
                src={img}
                alt={`Banner ${index + 1}`}
                width={1500}
                height={500}
                loading="eager"
                className="banner-image"
              />
              {index === 0 && showSeeMore && (
                <button className="see-button"  onClick={handleSeeMoreClick}>EXPLORE MORE</button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
