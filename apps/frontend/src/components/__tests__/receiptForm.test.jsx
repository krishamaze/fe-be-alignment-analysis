// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import ReceiptForm from '../ReceiptForm';

const payMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
vi.mock('../../api/erpApi', () => ({
  useCreatePaymentMutation: () => [payMock],
}));

test('submits payment', () => {
  render(<ReceiptForm invoiceId={1} />);
  fireEvent.change(screen.getByPlaceholderText('Amount'), {
    target: { value: '50' },
  });
  fireEvent.click(screen.getByText('Record Payment'));
  expect(payMock).toHaveBeenCalled();
});
