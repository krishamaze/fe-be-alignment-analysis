import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import QuickActionsReel from '../QuickActionsReel';

describe('QuickActionsReel', () => {
  it('renders header, three repair cards and CTA link', () => {
    render(
      <MemoryRouter>
        <QuickActionsReel />
      </MemoryRouter>
    );

    expect(screen.getByText('Most Popular Repairs')).toBeTruthy();
    expect(screen.getAllByText(/Book Now/i).length).toBe(3);
    const firstLink = screen.getAllByRole('link', { name: /Book Now/i })[0];
    expect(firstLink.getAttribute('href')).toBe('/repair?service=screen');
    const ctaLink = screen.getByRole('link', {
      name: /View all repair services/i,
    });
    expect(ctaLink.getAttribute('href')).toBe('/repair');
  });
});
