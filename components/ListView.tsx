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
  const { selected, setSelected } = useEditor()
  return(
    <div className='relative pl-1 py-2 rounded w-full'>
      <div className={`border-b border-b-primary-800 pl-2 pr-1 flex items-center justify-between text-primary-800 ${block.id === selected ? "bg-primary-500 text-white" : "bg-primary-300"}`}>
        <span className='cursor-pointer flex-1 py-1 flex items-center gap-1' onClick={() => setSelected(block.id)}>
          <DragDropVerticalIcon strokeWidth="2.5" className='cursor-move' />
          {block.type.charAt(0).toUpperCase() + block.type.slice(1)} ID:{" "}
          {block.id}
        </span>
        <span>
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
  const {handleBlockUpdate} = useEditor()
  return(
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

export default ListView