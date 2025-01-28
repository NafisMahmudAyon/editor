"use client";

import useEditor, { Block } from "@/context/editorContext";
import React from "react";
import { Heading } from "./Blocks/Heading";
import Container from "./Container";
import { Text } from "./Blocks/Text";

interface BlockWrapperProps {
  block: Block;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block }) => {
  const { selected, setSelected, selectedType, setSelectedType } = useEditor();
  return (
    <>
      {block.type === "heading" && (
        <Heading onClick={() => {
          console.log("clicked");
          setSelected(block.id)
          setSelectedType(block.type)
        }
        } className={`${block.id === selected && "border border-primary-200 border-dashed"}`}>
          {block.type === "heading" && block.content}
        </Heading>
      )}
      {block.type === "image" && (
        <img src={block.options?.block?.imageLink ?? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"} onClick={() => {
          console.log("clicked");
          setSelected(block.id)
          setSelectedType(block.type)
        }
        } className={`${block.id === selected && "border border-primary-200 border-dashed"}`} />
      )}
      {block.type === "text" && (
        <Text onClick={() => {
          console.log("clicked");
          setSelected(block.id)
          setSelectedType(block.type)
        }}
        className={`${block.id === selected && "border border-primary-200 border-dashed"}`}
        >
          {block.content}
        </Text>
      )}
      {(block.type === "container" || block.type === "root") && <Container block={block} />}
    </>
  );
};

export default BlockWrapper;
