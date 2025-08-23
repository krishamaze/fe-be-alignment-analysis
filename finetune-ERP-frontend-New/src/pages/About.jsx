import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    const desc = 'Where we started and our mission to finetune every device.';
    document.title = 'About – Finetune';
    let tag = document.head.querySelector("meta[name='description']");
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', desc);
  }, []);

  return (
    <div className="p-4 pt-24 space-y-16">
      <Helmet>
        <title>About – Finetune</title>
        <meta
          name="description"
          content="Where we started and our mission to finetune every device."
        />
        <meta property="og:title" content="About – Finetune" />
        <meta
          property="og:description"
          content="Where we started and our mission to finetune every device."
        />
      </Helmet>
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">We always do Finetune</h1>
        <p className="text-keyline text-xl font-bold">About us</p>
        <p className="text-gray-700">
          We started a decade ago with a motto to simplify handset service with
          high quality in minimal time, satisfying our precious customers.
        </p>
      </section>
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p>
            We are selling multi branded mobiles, accessories, computer
            accessories with best quality.
          </p>
          <address className="not-italic">
            Cheran Plaza K.G Chavadi Road, Ettimadai, Pirivu, near KK MAHAAL,
            Coimbatore, Tamil Nadu 641105.
          </address>
          <p>
            We pledge to take the best quality service to every individual.
          </p>
          <p className="mt-4 font-semibold text-center text-keyline">
            Book your service from anywhere and anytime.
          </p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p>
            We are professionals working with a passion as a team. We take every
            service as our challenge and complete it with utmost care. The
            digital platform we are entering expands our service.
          </p>
        </div>
      </section>
    </div>
  );
}
