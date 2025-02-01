'use client'
// import ExpandingInput from '@/components/BuilderUI/ExpandingInput'
import useEditor, { Block, BlockOptions } from '@/context/editorContext'
import React, { HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'


interface ImageProps extends HTMLAttributes<HTMLImageElement> {
  children?: string | false
  className?: string
  onClick?: () => void
  blockData?: Block
  preview?: boolean
}

export const Image: React.FC<ImageProps> = ({
  children,
  className = '',
  blockData,
  preview = false,
  ...rest
}) => {
  const { selected, setSelected, blocks, setBlocks, onChangeUpdateBlockOptions } = useEditor();
  return (
    <>
      <img
      src={(blockData && blockData.options?.block?.imageLink) ?? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
        className={cn("text-primary-800 dark:text-primary-200 h-max", className, !preview && blockData?.options?.block?.className)}
        {...rest}
      />
      {/* {selected?.options?.block?.text} */}
      {/* {!isEditing ? selected?.options?.block?.text : <ExpandingInput />
      } */}
      {/* </TagName> */}
    </>
  )
}
