"use client";

import LeftBar from '@/components/LeftBar';
import MainContent from '@/components/MainContent';
import OptionsPanel from '@/components/OptionsPanel';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import useEditor from '@/context/editorContext';
import { useEffect } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const Page = () => {
  const router = useRouter();
  console.log(router)
  const { pageId } = useEditor();

  // useEffect(() => {
  //   setPageId(null);
  // }, [setPageId]);

  useEffect(() => {
    if (pageId) {
      router.push(`/editor/${pageId}`);
    }
  }, [pageId, router]);

  return (
    <>
      <div className={`flex h-full justify-between ${poppins.className}`}>
        <LeftBar />
        <MainContent />
        <OptionsPanel />
      </div>
      <Script src="https://unpkg.com/@tailwindcss/browser@4" />
    </>
  );
};

export default Page;