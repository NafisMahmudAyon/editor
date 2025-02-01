'use client'
import { Container } from '@/components/Blocks/Container';
import { Heading } from '@/components/Blocks/Heading';
import { Image } from '@/components/Blocks/Image';
import { Text } from '@/components/Blocks/Text';
import { EditorProvider } from '@/context/editorContext';
import { supabase } from '@/hooks/supabaseClient';
import { useUser } from '@clerk/nextjs';
import Script from 'next/script';
import { use, useEffect, useState } from 'react';

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const { user } = useUser();
  const { id } = use(params);
  console.log(id);
  const [page, setPage] = useState()
  const loadPage = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.log(error); return null; }
    console.log(data);
    setPage(data);
  }
  useEffect(() => {
    loadPage();
  }, [id, user]);
  const blocks = page?.page_data?.blocks
  return (
    <EditorProvider>
      <div>
        {blocks && blocks.map((block) => (
          <Tree key={block.id} block={block} />
        ))}

      </div>
      <Script src="https://unpkg.com/@tailwindcss/browser@4" />
    </EditorProvider>
  )
}

const Tree = ({ block }: { block: any }) => {
  if (!block) return null
  if (block.type === 'container') {
    return (
      <Container blockData={block} preview={true}>
        {block.children?.map((child: any) => (
          <Tree key={child.id} block={child} />
        ))}
      </Container>
    )
  }
  if (block.type === 'text') {
    return (
      <Text blockData={block} preview={true} />
    )
  }
  if (block.type === 'heading') {
    return (
      <Heading blockData={block} preview={true} />
    )
  }
  if (block.type === 'image') {
    return (
      <Image blockData={block} preview={true} />
    )
  }
  return null
}

export default Page