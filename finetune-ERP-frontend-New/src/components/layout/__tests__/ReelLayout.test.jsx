// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import ReelLayout from '@/components/layout/ReelLayout';
import {
  ScrollModeProvider,
  useScrollMode,
} from '@/components/layout/ScrollModeContext';

vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));
vi.mock('swiper/modules', () => ({
  Navigation: {},
  Autoplay: {},
  Keyboard: {},
}));

function ModeReader() {
  const { mode } = useScrollMode();
  return <span data-testid="mode">{mode}</span>;
}

test('ReelLayout toggles scroll mode', () => {
  const Wrapper = ({ children }) => (
    <ScrollModeProvider>{children}</ScrollModeProvider>
  );
  const { rerender, getByTestId } = render(
    <Wrapper>
      <ReelLayout>
        <div>slide</div>
      </ReelLayout>
      <ModeReader />
    </Wrapper>
  );
  expect(getByTestId('mode').textContent).toBe('reel');
  rerender(
    <Wrapper>
      <ModeReader />
    </Wrapper>
  );
  expect(getByTestId('mode').textContent).toBe('scroll');
});
