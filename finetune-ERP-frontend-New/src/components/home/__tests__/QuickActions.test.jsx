import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import QuickActions from '../QuickActions';

describe('QuickActions', () => {
  it('renders three repair cards with links', () => {
    render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>
    );

    expect(screen.getByText('Screen Repair')).toBeTruthy();
    expect(screen.getAllByText(/Book Now/i).length).toBe(3);
    const firstLink = screen.getAllByRole('link', { name: /Book Now/i })[0];
    expect(firstLink.getAttribute('href')).toBe('/repair?service=screen');
  });
});
