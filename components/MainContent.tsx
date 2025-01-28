'use client'
import useEditor from "@/context/editorContext";
import React from "react";
import { ReactSortable } from "react-sortablejs";
import BlockWrapper from "./BlockWrapper";
import { Block } from "@/context/editorContext";

const parentSortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  group: "parent-group",
};

const MainContent: React.FC = () => {
  const { blocks, handleBlockUpdate } = useEditor();

  const handleSortableUpdate = (newState: Block[]) => {
    handleBlockUpdate(newState, null);
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-primary-200">
      <div className="bg-white rounded-lg shadow-sm min-h-full border border-primary-700 p-6">
        <ReactSortable
          list={blocks}
          setList={handleSortableUpdate}
          tag={"div"}
          className="block h-full"
          {...parentSortableOptions}
        >
          {blocks.map((block) => (
            <BlockWrapper key={block.id} block={block} />
          ))}
        </ReactSortable>
      </div>
    </div>
  );
};

export default MainContent;
