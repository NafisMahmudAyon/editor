// C:\All File\React Project\editor\components\BlockList.tsx
'use client'

import useEditor, { Block } from '@/context/editorContext';
import React from 'react';
import { ReactSortable } from 'react-sortablejs';

const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  ghostClass: "ghost",
  group: "shared",
};

// interface ContainerProps {
//   block: Block;
//   blockIndex: number[];
//   setBlocks: (data: Block[]) => void;
//   selected: number | null;
//   setSelected: (data: number | null) => void;
// }

// interface BlockWrapperProps {
//   block: Block;
//   blockIndex: number[];
//   setBlocks: (data: Block[]) => void;
//   selected: number | null;
//   setSelected: (data: number | null) => void;
// }

// interface ContainerProps {
//   block: Block
//   blockIndex: number[]
//   setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
//   selected: number | null
//   setSelected: React.Dispatch<React.SetStateAction<number | null>>
// }

// interface BlockWrapperProps {
//   block: Block
//   blockIndex: number[]
//   setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
//   selected: number | null
//   setSelected: React.Dispatch<React.SetStateAction<number | null>>
// }

interface BlockListProps {
  blocks: Block[];
  setBlocks: (data: Block[]) => void;
  selected: number | null;
  setSelected: (data: number | null) => void;
}

const BlockList: React.FC<BlockListProps> = ({ blocks, setBlocks, selected, setSelected }) => {
  return (
    <div>
      <span className='bg-red-500 inline-flex items-center gap-2 ml-auto px-3 py-2' onClick={() => setBlocks([{
        id: 1,
        type: "root",
        content: "New Root",
        label: "root-1",
        children: [],
        parent_id: null,
        options: {}
      }])}>Remove All {" "} 🗑️</span>
      <ReactSortable list={blocks} setList={setBlocks} {...sortableOptions}>
        {blocks.map((block, blockIndex) => (
          <BlockWrapper
            key={block.id}
            block={block}
            blockIndex={[blockIndex]}
            setBlocks={setBlocks}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </ReactSortable>
    </div>
  );
}

const Container = ({
  block,
  blockIndex,
  setBlocks,
  selected,
  setSelected,
}) => {
  return (
    <>
      <ReactSortable<Block>
        key={block.id}
        list={block.children || []}
        setList={(currentList) => {
          setBlocks((sourceList) => {
            const tempList = [...sourceList];
            const _blockIndex = [...blockIndex];
            const lastIndex = _blockIndex.pop();
            const lastArr = _blockIndex.reduce(
              (arr, i) => arr[i].children as Block[],
              tempList
            );
            if (lastIndex !== undefined && lastArr) {
              lastArr[lastIndex].children = currentList;
            }
            return tempList;
          });
        }}
        {...sortableOptions}
      >
        {block.children &&
          block.children.map((childBlock, index) => (
            <BlockWrapper
              key={childBlock.id}
              block={childBlock}
              blockIndex={[...blockIndex, index]}
              setBlocks={setBlocks}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
      </ReactSortable>
    </>
  );
};

const BlockWrapper = ({
  block,
  blockIndex,
  setBlocks,
  selected,
  setSelected,
}) => {
  if (!block) return null;

  const handleRemove = () => {
    if (block.type === "root") {
      return;
    }
    setBlocks((prev: Block[]) => {
      const updatedBlocks = [...prev];
      removeNestedBlock(updatedBlocks, blockIndex);
      return updatedBlocks;
    });
  };

  return (
    <div className="block relative pl-4 py-2">
      <div
        className={`flex items-center border border-solid px-3 py-1 ${block.id === selected ? "bg-gray-300" : "bg-gray-500 text-white"
          } `}>
        <span className="flex-1 overflow-hidden truncate">{block.type}</span>
        <div className="flex items-center gap-2">
          <span
            className="size-6 bg-red-500 flex items-center justify-center cursor-pointer"
            onClick={handleRemove}>
            🗑️
          </span>
          <span
            className="size-6 bg-blue-300 flex items-center justify-center cursor-pointer"
            onClick={() => setSelected(block.id)}>
            ✏️
          </span>
        </div>
      </div>
      {["root", "container"].includes(block.type) && (
        <Container
          block={block}
          setBlocks={setBlocks}
          blockIndex={blockIndex}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}

function getNestedBlock(blocks, indices) {
  return indices.reduce((block, index) => block.children[index], {
    children: blocks,
  });
}

function removeNestedBlock(blocks, indices) {
  if (indices.length === 1) {
    blocks.splice(indices[0], 1);
  } else {
    const parentBlock = getNestedBlock(blocks, indices.slice(0, -1));
    parentBlock.children.splice(indices[indices.length - 1], 1);
  }
}

export default BlockList
