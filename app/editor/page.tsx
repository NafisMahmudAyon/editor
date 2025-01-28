import LeftBar from '@/components/LeftBar';
import MainContent from '@/components/MainContent';
import { EditorProvider } from '@/context/editorContext';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const Page = () => {
  return (
    <EditorProvider>
      <div className={`flex h-screen justify-between ${poppins.className}`}>
        <LeftBar />
        <MainContent />
      </div>
    </EditorProvider>
  );
};

export default Page;
