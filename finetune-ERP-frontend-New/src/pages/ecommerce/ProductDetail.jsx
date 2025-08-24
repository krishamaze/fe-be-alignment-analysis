import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  useGetProductBySlugQuery,
  useGetVariantsQuery,
} from '../../api/erpApi';

function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useGetProductBySlugQuery(slug);
  const { data: variantData } = useGetVariantsQuery({ product: slug });
  const variants = variantData?.content ?? [];

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  const metaTitle = `${product.name} - ${product.brand_name || product.brand}`;
  const metaDesc = `Buy ${product.name} from ${product.brand_name || product.brand}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand_name || product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    url: product.url,
  };

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={product.url} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={product.image || ''} />
        <meta property="og:url" content={product.url} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600">{product.brand_name || product.brand}</p>
      <p className="text-xl">
        ₹{product.price}
        {product.unit_name ? ` per ${product.unit_name}` : ''}
      </p>
      <p>{product.availability ? 'In stock' : 'Out of stock'}</p>
      {variants.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Variants</h2>
          <ul className="list-disc ml-5">
            {variants.map((v) => (
              <li key={v.id}>
                {`${v.variant_name} - ₹${v.price}${v.unit_name ? ` per ${v.unit_name}` : ''}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
