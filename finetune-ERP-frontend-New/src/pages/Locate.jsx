import { useEffect } from 'react';

export default function Locate() {
  useEffect(() => {
    const desc = 'Find our service branches and directions.';
    document.title = 'Locate – Finetune';
    let tag = document.head.querySelector("meta[name='description']");
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', desc);
  }, []);

  const mapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.048636922242!2d76.90755181460692!3d10.883905392248625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85cac2b10ccf9%3A0x13cfec71425cc8a3!2sFineTune!5e0!3m2!1sen!2sin!4v1642964889913!5m2!1sen!2sin';

  return (
    <>
      <title>Locate – Finetune</title>
      <meta
        name="description"
        content="Find our service branches and directions."
      />
      <meta property="og:title" content="Locate – Finetune" />
      <meta
        property="og:description"
        content="Find our service branches and directions."
      />
      <div className="p-4 pt-24 space-y-16">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold">Locate us</h1>
          <p className="text-gray-700 mt-4">
            Currently we are located at two locations in south India. Refer
            below for the location and the Google maps.
          </p>
        </section>
        <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <iframe
            className="w-full h-64 border-0"
            src={mapSrc}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <address className="not-italic space-y-1">
            <h3 className="text-xl font-bold text-keyline">Coimbatore</h3>
            <p>
              Cheran Plaza K.G Chavadi Road,
              <br />
              Ettimadai, Pirivu,
              <br />
              near KK MAHAAL,
              <br />
              Coimbatore,
              <br />
              Tamil Nadu 641105.
            </p>
          </address>
        </section>
        <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <address className="not-italic space-y-1">
            <h3 className="text-xl font-bold text-keyline">Kerala</h3>
            <p>
              Cheran Plaza K.G Chavadi Road,
              <br />
              Ettimadai, Pirivu,
              <br />
              near KK MAHAAL,
              <br />
              Coimbatore,
              <br />
              Tamil Nadu 641105.
            </p>
          </address>
          <iframe
            className="w-full h-64 border-0"
            src={mapSrc}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </section>
      </div>
    </>
  );
}
