'use client'
import React, { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type HeadingVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'display1'
  | 'display2'
// | 'body1'
// | 'body2'
// | 'caption'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: HeadingVariant
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Heading: React.FC<HeadingProps> = ({
  variant,
  tagName = "h2",
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
    switch (variant ?? tagName) {
      case 'h1':
        return 'text-h1'
      case 'h2':
        return 'text-h2'
      case 'h3':
        return 'text-h3'
      case 'h4':
        return 'text-h4'
      case 'h5':
        return 'text-h5'
      case 'h6':
        return 'text-h6'
      // case 'body1':
      //   return 'text-body1'
      // case 'body2':
      //   return 'text-body2'
      // case 'caption':
      //   return 'text-caption'
      case 'display1':
        return 'text-display1'
      case 'display2':
        return 'text-display2'
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
