import React, { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type TextVariant =
  | 'body1'
  | 'body2'
  | 'caption'

interface TextProps {
  variant?: TextVariant
  tagName?: "p" | "caption" | "span" | 'div'
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Text: React.FC<TextProps> = ({
  variant = "",
  tagName = "p",
  children,
  className = '',
  ...rest
}) => {
  const TagName = tagName
  // const getComponent = (): React.ElementType => {
  //   switch (variant) {
  //     case 'h1':
  //     case 'h2':
  //     case 'h3':
  //     case 'h4':
  //     case 'h5':
  //     case 'h6':
  //       return variant
  //     case 'display1':
  //       return 'h1'
  //     case 'display2':
  //       return 'h1'
  //     default:
  //       return 'p'
  //   }
  // }

  const getStyles = (): string => {
    switch (variant) {
      case 'body1':
        return 'text-body1'
      case 'body2':
        return 'text-body2'
      case 'caption':
        return 'text-caption'
      default:
        return ''
    }
  }

  // const Component = getComponent()
  const styles = getStyles()

  return (
    <TagName
      className={cn("text-primary-800 dark:text-primary-200", styles, className)}
      {...rest}
    >
      {children}
    </TagName>
  )
}
