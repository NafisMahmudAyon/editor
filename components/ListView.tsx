'use client'
import useEditor, { Block } from '@/context/editorContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DragDropVerticalIcon } from 'hugeicons-react';
import React from 'react';
// import BlockWrapper from './BlockWrapper'
import { ReactSortable } from 'react-sortablejs';

const parentSortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  group: "parent-group",
};

const ListView = () => {
  const { blocks, handleBlockUpdate } = useEditor()
  const handleSortableUpdate = (newState: Block[]) => {
    handleBlockUpdate(newState, null);
  };
  return (
    <div className='bg-primary-200 pr-1'>
      <ReactSortable
        list={blocks}
        setList={handleSortableUpdate}
        {...parentSortableOptions}
      >
        {blocks.map((block) => (
          <BlockWrapper key={block.id} block={block} />
        ))}
      </ReactSortable>
    </div>
  )
}

interface BlockWrapperProps {
  block: Block;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ block }) => {
  const { selected, setSelected, setBlocks } = useEditor()
  const handleRemove = (block: Block) => {
    if (block.type == "root") {
      return
    }
    setBlocks((prevBlocks) => {
      const removeBlockRecursive = (blocks: Block[], blockId: number): Block[] => {
        return blocks
          .filter((b) => b.id !== blockId) // Remove the block if it's in this level
          .map((b) => ({
            ...b,
            children: b.children ? removeBlockRecursive(b.children, blockId) : [], // Recursively check children
          }));
      };

      return removeBlockRecursive(prevBlocks, block.id);
    });
  };
  return (
    <div className='relative pl-1 py-2 rounded w-full'>
      <div className={`border-b border-b-primary-800 pl-2 pr-1 flex items-center justify-between text-primary-800 ${selected && block.id === selected.id ? "bg-primary-500 text-white" : "bg-primary-300"}`}>
        <span className='cursor-pointer flex-1 py-1 flex items-center gap-1' onClick={() => setSelected(block)}>
          <DragDropVerticalIcon strokeWidth="2.5" className='cursor-move' />
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)} ID:{" "}
          {block.id}
        </span>
        <span onClick={() => {handleRemove(block)}}>
          <XMarkIcon className='size-4 hover:bg-red-500 cursor-pointer hover:text-white' />
        </span>
      </div>
      {(block.type === "container" || block.type === "root") && <Container block={block} />}
    </div>
  )
}

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
  const { handleBlockUpdate } = useEditor()
  return (
    <div
      className="pl-2"
    >
      <ReactSortable
        list={block.children || []}
        setList={(newState) =>
          handleBlockUpdate(newState, block.id)
        }
        {...childSortableOptions}
      >
        {block.children?.map((child) => (
          <BlockWrapper key={child.id} block={child} />
        ))}
      </ReactSortable>
    </div>
  )
}

// function getNestedBlock(blocks: Block[], indices: number[]) {
//   return indices.reduce((block, index) => block.children[index], {
//     children: blocks,
//   });
// }

// function removeNestedBlock(blocks: Block[], indices: number[]) {
//   if (indices.length === 1) {
//     blocks.splice(indices[0], 1);
//   } else {
//     const parentBlock = getNestedBlock(blocks, indices.slice(0, -1));
//     parentBlock.children.splice(indices[indices.length - 1], 1);
//   }
// }

export default ListView