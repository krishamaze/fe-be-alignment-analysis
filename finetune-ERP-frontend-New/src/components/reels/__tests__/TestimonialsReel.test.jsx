// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TestimonialsReel from '../TestimonialsReel';

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
  });
});
