import convertImageToHtml from "@/app/actions/ai";
import { useTransition } from "react";
import { useEditor } from "tldraw";
import { Button } from "../ui/button";

export function Toolbar() {
  const [isPending, transition] = useTransition();
  const editor = useEditor();

  function handleConvertImageToHtml() {
    transition(async () => convertImageToHtmlAction());
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
        transition(() => openHtmlInNewTab(response.html));
      }
    } catch (err: unknown) {
      console.error("Error before sending image:", err);
      throw new Error("error before sending image");
    }
  }

  function openHtmlInNewTab(html: string | null) {
    if (!html) {
      console.error("No HTML content to display");
      return;
    }
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated HTML</title>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `);
      newWindow.document.close();
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
    </>
  );
}
