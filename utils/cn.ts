import { ClassValue, clsx } from 'clsx'


const cn = (...args: ClassValue[]) => {
  return clsx(args)
}

export { cn }
