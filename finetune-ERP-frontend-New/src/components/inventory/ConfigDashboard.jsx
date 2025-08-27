import React from 'react';
import {
  useGetInventoryConfigQuery,
  useUpdateInventoryConfigMutation,
} from '../../api/erpApi';

export default function ConfigDashboard() {
  const { data } = useGetInventoryConfigQuery();
  const [updateConfig] = useUpdateInventoryConfigMutation();

  if (!data) return null;

  return (
    <div className="space-y-2">
      {data.map((cfg) => (
        <div key={cfg.id} className="flex items-center space-x-2">
          <span className="flex-1">{cfg.category}</span>
          <button
            type="button"
            className="px-2 py-1 bg-gray-200"
            onClick={() =>
              updateConfig({ id: cfg.id, track_serials: !cfg.track_serials })
            }
          >
            {cfg.track_serials ? 'Serials On' : 'Serials Off'}
          </button>
        </div>
      ))}
    </div>
  );
}
