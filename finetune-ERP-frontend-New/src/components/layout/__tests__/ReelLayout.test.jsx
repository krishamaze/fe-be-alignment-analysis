// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import ReelLayout from '@/components/layout/ReelLayout';
import {
  ScrollModeProvider,
  useScrollMode,
} from '@/components/layout/ScrollModeContext';

let swiperProps = {};
vi.mock('swiper/react', () => ({
  Swiper: (props) => {
    swiperProps = props;
    return <div>{props.children}</div>;
  },
  SwiperSlide: ({ children }) => <div>{children}</div>,
}));
vi.mock('swiper/modules', () => ({
  Navigation: {},
  Autoplay: {},
  Keyboard: {},
}));

beforeEach(() => {
  swiperProps = {};
});

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

test('ReelLayout disables autoplay when single slide', () => {
  const Wrapper = ({ children }) => (
    <ScrollModeProvider>{children}</ScrollModeProvider>
  );

  render(
    <Wrapper>
      <ReelLayout autoplay>
        <div>one</div>
      </ReelLayout>
    </Wrapper>
  );
  expect(swiperProps.autoplay).toBe(false);

  render(
    <Wrapper>
      <ReelLayout autoplay>
        <div>one</div>
        <div>two</div>
      </ReelLayout>
    </Wrapper>
  );
  expect(swiperProps.autoplay).toEqual({ delay: 5000 });
});
