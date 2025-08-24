import { useState } from 'react';
import { useGetLogsQuery } from '../api/erpApi';

function LogsDashboard() {
  const [filters, setFilters] = useState({
    entity_type: '',
    actor: '',
    start: '',
    end: '',
  });
  const { data = [] } = useGetLogsQuery(filters);
  const logs = Array.isArray(data.results) ? data.results : data;

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Event Logs</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          name="entity_type"
          placeholder="Entity Type"
          value={filters.entity_type}
          onChange={handleChange}
          className="border p-1"
        />
        <input
          type="text"
          name="actor"
          placeholder="Actor ID"
          value={filters.actor}
          onChange={handleChange}
          className="border p-1"
        />
        <input
          type="date"
          name="start"
          value={filters.start}
          onChange={handleChange}
          className="border p-1"
        />
        <input
          type="date"
          name="end"
          value={filters.end}
          onChange={handleChange}
          className="border p-1"
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Actor</th>
            <th className="text-left">Entity</th>
            <th className="text-left">Action</th>
            <th className="text-left">Reason</th>
            <th className="text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-keyline">
              <td>{log.actor || '-'}</td>
              <td>{log.entity_type}</td>
              <td>{log.action}</td>
              <td>{log.reason || '-'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogsDashboard;
