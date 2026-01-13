"use client";
import { Input, Button } from "@nextui-org/react";
import { useNotesStore } from "@/app/store/useNotesStore";
import { Plus, Trash2, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react"; // Import useEffect
import classNames from "classnames";

export const Sidebar = () => {
  const { notes, activeNoteId, setActiveNote, addNote, deleteNote } =
    useNotesStore();
  const [search, setSearch] = useState("");

  // 1. Add a mounted state
  const [isMounted, setIsMounted] = useState(false);

  // 2. Set mounted to true only after the component loads on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Prevent hydration mismatch by using empty array until mounted
  // If we are not mounted yet, we pretend we have no notes (matches server)
  const safeNotes = isMounted ? notes : [];

  const filteredNotes = safeNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 h-full border-r border-default-200 flex flex-col bg-[#fdfdfd] dark:bg-[#0c0c0c]">
      <div className="p-6 pb-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Notes
          </h1>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            radius="full"
            onClick={addNote}
            className="bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/10"
          >
            <Plus size={20} />
          </Button>
        </div>
        <Input
          placeholder="Search notes..."
          startContent={<Search size={16} className="text-default-400" />}
          size="sm"
          variant="flat"
          radius="full"
          fullWidth
          value={search}
          onValueChange={setSearch}
          classNames={{
            input: "text-sm",
            inputWrapper:
              "bg-default-100 dark:bg-default-50/50 hover:bg-default-200 dark:hover:bg-default-100 transition-all border-none shadow-inner",
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setActiveNote(note.id)}
            className={classNames(
              "group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 ease-in-out",
              activeNoteId === note.id
                ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                : "hover:bg-default-100 active:scale-[0.98]"
            )}
          >
            <div className="flex justify-between items-start gap-2">
              <h3
                className={classNames(
                  "font-semibold text-sm truncate flex-1",
                  activeNoteId === note.id ? "text-white" : "text-default-700"
                )}
              >
                {note.title || "Untitled Note"}
              </h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className={classNames(
                  "opacity-0 group-hover:opacity-100 transition-opacity min-w-unit-6 w-6 h-6 rounded-lg",
                  activeNoteId === note.id
                    ? "text-white/80 hover:text-white hover:bg-white/20"
                    : "text-danger hover:bg-danger/10"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            <p
              className={classNames(
                "text-xs mt-1 transition-opacity",
                activeNoteId === note.id ? "text-white/70" : "text-default-400"
              )}
            >
              {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
            </p>

            {/* Content snippet */}
            <p
              className={classNames(
                "text-[10px] line-clamp-1 mt-2",
                activeNoteId === note.id ? "text-white/50" : "text-default-300"
              )}
            >
              {note.content.replace(/<[^>]*>/g, "") || "No additional text"}
            </p>
          </div>
        ))}

        {isMounted && filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center mb-4 text-default-300">
              <Search size={24} />
            </div>
            <p className="text-default-400 text-sm">No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};
