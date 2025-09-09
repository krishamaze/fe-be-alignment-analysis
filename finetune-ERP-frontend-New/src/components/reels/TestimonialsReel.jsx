import MultiSlideReel from '@/components/layout/MultiSlideReel';

const testimonials = [
  {
    id: 1,
    author: 'Sachin Ramg',
    time: '6 months ago',
    text: 'Fine tune is a good shop with good quality service and accessories.',
    service: 'Purchase & Accessories',
  },
  {
    id: 2,
    author: 'Rathikamns Ganesha',
    time: '2 years ago',
    text: 'Mobile not charging—fixed in 10 minutes.',
    service: 'Charging Port Repair',
  },
  {
    id: 3,
    author: 'Shamili Krishnaraj',
    time: '4 years ago',
    text: "Didn't think I'd get my phone back after a car ran over it… now it looks brand new with all my data back. Very happy.",
    service: 'Damage Recovery',
  },
  {
    id: 4,
    author: 'Sahan Farooqui',
    time: '6 months ago',
    text: 'Good shop with a wide range of mobile phones. Staff was very helpful, prices competitive, and service quick.',
    service: 'Phone Purchase',
  },
];

function TestimonialSlide({ testimonial }) {
  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
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
      </div>
    </div>
  );
}

export default function TestimonialsReel() {
  const slides = testimonials.map((testimonial) => (
    <TestimonialSlide key={testimonial.id} testimonial={testimonial} />
  ));

  return (
    <section className="snap-start fullpage-section relative overflow-hidden bg-white">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Real feedback from customers across Coimbatore & Palakkad
        </p>
      </div>

      <MultiSlideReel reelId="testimonials" className="pt-20" showHint>
        {slides}
      </MultiSlideReel>
    </section>
  );
}
