import TailwindInput from '@/components/TailwindInput'
import useEditor, { BlockOptions } from '@/context/editorContext'
import React from 'react'

export const Style = () => {
  const { selected, setSelected, blocks, setBlocks, onChangeUpdateBlockOptions } = useEditor();

  const handleOptionChange = (key: keyof BlockOptions, value: string) => {
    if (selected) {
      // Update the blocks state recursively
      const updatedBlocks = onChangeUpdateBlockOptions(blocks, selected.id, key, value);
      setBlocks(updatedBlocks);

      // Update the selected block state
      setSelected({
        ...selected,
        options: {
          ...selected.options,
          block: {
            ...selected.options.block,
            [key]: value,
          },
        },
      });
    }
  };
  return (
    <div>
      <TailwindInput 
        label="Class"
        update={(e) => handleOptionChange('className', e)}
        val={selected?.options?.block?.className || ''}
      />
    </div>
  )
}
