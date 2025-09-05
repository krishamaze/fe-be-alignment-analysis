import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CustomerTestimonials from '../CustomerTestimonials';

describe('CustomerTestimonials', () => {
  it('renders testimonials and external reviews link', () => {
    render(<CustomerTestimonials />);

    expect(screen.getByText('What Our Customers Say')).toBeTruthy();
    expect(screen.getByText('Sachin Ramg')).toBeTruthy();
    expect(screen.getByText('Rathikamns Ganesha')).toBeTruthy();
    expect(screen.getByText('Shamili Krishnaraj')).toBeTruthy();
    expect(screen.getByText('Sahan Farooqui')).toBeTruthy();
    const link = screen.getByRole('link', {
      name: /Read All Reviews on Google/i,
    });
    expect(link.getAttribute('href')).toBe(
      'https://www.google.com/search?q=finetune+mobile+reviews'
    );
  });
});
