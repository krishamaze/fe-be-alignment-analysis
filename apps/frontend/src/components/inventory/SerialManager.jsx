import React from 'react';
import { useGetSerialsQuery } from '../../api/erpApi';
import SerialTable from './SerialTable';

export default function SerialManager() {
  const { data } = useGetSerialsQuery();
  return <SerialTable serials={data ?? []} />;
}
