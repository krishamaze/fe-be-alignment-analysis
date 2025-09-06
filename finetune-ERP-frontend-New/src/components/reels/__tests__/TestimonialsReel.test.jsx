// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TestimonialsReel from '../TestimonialsReel';

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));
vi.mock('swiper/modules', () => ({
  Navigation: {},
  Autoplay: {},
  Keyboard: {},
}));

describe('TestimonialsReel', () => {
  it('renders testimonials content', () => {
    render(<TestimonialsReel />);

    expect(screen.getAllByText('What Our Customers Say')[0]).toBeTruthy();
    [
      'Sachin Ramg',
      'Rathikamns Ganesha',
      'Shamili Krishnaraj',
      'Sahan Farooqui',
    ].forEach((name) => {
      expect(screen.getAllByText(name)[0]).toBeTruthy();
    });

    const links = screen.getAllByText('Read All Reviews on Google →');
    expect(links[0].getAttribute('href')).toBe(
      'https://www.google.com/search?q=finetune+mobile+reviews'
    );
  });
});
