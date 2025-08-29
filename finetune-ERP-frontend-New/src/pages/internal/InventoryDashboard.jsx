import React from 'react';
import { useGetStockLedgersQuery } from '../../api/erpApi';
import StockTable from '../../components/inventory/StockTable';
import StockEntryForm from '../../components/inventory/StockEntryForm';
import SerialManager from '../../components/inventory/SerialManager';
import PriceLogView from '../../components/inventory/PriceLogView';
import ConfigDashboard from '../../components/inventory/ConfigDashboard';

export default function InventoryDashboard() {
  const { data } = useGetStockLedgersQuery();
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Inventory Dashboard</h1>
      <StockEntryForm />
      <StockTable ledgers={data ?? []} />
      <SerialManager />
      <PriceLogView />
      <ConfigDashboard />
    </div>
  );
}
