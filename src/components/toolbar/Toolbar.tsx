import convertImageToHtml from "@/app/actions/ai";
import { useState, useTransition } from "react";
import { useEditor } from "tldraw";
import ModalHtml from "../modal-htlml";
import { Button } from "../ui/button";

export function Toolbar() {
  const [html, setHtml] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [isPending, transition] = useTransition();
  const editor = useEditor();

  function handleConvertImageToHtml() {
    transition(async () => 
      convertImageToHtmlAction()
    );
  }

  async function convertImageToHtmlAction() {
    try {
      // Check if we have any image
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) {
        console.debug("No shapes drawn");
        return;
      }
      const drawing = await editor.toImage([...shapeIds], { format: "jpeg" });
      const response = await convertImageToHtml(drawing);
      if (response.html) {
        setHtml(response.html);
        setOpen(true);
      }
    } catch (err: any) {
      throw new Error("error before sending image", err);
    }
  }

  return (
    <>
      {isPending === true && (
        <div className="flex justify-center items-center fixed left-0 top-0 w-full h-full p-2 bg-white rounded shadow">
          Processing...
        </div>
      )}

      <Button
        className="mr-1 my-4"
        style={{ pointerEvents: "all" }}
        onClick={handleConvertImageToHtml}
      >
        Generate HTML
      </Button>
      <ModalHtml html={html} open={isOpen} setOpen={setOpen} />
    </>
  );
}
