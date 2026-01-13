"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { TiptapEditor } from "@/app/components/TiptapEditor";
import { useNotesStore } from "@/app/store/useNotesStore";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { History, Share2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { VersionHistory } from "@/app/components/VersionHistory";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { notes, activeNoteId, updateNote } = useNotesStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 1. Add mounted state
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "collaborative-notes-storage") {
        useNotesStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 2. Only find the active note if mounted
  const activeNote = isMounted
    ? notes.find((n) => n.id === activeNoteId)
    : null;

  const handleTitleChange = (val: string) => {
    if (activeNote) {
      updateNote(activeNote.id, activeNote.content, val);
    }
  };

  const handleContentChange = (content: string) => {
    if (activeNote) {
      updateNote(activeNote.id, content, activeNote.title);
    }
  };

  // 3. If not mounted, render a loading state or just the structure (optional)
  if (!isMounted) {
    return (
      <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        <Sidebar />
        <section className="flex-1 flex items-center justify-center">
          {/* Optional: Add a Spinner here if you want */}
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />

      <section className="flex-1 flex flex-col h-full relative">
        {activeNote ? (
          <>
            <div className="h-20 border-b border-default-200 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-30">
              <div className="flex-1 max-w-xl">
                <Input
                  value={activeNote.title}
                  onValueChange={handleTitleChange}
                  variant="flat"
                  placeholder="Note Title"
                  size="lg"
                  classNames={{
                    input: "text-2xl font-extrabold tracking-tight",
                    inputWrapper:
                      "bg-transparent hover:bg-default-100/50 transition-colors px-2",
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-4">
                  <span className="text-[10px] text-default-400 uppercase tracking-widest font-bold">
                    Last edited
                  </span>
                  <span className="text-xs font-medium">
                    {formatDistanceToNow(activeNote.updatedAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <Button
                  variant="flat"
                  size="sm"
                  isIconOnly
                  className="rounded-xl border border-default-200"
                  onPress={onOpen}
                >
                  <History size={18} />
                </Button>
                <Button
                  color="primary"
                  variant="shadow"
                  size="sm"
                  startContent={<Share2 size={18} />}
                  className="rounded-xl font-semibold"
                >
                  Share
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TiptapEditor
                key={activeNote.id}
                content={activeNote.content}
                onChange={handleContentChange}
              />
            </div>

            <VersionHistory
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              note={activeNote}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-default-400 flex-col gap-6 p-10 bg-grid-slate-100/[0.05]">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Plus size={32} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-default-800 tracking-tight">
                No Note Selected
              </h2>
              <p className="text-default-400 max-w-xs mx-auto">
                Create a new note to start capturing your thoughts or select an
                existing one from the sidebar.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
