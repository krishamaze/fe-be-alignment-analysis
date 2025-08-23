// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import Contact from '../Contact';
import ScheduleCall from '../ScheduleCall';
import Bookings from '../Bookings';
import END_POINTS from '../../utils/Endpoints';
import axios from 'axios';

vi.mock('axios');
vi.mock('react-hot-toast', () => { const toast = () => {}; toast.success = vi.fn(); toast.error = vi.fn(); return { default: toast }; });
vi.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: ({ onChange }) => {
    onChange('tok');
    return <div data-testid="recaptcha" />;
  },
}));
vi.mock('js-cookie', () => ({ default: { get: vi.fn(() => 'token') } }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.resetAllMocks();
});

describe('Contact form', () => {
  it('posts form data with captcha', async () => {
    axios.post.mockResolvedValue({});
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Contact />);
    });
    const name = container.querySelector('input[name="name"]');
    const mobile = container.querySelector('input[name="mobile_no"]');
    const message = container.querySelector('textarea[name="message"]');
    await act(async () => {
      name.value = 'A';
      name.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      mobile.value = '123';
      mobile.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      message.value = 'hi';
      message.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${END_POINTS.API_BASE_URL}/marketing/contact/`,
      expect.objectContaining({ captcha_token: 'tok' })
    );
  });
});

describe('ScheduleCall form', () => {
  it('posts form data with captcha', async () => {
    axios.post.mockResolvedValue({});
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<ScheduleCall />);
    });
    const name = container.querySelector('input[name="name"]');
    const date = container.querySelector('input[name="date"]');
    const time = container.querySelector('input[name="time"]');
    const message = container.querySelector('textarea[name="message"]');
    await act(async () => {
      name.value = 'A';
      name.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      date.value = '2024-01-01';
      date.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      time.value = '10:00';
      time.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      message.value = 'hi';
      message.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${END_POINTS.API_BASE_URL}/marketing/schedule-call/`,
      expect.objectContaining({ captcha_token: 'tok' })
    );
  });
});

describe('Bookings form', () => {
  it('posts form data with captcha', async () => {
    axios.post.mockResolvedValue({});
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Bookings />);
    });
    const name = container.querySelector('input[name="name"]');
    const email = container.querySelector('input[name="email"]');
    const date = container.querySelector('input[name="date"]');
    const time = container.querySelector('input[name="time"]');
    const issue = container.querySelector('select[name="issue"]');
    const message = container.querySelector('textarea[name="message"]');
    await act(async () => {
      name.value = 'A';
      name.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      email.value = 'a@b.com';
      email.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      date.value = '2024-01-01';
      date.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      time.value = '10:00';
      time.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      issue.value = 'Screen';
      issue.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      message.value = 'hi';
      message.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${END_POINTS.API_BASE_URL}/bookings`,
      expect.objectContaining({ captcha_token: 'tok' }),
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } })
    );
  });
});
