import { Link, useParams } from 'react-router-dom';
import {
  useGetDepartmentsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from '../../api/erpApi';

export const metadata = {
  title: 'Categories',
  description: 'Browse categories',
};

function DepartmentCategoriesPage() {
  const { deptSlug } = useParams();
  const { data: deptData } = useGetDepartmentsQuery();
  const department = deptData?.content.find((d) => d.slug === deptSlug);
  const { data: catData } = useGetCategoriesQuery({ department: deptSlug });
  const categories = catData?.content ?? [];
  const { data: subData } = useGetSubCategoriesQuery({});
  const subs = subData?.content ?? [];

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">
        {department ? department.name : ''}
      </h1>
      {categories.map((cat) => (
        <div key={cat.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {subs
              .filter((s) => s.category.slug === cat.slug)
              .map((s) => (
                <li key={s.id} className="p-4 bg-white rounded shadow">
                  <Link
                    to={`/departments/${deptSlug}/${cat.slug}/${s.slug}/products`}
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default DepartmentCategoriesPage;
