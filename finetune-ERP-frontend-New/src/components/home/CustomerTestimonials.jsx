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

export default function CustomerTestimonials() {
  return (
    <section className="bg-white py-16 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real feedback from customers across Coimbatore & Palakkad
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testimonials.slice(0, 4).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100"
            >
              {/* 5 Star Rating (since all are positive) */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-4 leading-relaxed italic">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.service} • {testimonial.time}
                  </p>
                </div>

                {/* Service Tags */}
                <div className="flex gap-2">
                  {testimonial.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center">
          <a
            href="https://www.google.com/search?q=finetune+mobile+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-900 hover:text-yellow-600 font-medium text-lg group"
          >
            Read All Reviews on Google
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
