import React from 'react';
import StockEntryForm from './StockEntryForm';

export default function SaleEntryForm({ bookingId }) {
  return <StockEntryForm defaultType="sale" bookingId={bookingId} />;
}
