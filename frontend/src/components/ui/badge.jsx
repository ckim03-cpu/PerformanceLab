import { cn } from '../../lib/utils'

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-gray-100 text-gray-700',
        variant === 'success' && 'bg-green-100 text-green-700',
        variant === 'indigo' && 'bg-indigo-100 text-indigo-700',
        className
      )}
      {...props}
    />
  )
}
