import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  rightContent?: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, title, subtitle, rightContent, spacing = 'lg', ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        'w-full',
        {
          'py-8 sm:py-12': spacing === 'sm',
          'py-12 sm:py-16': spacing === 'md',
          'py-16 sm:py-24': spacing === 'lg',
        },
        className
      )}
      {...props}
    >
      {(title || subtitle || rightContent) && (
        <div className="flex items-start justify-between mb-12">
          <div>
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {rightContent && <div>{rightContent}</div>}
        </div>
      )}
      {children}
    </section>
  )
);

Section.displayName = 'Section';

export default Section;
