import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useStore } from '../context/StoreContext';
import CarouselAdminPanel from './CarouselAdminPanel';

const Carousel = () => {
  const { carouselSlides, user } = useStore(); // <-- importa user
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="w-full min-w-0 relative">
      {/* Botón solo para admin */}
      {user && user.role === 'admin' && (
        <button
          onClick={() => setShowAdmin(true)}
          className="absolute top-2 right-2 z-40 bg-blue-600 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded shadow-md"
          style={{ fontWeight: 'bold' }}
        >
          Editar imágenes
        </button>
      )}
      {/* El Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        breakpoints={{
          0:    { slidesPerView: 1 },
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="rounded-2xl shadow-xl"
        style={{ minWidth: 0 }}
      >
        {carouselSlides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.imageUrl}
              alt={slide.title || `Imagen ${i + 1}`}
              className="w-full h-40 md:h-48 object-cover rounded-xl select-none pointer-events-none"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Modal solo para admin */}
      {user && user.role === 'admin' && showAdmin && (
        <CarouselAdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
};

export default Carousel;
