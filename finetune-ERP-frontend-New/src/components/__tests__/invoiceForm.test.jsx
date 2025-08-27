// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import InvoiceForm from '../InvoiceForm';

const createMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
vi.mock('../../api/erpApi', () => ({
  useCreateInvoiceMutation: () => [createMock],
}));

test('calculates total and submits', () => {
  render(<InvoiceForm bookingId={1} />);
  fireEvent.change(screen.getByPlaceholderText('Description'), {
    target: { value: 'Item' },
  });
  fireEvent.change(screen.getByPlaceholderText('HSN'), {
    target: { value: '1234' },
  });
  const numberInputs = screen.getAllByRole('spinbutton');
  fireEvent.change(numberInputs[1], { target: { value: '100' } });
  expect(screen.getByText('Total: 118.00')).toBeTruthy();
  fireEvent.click(screen.getByText('Save Invoice'));
  expect(createMock).toHaveBeenCalled();
});
