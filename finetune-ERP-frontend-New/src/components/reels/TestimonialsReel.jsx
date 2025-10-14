import SectionSlider from '@/components/navigation/SectionSlider';

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
    <div className="w-full h-full flex items-center justify-center px-2 md:px-3">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-surface rounded-2xl p-6 shadow-lg flex flex-col items-center text-center space-y-4">
          <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-secondary text-heading-md">
                ★
              </span>
            ))}
          </div>
          <blockquote className="text-body-lg text-primary leading-relaxed">
            "{testimonial.text}"
          </blockquote>
          <div>
            <p className="font-semibold text-primary text-body-md">
              {testimonial.author}
            </p>
            <p className="text-primary/60 text-body-sm">
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
    <section className="snap-start fullpage-section overflow-hidden bg-gradient-to-b from-surface/80 to-surface">
      <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-2">
          <h2 className="text-heading-xl font-bold text-primary">
            What Our Customers Say
          </h2>
          <p className="text-body-md text-primary/60">
            Real feedback from customers across Coimbatore & Palakkad
          </p>
        </div>

        <SectionSlider
          sectionId="testimonials"
          showHint
          mode="horizontal"
          className="w-full flex-1"
          slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        >
          {slides}
        </SectionSlider>
      </div>
    </section>
  );
}
