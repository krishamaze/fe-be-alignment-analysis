import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  useGetProductsQuery,
  useGetSubCategoriesQuery,
} from '../../api/erpApi';

function CategoryPage() {
  const { catSlug, subcatSlug } = useParams();
  const { data: subData } = useGetSubCategoriesQuery({ category: catSlug });
  const sub = subData?.content.find((s) => s.slug === subcatSlug);
  const { data: prodData } = useGetProductsQuery({ subcategory: subcatSlug });
  const products = prodData?.content ?? [];

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4">
      <Helmet>
        <title>{sub ? sub.name : 'Products'}</title>
        <meta
          name="description"
          content={sub ? `Products in ${sub.name}` : 'Products'}
        />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">{sub ? sub.name : ''}</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <li key={p.id} className="p-4 bg-white rounded shadow">
            <Link to={`/product/${p.slug}`} className="block font-medium">
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryPage;
