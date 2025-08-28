import React from 'react';
import { useGetPriceLogsQuery } from '../../api/erpApi';

export default function PriceLogView() {
  const { data } = useGetPriceLogsQuery();
  return (
    <ul className="text-sm list-disc pl-4">
      {(data ?? []).map((log) => (
        <li key={log.id}>
          {log.product_variant}: {log.old_price} → {log.new_price}
        </li>
      ))}
    </ul>
  );
}
