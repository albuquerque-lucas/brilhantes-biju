import { useState, useEffect } from 'react';
import styles from '../../styles/Banner.module.scss';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface BannerProps {
  slides: BannerSlide[];
  autoPlay?: boolean;
  interval?: number;
}

const Banner = ({ slides, autoPlay = true, interval = 5000 }: BannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Função para ir para o próximo slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Função para ir para o slide anterior
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Função para ir para um slide específico
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Configurar autoplay
  useEffect(() => {
    if (!autoPlay) return;

    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [autoPlay, interval]);

  if (!slides.length) return null;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerSlider}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.bannerSlide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.bannerContent}>
              <h2 className={styles.bannerTitle}>{slide.title}</h2>
              <p className={styles.bannerSubtitle}>{slide.subtitle}</p>
              <a href={slide.buttonLink} className={styles.bannerButton}>
                {slide.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`${styles.bannerControl} ${styles.prevControl}`}
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        &lt;
      </button>
      <button
        className={`${styles.bannerControl} ${styles.nextControl}`}
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        &gt;
      </button>

      <div className={styles.bannerDots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.bannerDot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
