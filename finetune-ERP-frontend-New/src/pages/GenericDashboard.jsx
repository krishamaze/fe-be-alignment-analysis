import React from 'react';
import CardItem from '../components/dashboard/components/CardItem';

function Section({ label, items, disabled = false }) {
  if (!items.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-gray-600">{label} ({items.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((f, i) => (
          <CardItem key={i} title={f.title} icon={f.icon} disabled={disabled} to={f.to} />
        ))}
      </div>
    </section>
  );
}

function GenericDashboard({ title, features }) {
  const live = features.filter((f) => f.status === 'live');
  const upcoming = features.filter((f) => f.status !== 'live');
  return (
    <div className="px-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <Section label="Live" items={live} />
      <Section label="Upcoming" items={upcoming} disabled />
    </div>
  );
}

export default GenericDashboard;
