import React, { HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import useEditor, { Block } from '@/context/editorContext'


interface TextProps {
  tagName?: "p" | "caption" | "span" | 'div'
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  blockData?: Block
  preview?: boolean
}

export const Text: React.FC<TextProps> = ({
  tagName = "p",
  children,
  className = '',
  blockData,
  preview = false,
  ...rest
}) => {
  const { selected, setSelected, blocks, setBlocks, onChangeUpdateBlockOptions } = useEditor();
  const TagName = tagName

  return (
    <TagName
      className={cn("text-primary-800 dark:text-primary-200", preview && blockData?.options?.block?.className, className)}
      {...rest}
      dangerouslySetInnerHTML={{ __html: blockData?.options?.block?.text ?? "" }}
    >
    </TagName>
  )
}
