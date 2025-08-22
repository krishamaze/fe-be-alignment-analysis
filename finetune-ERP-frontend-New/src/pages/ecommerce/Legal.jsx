import { useState } from 'react';
import { HiOutlineDocumentText, HiOutlineShieldCheck, HiOutlineEye, HiOutlineLockClosed, HiOutlineCreditCard, HiOutlineTruck } from 'react-icons/hi';

function Legal() {
  const [activeSection, setActiveSection] = useState('terms');

  const legalSections = [
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: <HiOutlineDocumentText className="w-6 h-6" />
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <HiOutlineShieldCheck className="w-6 h-6" />
    },
    {
      id: 'shipping',
      title: 'Shipping Policy',
      icon: <HiOutlineTruck className="w-6 h-6" />
    },
    {
      id: 'returns',
      title: 'Return Policy',
      icon: <HiOutlineEye className="w-6 h-6" />
    },
    {
      id: 'payment',
      title: 'Payment Terms',
      icon: <HiOutlineCreditCard className="w-6 h-6" />
    },
    {
      id: 'security',
      title: 'Security Policy',
      icon: <HiOutlineLockClosed className="w-6 h-6" />
    }
  ];

  const legalContent = {
    terms: {
      title: "Terms and Conditions",
      lastUpdated: "Last updated: January 15, 2024",
      content: [
        {
          section: "1. Acceptance of Terms",
          text: "By accessing and using Finetune's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
          section: "2. Use License",
          text: "Permission is granted to temporarily download one copy of the materials (information or software) on Finetune's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
        },
        {
          section: "3. User Account",
          text: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password."
        },
        {
          section: "4. Product Information",
          text: "We strive to display accurate product information, including prices and availability. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free."
        },
        {
          section: "5. Pricing and Payment",
          text: "All prices are in Indian Rupees (INR) and are subject to change without notice. Payment must be made at the time of order placement. We accept various payment methods as listed on our website."
        },
        {
          section: "6. Order Acceptance",
          text: "All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone for any reason at any time."
        },
        {
          section: "7. Limitation of Liability",
          text: "In no event shall Finetune, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages."
        },
        {
          section: "8. Governing Law",
          text: "These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Coimbatore, Tamil Nadu."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 15, 2024",
      content: [
        {
          section: "1. Information We Collect",
          text: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, shipping address, and payment information."
        },
        {
          section: "2. How We Use Your Information",
          text: "We use the information we collect to process your orders, communicate with you, provide customer support, improve our services, and send you marketing communications (with your consent)."
        },
        {
          section: "3. Information Sharing",
          text: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law."
        },
        {
          section: "4. Data Security",
          text: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          section: "5. Cookies and Tracking",
          text: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from."
        },
        {
          section: "6. Your Rights",
          text: "You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time."
        },
        {
          section: "7. Data Retention",
          text: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations."
        }
      ]
    },
    shipping: {
      title: "Shipping Policy",
      lastUpdated: "Last updated: January 15, 2024",
      content: [
        {
          section: "1. Shipping Methods",
          text: "We offer standard shipping (3-5 business days) and express shipping (1-2 business days) for domestic orders. International shipping is available to select countries."
        },
        {
          section: "2. Shipping Costs",
          text: "Free shipping is available on orders above ₹999. Standard shipping costs ₹99 for orders below ₹999. Express shipping costs ₹199."
        },
        {
          section: "3. Delivery Areas",
          text: "We ship to all major cities and towns across India. Remote areas may have additional delivery charges or longer delivery times."
        },
        {
          section: "4. Order Processing",
          text: "Orders are typically processed within 24 hours of placement. You will receive a confirmation email with tracking information once your order ships."
        },
        {
          section: "5. Delivery Confirmation",
          text: "All deliveries require signature confirmation. If you're not available, our delivery partner will attempt redelivery or leave a notice for pickup."
        },
        {
          section: "6. Shipping Delays",
          text: "We are not responsible for delays caused by weather, natural disasters, or other circumstances beyond our control."
        }
      ]
    },
    returns: {
      title: "Return Policy",
      lastUpdated: "Last updated: January 15, 2024",
      content: [
        {
          section: "1. Return Period",
          text: "We offer a 30-day return policy for most products. Items must be returned in original condition with all packaging and accessories included."
        },
        {
          section: "2. Return Process",
          text: "To initiate a return, log into your account, go to 'My Orders', select the order you want to return, and follow the return process. We'll provide a prepaid shipping label."
        },
        {
          section: "3. Non-Returnable Items",
          text: "Certain items are non-returnable, including software, digital downloads, personalized items, and items marked as non-returnable on the product page."
        },
        {
          section: "4. Refund Processing",
          text: "Refunds are processed within 3-5 business days after we receive your return. The time to appear in your account depends on your bank or payment provider."
        },
        {
          section: "5. Return Shipping",
          text: "We provide free return shipping for items returned due to defects or our error. For other returns, return shipping costs may apply."
        },
        {
          section: "6. Damaged Items",
          text: "If you receive a damaged item, please contact us within 48 hours of delivery. We'll arrange for a replacement or refund."
        }
      ]
    },
    payment: {
      title: "Payment Terms",
      lastUpdated: "Last updated: January 15, 2024",
      content: [
        {
          section: "1. Accepted Payment Methods",
          text: "We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, net banking, digital wallets (Paytm, PhonePe, Google Pay), and EMI options."
        },
        {
          section: "2. Payment Security",
          text: "All payments are processed through secure payment gateways with SSL encryption. We do not store your card details on our servers."
        },
        {
          section: "3. EMI Options",
          text: "EMI options are available for eligible products through various banks and financial institutions. EMI terms and conditions apply as per the bank's policy."
        },
        {
          section: "4. Payment Processing",
          text: "Payments are processed immediately upon order placement. In case of payment failure, your order will be cancelled automatically."
        },
        {
          section: "5. Currency",
          text: "All prices are displayed in Indian Rupees (INR). International customers may see prices converted to their local currency during checkout."
        },
        {
          section: "6. Payment Disputes",
          text: "If you have any issues with your payment, please contact our customer support team. We'll work with you to resolve any payment-related problems."
        }
      ]
    },
    security: {
      title: "Security Policy",
      lastUpdated: "Last updated: January 15, 2024",
      content: [
        {
          section: "1. Data Protection",
          text: "We implement industry-standard security measures to protect your personal and financial information. This includes SSL encryption, secure servers, and regular security audits."
        },
        {
          section: "2. Secure Transactions",
          text: "All transactions are processed through PCI DSS compliant payment gateways. Your payment information is encrypted and transmitted securely."
        },
        {
          section: "3. Account Security",
          text: "We recommend using strong passwords and enabling two-factor authentication for your account. Never share your login credentials with others."
        },
        {
          section: "4. Fraud Prevention",
          text: "We use advanced fraud detection systems to prevent unauthorized transactions. Suspicious activities may result in order cancellation or account suspension."
        },
        {
          section: "5. Security Monitoring",
          text: "Our systems are monitored 24/7 for security threats. We regularly update our security measures to protect against new threats."
        },
        {
          section: "6. Incident Response",
          text: "In case of a security incident, we will notify affected users promptly and take appropriate measures to protect their information."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Important legal information about our services, policies, and your rights as a customer.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Documents</h3>
              <nav className="space-y-2">
                {legalSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-gray-50 text-keyline border border-keyline'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {legalContent[activeSection].title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {legalContent[activeSection].lastUpdated}
                  </p>
                </div>

                <div className="prose prose-gray max-w-none">
                  {legalContent[activeSection].content.map((item, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.section}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Contact Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about our legal policies, please contact us:
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📞 Phone: +91 97911 51863</p>
                    <p>
                      📍 Address: Cheran Plaza K.G Chavadi Road, Ettimadai, Pirivu,
                      near KK MAHAAL, Coimbatore, Tamil Nadu 641105
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Legal; 