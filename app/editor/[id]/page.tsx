'use client';
import LeftBar from '@/components/LeftBar';
import MainContent from '@/components/MainContent';
import OptionsPanel from '@/components/OptionsPanel';
import useEditor, { EditorProvider } from '@/context/editorContext';
import { Poppins } from 'next/font/google';
import Script from 'next/script'
import { use, useEffect } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const Page = ({params}: {params: Promise<{id: number}>}) => {

  const { id } = use(params);
  console.log( id);
  const {pageId, setPageId} = useEditor()

  useEffect(() => {
    setPageId(id);
  }, [id]);

  return (
    <>
      <div className={`flex h-full justify-between ${poppins.className}`}>
        <LeftBar />
        <MainContent />
        <OptionsPanel />
      </div>
      <Script src="https://unpkg.com/@tailwindcss/browser@4" />
      {/* <Script src="https://cdn.tailwindcss.com/3.4.16" /> */}
    </>
  );
};

export default Page;
