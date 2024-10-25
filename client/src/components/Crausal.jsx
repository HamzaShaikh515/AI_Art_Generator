import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // or 'swiper/swiper.min.css'
import { Navigation, Pagination } from 'swiper'; // Import modules directly from Swiper
import 'swiper/css/navigation'; // Import Navigation styles
import 'swiper/css/pagination'; // Import Pagination styles
import Card from './Card'; // Adjust path as needed


const CommunityCarousel = ({ posts, onLike, onDislike }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]} // Use the modules here
      spaceBetween={30} // Space between slides
      slidesPerView={1} // Show one slide at a time
      navigation // Enable navigation buttons
      pagination={{ clickable: true }} // Enable pagination
      className="mySwiper" // Add custom classes if needed
    >
      {posts.map((post, index) => (
        <SwiperSlide key={index}>
          <Card post={post} onLike={() => onLike(post.id)} onDislike={() => onDislike(post.id)} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CommunityCarousel;
