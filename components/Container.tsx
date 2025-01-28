"use client";

import useEditor, { Block } from "@/context/editorContext";
import { ReactSortable } from "react-sortablejs";
import BlockWrapper from "./BlockWrapper";

interface ContainerProps {
  block: Block;
}

const childSortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  dragoverBubble: true,
  swapThreshold: 0.65,
  group: "child-group",
};

const Container: React.FC<ContainerProps> = ({ block }) => {
  const { draggedTemplate, handleTemplateAdd, handleBlockUpdate } = useEditor();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedTemplate) {
      handleTemplateAdd(draggedTemplate, block.id); // Add a new block
    }
  };
  return (
    <>
      <ReactSortable
        list={block.children || []}
        setList={(newState) =>
          handleBlockUpdate(newState, block.id)
        }
        tag={"div"}
        className="block h-full"
        {...childSortableOptions}
      >
        {block.children?.map((child) => (
          <BlockWrapper key={child.id} block={child} />
        ))}
      </ReactSortable>
      {block.children && (
        <div className="text-center text-xl min-h-[50px] border border-transparent transition-colors duration-200 ease-in-out hover:border-primary-200 hover:border-dashed cursor-pointer" onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}>+</div>
      )}
    </>
  );
};

export default Container;
