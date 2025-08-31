import { Link } from 'react-router-dom';
import { useGetDepartmentsQuery } from '../../api/erpApi';

export const metadata = {
  title: 'Departments',
  description: 'Browse departments',
};

function DepartmentsPage() {
  const { data } = useGetDepartmentsQuery();
  const departments = data?.content ?? [];
  return (
    <div className="pt-safe-header max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {departments.map((d) => (
          <Link
            key={d.id}
            to={`/departments/${d.slug}/categories`}
            className="p-4 bg-white rounded shadow text-center"
          >
            {d.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DepartmentsPage;
