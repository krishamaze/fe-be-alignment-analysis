import ReelLayout from '@/components/layout/ReelLayout';

const testimonials = [
  {
    id: 1,
    author: 'Sachin Ramg',
    time: '6 months ago',
    text: 'Fine tune is a good shop with good quality service and accessories. I used to purchase mobiles and gadgets here—A happy customer.',
    tags: ['retail', 'accessories', 'service'],
    service: 'Purchase & Accessories',
  },
  {
    id: 2,
    author: 'Rathikamns Ganesha',
    time: '2 years ago',
    text: 'Mobile not charging—fixed in 10 minutes.',
    tags: ['repair', 'charging', 'speed'],
    service: 'Charging Port Repair',
  },
  {
    id: 3,
    author: 'Shamili Krishnaraj',
    time: '4 years ago',
    text: "Didn't think I'd get my phone back after a car ran over it… now it looks brand new with all my data back. Very happy.",
    tags: ['repair', 'severe damage', 'data recovery'],
    service: 'Damage Recovery',
  },
  {
    id: 4,
    author: 'Sahan Farooqui',
    time: '6 months ago',
    text: 'Good shop with a wide range of mobile phones. Staff was very helpful, prices competitive, and service quick.',
    tags: ['retail', 'phones', 'pricing', 'speed'],
    service: 'Phone Purchase',
  },
];

function TestimonialSlide({ testimonial }) {
  return (
    <div
      className="snap-start fullpage-section flex items-center justify-center bg-white"
      style={{
        height: 'calc(100dvh - var(--topbar-h,0px) - var(--mainnav-h,0px))',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          What Our Customers Say
        </h2>

        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto mb-8">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">
                ★
              </span>
            ))}
          </div>
          <blockquote className="text-xl text-gray-900 mb-6 leading-relaxed">
            "{testimonial.text}"
          </blockquote>
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-lg">
              {testimonial.author}
            </p>
            <p className="text-gray-500">
              {testimonial.service} • {testimonial.time}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          Real feedback from customers across Coimbatore & Palakkad
        </p>
      </div>
    </div>
  );
}

export default function TestimonialsReel() {
  return (
    <section
      className="snap-start fullpage-section relative overflow-hidden"
      style={{
        height: 'calc(100dvh - var(--topbar-h,0px) - var(--mainnav-h,0px))',
      }}
    >
      <ReelLayout autoplay>
        {testimonials.map((testimonial) => (
          <TestimonialSlide key={testimonial.id} testimonial={testimonial} />
        ))}
      </ReelLayout>
    </section>
  );
}
