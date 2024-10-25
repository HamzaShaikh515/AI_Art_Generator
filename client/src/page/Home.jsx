import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const images = [
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGFydCUyMGltYWdlfGVufDB8fHx8MTYwMTQ4Mjg4Mw&ixlib=rb-1.2.1&q=80&w=800',
    'https://images.unsplash.com/photo-1567435073222-8e046e5c2c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDIyfHxwYWludGVyYXNoJTIwaW1hZ2V8ZW58MHx8fHwxNjAxNDgyOTI5&ixlib=rb-1.2.1&q=80&w=800',
    'https://images.unsplash.com/photo-1548361347-4e9d0b5ec24c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDMyfHxwYWludGVyYXNoJTIwaW1hZ2V8ZW58MHx8fHwxNjAxNDgyOTMw&ixlib=rb-1.2.1&q=80&w=800',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE3fHxwYWludGVyYXNoJTIwaW1hZ2V8ZW58MHx8fHwxNjAxNDgyOTM5&ixlib=rb-1.2.1&q=80&w=800',
    'https://images.unsplash.com/photo-1530522108461-b31e66b5c728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE2fHxwYWludGVyYXNoJTIwaW1hZ2V8ZW58MHx8fHwxNjAxNDgyOTQy&ixlib=rb-1.2.1&q=80&w=800',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,          // Enable autoplay
    autoplaySpeed: 3000,    // Change image every 3 seconds
  };

  return (
    <div className="bg-cream min-h-screen">
      <style>
        {`
          .bg-cream {
            background-color: #FFFDD0; /* Cream */
          }
          .text-teal {
            color: #008080; /* Teal */
          }
          .slider-image {
            width: 60%; /* Reduced width */
            height: 350px; /* Increased height */
            object-fit: cover; /* Ensure images cover the specified dimensions */
            margin: 0 auto; /* Center the image */
          }
        `}
      </style>

      <div className="p-4">
        <h2 className="text-3xl font-bold text-teal">
          Welcome to the world of Art
        </h2>
        <Slider {...settings} className="mt-4">
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Artistic Image ${index + 1}`}
                className="slider-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400'; }} // Fallback for broken images
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomePage;
