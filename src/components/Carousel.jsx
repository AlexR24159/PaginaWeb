import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
import { useStore } from '../context/StoreContext';

const Carousel = () => {
  const { getCarouselImages, addToCart, openProductPopup, getProductById } = useStore();
  const [toast, setToast] = useState(null);

  const slides = getCarouselImages();
  const swiperRef = useRef(null);

  useEffect(() => {
    swiperRef.current?.swiper?.update();
  }, [slides.length]);

  const openProduct = (productId) => {
    const product = getProductById(productId);
    if (product) {
      openProductPopup(product);
    }
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    const product = getProductById(productId);
    if (product) {
      addToCart(product);
      setToast('Producto añadido al carrito');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleKeyDown = (e, productId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProduct(productId);
    }
  };

  return (
    <div className="w-full min-w-0 relative">
      {/* El Carousel */}
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Navigation, Pagination, A11y]}
        loop={slides.length > 3}
        watchOverflow={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: false }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          768: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        className="rounded-2xl shadow-xl"
        style={{ minWidth: 0 }}
      >
        {slides.map((slide, i) => {
          const product = slide.productId ? getProductById(slide.productId) : null;
          const title = slide.title || product?.name || `Imagen ${i + 1}`;
          return (
            <SwiperSlide key={slide.id || i}>
              <div
                className="relative group cursor-pointer"
                onClick={slide.productId ? () => openProduct(slide.productId) : undefined}
                role={slide.productId ? 'button' : undefined}
                tabIndex={slide.productId ? 0 : -1}
                aria-label={slide.productId ? `Ver producto: ${title}` : undefined}
                onKeyDown={slide.productId ? (e) => handleKeyDown(e, slide.productId) : undefined}
              >
                <img
                  src={slide.imageUrl}
                  alt={title}
                  className="w-full h-40 md:h-48 object-cover rounded-xl select-none pointer-events-none"
                  draggable={false}
                />
                {slide.productId && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openProduct(slide.productId); }}
                      className="px-3 py-1 bg-white text-gray-800 rounded"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, slide.productId)}
                      className="px-4 py-1 bg-blue-600 text-white rounded-full"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Carousel;
