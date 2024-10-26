import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const images = [
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGFydCUyMGltYWdlfGVufDB8fHx8MTYwMTQ4Mjg4Mw&ixlib=rb-1.2.1&q=80&w=800',
    'https://plus.unsplash.com/premium_photo-1669725687221-6fe12c2da6b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YW5pbWFsc3xlbnwwfHwwfHx8MA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1663937576065-706a8d985379?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFydHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFydHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YW5pbWFsc3xlbnwwfHwwfHx8MA%3D%3D',
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
    <div className="bg-cream min-h-screen flex flex-col">
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
          .footer {
            background-color: #008080; /* Teal */
            color: white;
            text-align: center; /* Center text */
            padding: 1rem 0;
            margin-top: auto; /* Pushes footer to the bottom */
          }
          .footer a {
            color: white; /* White text for links */
            text-decoration: underline; /* Underline for links */
          }
           
        `}
      </style>

      <div className="p-4 flex-grow">
        <h2 className="text-3xl font-bold text-teal mb-4 ">
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

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AI Image. All rights reserved.</p>
        <p>
        <Link to="/terms">Terms of Service</Link> | 
        <Link to="/privacy"> Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;