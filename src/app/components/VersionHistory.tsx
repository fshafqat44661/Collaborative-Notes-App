import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
  Card,
  CardBody,
} from "@nextui-org/react";
import { format } from "date-fns";
import { Note, useNotesStore } from "@/app/store/useNotesStore";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  note: Note;
}

export const VersionHistory = ({ isOpen, onOpenChange, note }: Props) => {
  const restoreVersion = useNotesStore((state) => state.restoreVersion);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Version History</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {note.versions.length === 0 && (
                  <p className="text-default-500">
                    No previous versions available.
                  </p>
                )}

                {note.versions.map((version) => (
                  <Card key={version.id} className="border border-default-200">
                    <CardBody>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-small text-default-500">
                          {format(version.timestamp, "MMM d, yyyy HH:mm:ss")}
                        </span>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => {
                            restoreVersion(note.id, version.id);
                            onClose();
                          }}
                        >
                          Restore
                        </Button>
                      </div>
                      <div className="bg-default-100 p-2 rounded-md text-tiny max-h-20 overflow-hidden text-default-600">
                        {/* Strip HTML tags for preview */}
                        {version.content
                          .replace(/<[^>]+>/g, "")
                          .substring(0, 150)}
                        ...
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
