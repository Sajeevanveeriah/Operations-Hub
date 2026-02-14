import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr)
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'PPP p')
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function generateQRCode(text: string): string {
  return `QR-${text.toUpperCase().replace(/\s/g, '-')}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function calculateSLAStatus(
  deadline: string | undefined,
  status: string
): 'ok' | 'warning' | 'overdue' {
  if (!deadline || status === 'closed' || status === 'resolved' || status === 'completed') return 'ok'

  const now = new Date()
  const deadlineDate = parseISO(deadline)
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilDeadline < 0) return 'overdue'
  if (hoursUntilDeadline < 2) return 'warning'
  return 'ok'
}
