'use client'
import React, { HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import useEditor, { Block } from '@/context/editorContext'



interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  tagName?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'main' | 'nav' | 'footer'
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  preview?: boolean
  blockData?: Block
}

export const Container: React.FC<ContainerProps> = ({
  tagName = "div",
  children,
  className = '',
  preview = false,
  blockData,
  ...rest
}) => {
  const TagName = tagName

  const { responsive, responsiveBlock, findBlockById } = useEditor();

  return (
    <TagName
      className={cn(!preview && "relative pb-6 mb-6 border border-dashed", className, preview && blockData?.options?.block?.className)}
      {...rest}
    >
      {children}
    </TagName>
  )
}
