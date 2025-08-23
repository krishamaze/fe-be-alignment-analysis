import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    const desc = 'Agreement for repair and service terms.';
    document.title = 'Terms & Conditions – Finetune';
    let tag = document.head.querySelector("meta[name='description']");
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', desc);
  }, []);

  return (
    <div className="p-4 pt-24 max-w-3xl mx-auto space-y-4">
      <Helmet>
        <title>Terms &amp; Conditions – Finetune</title>
        <meta
          name="description"
          content="Agreement for repair and service terms."
        />
        <meta property="og:title" content="Terms &amp; Conditions – Finetune" />
        <meta
          property="og:description"
          content="Agreement for repair and service terms."
        />
      </Helmet>
      <h1 className="text-3xl font-bold text-center">Terms &amp; Conditions</h1>
      <h3 className="text-xl font-semibold">Agreement for Repair</h3>
      <p>
        1.1 The terms set out in these Conditions of Repair (“Agreement”) shall
        apply to the service (“Service”) we provide to repair your smartphone,
        tablet, computer and/or any accessories (“Device”).
      </p>
      <p>
        1.2 References to “us”, “we” and “our” refer to Finetune and references
        to “you” and “your” are to you, the person addressed on this form.
      </p>
      <p className="font-bold">All repairs (unless otherwise stated)</p>
      <p>
        2.1 This Agreement shall commence from the date you book a repair and
        shall continue until we have repaired or otherwise returned your Device.
      </p>
      <p>
        2.2 We shall make reasonable efforts to repair your Device subject to
        the availability of parts required and/or the terms of any relevant
        guarantee or warranty.
      </p>
      <p>
        2.3 We shall use Genuine, OEM or High Quality compatible parts for the
        repairs of all Devices.
      </p>
      <p>
        2.4 We may require the passcode of your Device in order to test it
        before and after the Service.
      </p>
      <p>
        2.5 Any time estimate for completion of the service is an estimate only
        and does not form any obligation under this Agreement.
      </p>
      <p>
        2.6 We shall notify you when the Device has been repaired. If not
        collected by day 90 the device may be recycled to cover costs.
      </p>
      <p>
        2.7 If we are unable to complete the Service for any reason, or the
        Service will incur further costs payable by you beyond that initially
        estimated, we will notify you immediately. If no fault is found or you
        do not accept the revised estimate, we will return your Device
        unrepaired and may charge an inspection fee.
      </p>
      <p>
        2.8 The cost of repair will be calculated in accordance with our
        standard charges as published from time to time.
      </p>
      <p>
        2.9 We shall be entitled to keep your Device until all charges payable
        have been paid. We may charge an additional fee for storage.
      </p>
      <p>2.10 Use of our service may void your manufacturer’s warranty.</p>
      <p>
        2.11 Finetune may install warranty seals following the repair. Any
        tampering of the seals will void our warranty.
      </p>
      <p>
        2.12 Our products and repairs are covered by the warranty terms outlined
        below.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Apple iPhone LCD Screen – Lifetime Warranty</li>
        <li>Battery replacement – 12 month Warranty</li>
        <li>Liquid Damage – 1 month Warranty</li>
        <li>Software Repair – 1 month Warranty</li>
        <li>All other Genuine LCD Screens – 12 month Warranty</li>
        <li>Smartphone Logic Board Repair – 1 month Warranty</li>
        <li>'AAA' Grade Quality LCD Screen – 1 month Warranty</li>
      </ul>
      <address className="not-italic mt-4 text-sm text-gray-700">
        Cheran Plaza K.G Chavadi Road, Ettimadai, Pirivu, near KK MAHAAL,
        Coimbatore, Tamil Nadu 641105. Phone:{' '}
        <a href="tel:+919791151863" className="text-keyline">
          +91 97911 51863
        </a>
      </address>
    </div>
  );
}
