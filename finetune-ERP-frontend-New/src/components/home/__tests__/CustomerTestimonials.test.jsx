import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CustomerTestimonials from '../CustomerTestimonials';

describe('CustomerTestimonials', () => {
  it('renders testimonials and external reviews link', () => {
    render(<CustomerTestimonials />);

    expect(screen.getByText('What Our Customers Say')).toBeTruthy();
    [
      'Sachin Ramg',
      'Rathikamns Ganesha',
      'Shamili Krishnaraj',
      'Sahan Farooqui',
    ].forEach((name) => {
      expect(screen.getAllByText(name)[0]).toBeTruthy();
    });
    const link = screen.getByRole('link', {
      name: /Read All Reviews on Google/i,
    });
    expect(link.getAttribute('href')).toBe(
      'https://www.google.com/search?q=finetune+mobile+reviews'
    );
  });
});
