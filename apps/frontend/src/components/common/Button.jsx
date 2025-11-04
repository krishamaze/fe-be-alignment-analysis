import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Reusable Button component with consistent styling and accessibility
 * 
 * @component
 * @example
 * // Primary button
 * <Button variant="primary" size="lg">Get Started</Button>
 * 
 * // Secondary button as link
 * <Button variant="secondary" to="/shop">Shop Now</Button>
 * 
 * // Small outline button
 * <Button variant="outline" size="sm" onClick={handleClick}>Learn More</Button>
 */
const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to,
  href,
  className = '',
  disabled = false,
  ...props 
}, ref) => {
  // Size variants with 44px minimum touch target
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[44px]',
  };

  // Style variants
  const variantClasses = {
    primary: 'bg-primary text-surface hover:bg-secondary hover:text-primary',
    secondary: 'border border-surface/30 text-surface hover:bg-surface/10',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-surface',
  };

  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg font-semibold
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link
        ref={ref}
        to={to}
        className={baseClasses}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Render as anchor if 'href' prop is provided
  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={baseClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Render as button
  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  to: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
