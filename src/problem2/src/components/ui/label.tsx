import * as React from 'react'

import { cn } from '@/lib/utils'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: React.ReactNode
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, requiredIndicator, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {requiredIndicator}
      </span>
    </label>
  ),
)
Label.displayName = 'Label'

export { Label }

