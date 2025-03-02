"use client";

import useEditor, { Block } from "@/context/editorContext";
import { cn } from "@/utils/cn";
import React from "react";
import { Heading } from "./Blocks/Heading";
import { Text } from "./Blocks/Text";
import Container from "./Container";
import { Image } from "./Blocks/Image";

interface BlockWrapperProps {
  block: Block;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block }) => {
  const { selected, setSelected, selectedType, setSelectedType, responsive, responsiveBlock, findBlockById } = useEditor();
  return (
    <>
      {block.type === "heading" && (
        <Heading
          tagName={block.options?.block?.tagName}
          onClick={() => {
            setSelected(block)
            setSelectedType(block.type)
          }} blockData={block} className={cn(selected && block.id === selected.id && "border border-primary-200 border-dashed", responsive === 'lg' ? block.options?.block?.className : findBlockById(responsiveBlock, block.id)?.options?.block?.className)}>
          {block.type === "heading" && block.options?.block?.text}
        </Heading>
      )}
      {block.type === "image" && (
        <Image blockData={block} onClick={() => {
          setSelected(block)
          setSelectedType(block.type)
        }
        } className={`${selected && block.id === selected.id && "border border-primary-200 border-dashed"}`} />
      )}
      {block.type === "text" && (
        <Text onClick={() => {
          setSelected(block)
          setSelectedType(block.type)
        }}
          blockData={block}
          className={`${selected && block.id === selected.id && "border border-primary-200 border-dashed"}`}
        >
          {block.options?.block?.text}
        </Text>
      )}
      {(block.type === "container" || block.type === "root") && <Container block={block} />}
    </>
  );
};

export default BlockWrapper;
