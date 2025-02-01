'use client'
import useEditor from '@/context/editorContext'
import { Sidebar } from 'aspect-ui/Sidebar'
import { TabContent, TabItem, TabList, Tabs } from 'aspect-ui/Tabs'
import { Add02Icon } from 'hugeicons-react'
import { Options as HeadingOptions, Style as HeadingStyle } from './Blocks/Heading'
import { Options as ContainerOptions, Style as ContainerStyle  } from './Blocks/Container'
import { Options as TextOptions, Style as TextStyle  } from './Blocks/Text'
import { Style as ImageStyle } from './Blocks/Image'

const OptionsPanel = () => {

  const { selected, setSelected, selectedType, setSelectedType } = useEditor()

  return (
    <div>
      <Sidebar className='h-full'>
        <Tabs defaultActive="item-1">
          <TabList>
            <TabItem id="item-1">
              Options
            </TabItem>
            <TabItem id="item-2">
              Styles
            </TabItem>
          </TabList>
          <TabContent id="item-1">
            <h1>Options</h1>
            {selected && (
              <>
                {selected.type === "heading" && <HeadingOptions />}
                {selected.type === "container" && <ContainerOptions />}
                {selected.type === "text" && <TextOptions />}
              </>
            )}
          </TabContent>
          <TabContent id="item-2">
            <h1>Styles</h1>
            {selected && (
              <>
                {selected.type === "heading" && <HeadingStyle />}
                {selected.type === "container" && <ContainerStyle />}
                {selected.type === "text" && <TextStyle />}
                {selected.type === "image" && <ImageStyle />}
              </>
            )}
          </TabContent>
        </Tabs>
        <Add02Icon size={32} />
      </Sidebar>
    </div>
  )
}

export default OptionsPanel