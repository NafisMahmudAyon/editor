'use client'
import useEditor from '@/context/editorContext'
import { Sidebar } from 'aspect-ui/Sidebar'
import { TabContent, TabItem, TabList, Tabs } from 'aspect-ui/Tabs'
import ListView from './ListView'
import { DefaultIcon } from './Icons'
import { Add02Icon } from 'hugeicons-react'

const OptionsPanel = () => {

  const { elementTemplates, setDraggedTemplate } = useEditor()

  return (
    <div>
      <Sidebar>
        <Tabs defaultActive="item-1">
          <TabList>
            <TabItem id="item-1">
              Elements
            </TabItem>
            <TabItem id="item-2">
              List
            </TabItem>
          </TabList>
          <TabContent id="item-1">
            <h1>Elements</h1>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {elementTemplates.map((template, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center flex-col gap-2 px-3 py-2 pt-4 bg-white border border-gray-200 rounded cursor-move hover:border-blue-500 hover:bg-blue-50"
                    draggable
                    onDragStart={() => setDraggedTemplate(template)}
                    onDragEnd={() => setDraggedTemplate(null)}>
                    {/* <Icon className="w-5 h-5 mr-2 text-gray-600" /> */}
                    {template.options?.editor?.icon ? <template.options.editor.icon className='size-5' /> : <DefaultIcon />}
                    <span>{template.label}</span>
                  </div>
                );
              })}
            </div>
          </TabContent>
          <TabContent id="item-2">
            <h1>List</h1>
            <ListView />
          </TabContent>
        </Tabs>
        <Add02Icon size={32} />
      </Sidebar>
    </div>
  )
}

export default OptionsPanel