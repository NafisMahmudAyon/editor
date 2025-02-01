'use client'
import useEditor from "@/context/editorContext";
import { Button } from "aspect-ui/Button";
import { Input } from "aspect-ui/Input";
import { Add02Icon } from "hugeicons-react";

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  const { page, name, slug, status, editorData, setEditorData, setPage, setPageId, setSlug, setStatus, setName, handleSave, responsive, setResponsive } = useEditor()
  return (
    <div className="max-h-screen flex flex-col overflow-hidden">
      <div className="w-full h-10 flex">
        <div>Aspect Editor</div>
        <div className="flex-1 flex justify-center items-center">
          <Input value={name} onChange={(e) => setName(e.target.value)} label="Page Name" wrapperClassName='flex items-center' />
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} label="Page Slug" wrapperClassName='flex items-center' />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <select value={responsive} onChange={(e) => setResponsive(e.target.value)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
        <div>
          <Button className='flex items-center gap-2' onClick={handleSave}><Add02Icon className='size-5' />Save Page</Button>
        </div>
      </div>
      <div className="h-[calc(100vh-(var(--spacing)_*_10))]">
        {children}
      </div>
    </div>
  )
}

export default EditorLayout