import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useGetDepartmentsQuery } from '../../api/erpApi';

function DepartmentsPage() {
  const { data } = useGetDepartmentsQuery();
  const departments = data?.content ?? [];
  return (
    <div className="pt-20 max-w-7xl mx-auto px-4">
      <Helmet>
        <title>Departments</title>
        <meta name="description" content="Browse departments" />
      </Helmet>
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
