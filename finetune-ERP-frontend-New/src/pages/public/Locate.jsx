import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/common/Loader';
import END_POINTS from '@/utils/Endpoints';

export default function Locate() {
  const [hqs, setHqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    const fetchHqs = async () => {
      try {
        const res = await axios.get(
          `${END_POINTS.API_BASE_URL}${END_POINTS.GET_STORES}?store_type=HQ`
        );
        setHqs(res.data?.content || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHqs();
  }, []);

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
          <p className="text-gray-700 mt-4">Find our head offices below.</p>
        </section>

        {loading && (
          <div className="text-center">
            <Loader />
          </div>
        )}

        {error && (
          <p className="text-center text-red-600">Failed to load locations.</p>
        )}

        {!loading && !error && (
          <section className="max-w-5xl mx-auto space-y-8">
            {hqs.map((hq) => (
              <address key={hq.id} className="not-italic">
                <h3 className="text-xl font-bold text-keyline">
                  {hq.store_name}
                </h3>
                <p className="text-gray-700">
                  {hq.address}
                  {hq.phone && (
                    <>
                      <br />
                      {hq.phone}
                    </>
                  )}
                </p>
              </address>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
