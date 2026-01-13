import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type NoteVersion = {
  id: string;
  content: string;
  timestamp: number;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  versions: NoteVersion[];
};

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  addNote: () => void;
  updateNote: (id: string, content: string, title?: string) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string) => void;
  restoreVersion: (noteId: string, versionId: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,

      addNote: () => {
        const newNote: Note = {
          id: uuidv4(),
          title: "Untitled Note",
          content: "<p>Start typing...</p>",
          updatedAt: Date.now(),
          versions: [],
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id,
        }));
      },

      updateNote: (id, content, title) => {
        set((state) => {
          const updatedNotes = state.notes.map((note) => {
            if (note.id === id) {
              // Create a version snapshot if content changed significantly
              // (In real app, debounce this or do it on manual save)
              const newVersion: NoteVersion = {
                id: uuidv4(),
                content: note.content,
                timestamp: Date.now(),
              };

              // Limit versions to last 10 to save space
              const updatedVersions = [newVersion, ...note.versions].slice(
                0,
                10
              );

              return {
                ...note,
                content,
                title: title || note.title,
                updatedAt: Date.now(),
                versions:
                  content !== note.content ? updatedVersions : note.versions,
              };
            }
            return note;
          });
          return { notes: updatedNotes };
        });
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }));
      },

      setActiveNote: (id) => set({ activeNoteId: id }),

      restoreVersion: (noteId, versionId) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id === noteId) {
              const versionToRestore = note.versions.find(
                (v) => v.id === versionId
              );
              if (versionToRestore) {
                return {
                  ...note,
                  content: versionToRestore.content,
                  updatedAt: Date.now(),
                };
              }
            }
            return note;
          }),
        }));
      },
    }),
    {
      name: "collaborative-notes-storage",
    }
  )
);
