"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";

const CoverImageModal = () => {
  const { isOpen, onClose } = useCoverImage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <div>Upload Image</div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImageModal;
