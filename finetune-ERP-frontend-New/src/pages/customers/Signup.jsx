import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/redux/slice/authSlice';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    else if (formData.firstName.length < 2)
      newErrors.firstName = 'Must be at least 2 characters';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (formData.lastName.length < 2)
      newErrors.lastName = 'Must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email))
      newErrors.email = 'Invalid email';

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = 'Invalid phone number';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password =
        'Must contain at least 1 uppercase, 1 lowercase letter and a number';

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = 'You must accept the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await dispatch(
        registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: 'customer',
          password: formData.password,
        })
      ).unwrap();

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h2
            className="text-xl font-semibold text-gray-800"
            style={{ marginTop: '15%' }}
          >
            Sign Up
          </h2>
          <p className="text-sm text-gray-500">
            Join us and start shopping today!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* First Name */}
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-keyline`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-keyline`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-keyline`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="relative">
            <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              placeholder="Phone Number *"
              maxLength="10"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-keyline`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password *"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 pr-10 py-2 border rounded-md text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-keyline`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange('confirmPassword', e.target.value)
              }
              className={`w-full pl-10 pr-10 py-2 border rounded-md text-sm ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-keyline`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-xs">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                handleInputChange('agreeToTerms', e.target.checked)
              }
              className="mt-1 h-4 w-4 text-keyline focus:ring-keyline border-gray-300 rounded"
            />
            <span className="text-gray-600">
              I agree to the{' '}
              <Link
                to="/legal"
                className="text-gray-700 hover:text-keyline hover:underline"
              >
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                to="/legal"
                className="text-gray-700 hover:text-keyline hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gray-700 hover:text-keyline hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
