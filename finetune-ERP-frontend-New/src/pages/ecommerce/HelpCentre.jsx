import { useState } from 'react';
import {
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineChat,
  HiOutlineQuestionMarkCircle,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
} from 'react-icons/hi';

function HelpCentre() {
  const [activeTab, setActiveTab] = useState('contact');

  const contactInfo = {
    phone: '+91 97911 51863',
    address:
      'Cheran Plaza K.G Chavadi Road\nEttimadai, Pirivu\nnear KK MAHAAL\nCoimbatore - 641105, Tamil Nadu, India',
    workingHours:
      'Monday - Saturday: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 6:00 PM',
  };

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer:
            'Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for select locations. International shipping takes 7-14 business days.',
        },
        {
          question: 'Do you ship internationally?',
          answer:
            'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check availability during checkout.',
        },
        {
          question: 'Can I track my order?',
          answer:
            "Yes, you'll receive a tracking number via email once your order ships. You can also track your order in your account dashboard.",
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day return policy for most products. Items must be in original condition with all packaging. Some products have different return policies.',
        },
        {
          question: 'How do I return an item?',
          answer:
            "Log into your account, go to 'My Orders', select the order you want to return, and follow the return process. We'll provide a prepaid shipping label.",
        },
        {
          question: 'When will I get my refund?',
          answer:
            'Refunds are processed within 3-5 business days after we receive your return. The time to appear in your account depends on your bank.',
        },
      ],
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit/debit cards, UPI, net banking, digital wallets (Paytm, PhonePe, Google Pay), and EMI options.',
        },
        {
          question: 'Is my payment information secure?',
          answer:
            'Yes, we use industry-standard SSL encryption and PCI DSS compliance to protect your payment information. We never store your card details.',
        },
        {
          question: 'Do you offer EMI options?',
          answer:
            'Yes, we offer EMI options through various banks and financial institutions. You can select EMI during checkout for eligible products.',
        },
      ],
    },
    {
      category: 'Product Support',
      questions: [
        {
          question: 'Do products come with warranty?',
          answer:
            'Yes, all products come with manufacturer warranty. Warranty period varies by product and brand. Check product details for specific warranty information.',
        },
        {
          question: 'How do I claim warranty?',
          answer:
            "For warranty claims, contact our support team with your order details and issue description. We'll guide you through the warranty process.",
        },
        {
          question: 'Do you provide technical support?',
          answer:
            'Yes, our technical support team is available to help with product setup, troubleshooting, and general questions about your purchases.',
        },
      ],
    },
  ];

  const supportOptions = [
    {
      icon: <HiOutlinePhone className="w-8 h-8" />,
      title: 'Call Us',
      description: 'Speak directly with our support team',
      action: `Call ${contactInfo.phone}`,
      color: 'bg-gray-500',
    },
    {
      icon: <HiOutlineChat className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      color: 'bg-gray-500',
    },
    // {
    //   icon: <HiOutlineMapPin className="w-8 h-8" />,
    //   title: "Visit Store",
    //   description: "Visit our physical store",
    //   action: "Get Directions",
    //   color: "bg-orange-500"
    // }
  ];

  return (
    <div className="min-h-app bg-gray-50 pt-safe-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Centre</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help! Find answers to common questions, get in touch
            with our support team, or visit our store for personalized
            assistance.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div
                className={`${option.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
              >
                {option.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{option.description}</p>
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm">
                {option.action}
              </button>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <HiOutlinePhone className="w-6 h-6 text-keyline mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-gray-600">{contactInfo.phone}</p>
                <p className="text-sm text-gray-500">
                  Available during business hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {/* <HiOutlineMapPin className="w-6 h-6 text-orange-600 mt-1" /> */}
              <div>
                <h3 className="font-semibold text-gray-900">Store Address</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {contactInfo.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HiOutlineClock className="w-6 h-6 text-keyline mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Working Hours</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {contactInfo.workingHours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'contact'
                    ? 'border-b-2 border-keyline text-keyline'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Contact Details
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'faq'
                    ? 'border-b-2 border-keyline text-keyline'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Frequently Asked Questions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Customer Support
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <HiOutlinePhone className="w-5 h-5 text-keyline" />
                        <span className="text-gray-700">
                          {contactInfo.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HiOutlineMail className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">
                          {contactInfo.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HiOutlineClock className="w-5 h-5 text-keyline" />
                        <span className="text-gray-700">
                          Mon-Sat: 9AM-8PM, Sun: 10AM-6PM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Store Location
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        {/* <HiOutlineMapPin className="w-5 h-5 text-orange-600 mt-1" /> */}
                        <div className="text-gray-700 whitespace-pre-line">
                          {contactInfo.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Emergency Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    For urgent technical issues or order problems, please call
                    our emergency support line:
                  </p>
                  <div className="flex items-center gap-3">
                    <HiOutlinePhone className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-600">
                      +91-1800-999-8888
                    </span>
                    <span className="text-sm text-gray-500">
                      (24/7 Emergency Support)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-8">
                {faqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {category.category}
                    </h3>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <div
                          key={faqIndex}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-medium text-gray-900 mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <HiOutlineTruck className="w-12 h-12 text-keyline mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Free Shipping
            </h3>
            <p className="text-gray-600 text-sm">
              Free shipping on orders above ₹999 across India
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <HiOutlineShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Shopping
            </h3>
            <p className="text-gray-600 text-sm">
              100% secure payment with SSL encryption
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <HiOutlineRefresh className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy Returns
            </h3>
            <p className="text-gray-600 text-sm">
              30-day return policy with hassle-free returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCentre;
