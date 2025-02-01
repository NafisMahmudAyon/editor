import EditorLayout from "@/components/EditorLayout";
import { EditorProvider } from "@/context/editorContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <EditorProvider>
      <EditorLayout>{children}</EditorLayout>
    </EditorProvider>
  );
}