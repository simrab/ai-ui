"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader } from "./ui/dialog";

type ModalProps = {
  html: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ModalHtml({ html, open, setOpen }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay>
        <DialogContent className="max-w-fit">
          <DialogHeader>
            <DialogTitle>HTML create</DialogTitle>
            <DialogDescription>
              HTML created from the image by Google Gemini
            </DialogDescription>
          </DialogHeader>
          {html ? (
            <div
              title="generate html"
              className="overflow-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          ) : (
            "No html produced yet..."
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
