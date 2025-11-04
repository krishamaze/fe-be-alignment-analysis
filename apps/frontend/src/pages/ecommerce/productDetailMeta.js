export let metadata = {};

export function buildProductMetadata(product) {
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

  metadata = {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical: product.url },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: product.url,
      images: [product.image || ''],
    },
    jsonLd,
  };

  return metadata;
}
