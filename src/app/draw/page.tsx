"use client";

import { getSnapshot, Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { options } from "../utils/drawerOptions";
import sendImage from "../actions/ai";

export function Toolbar() {
  const editor = useEditor();

  async function handleSendImage() {
    try {
      // Check if we have any image
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) {
        console.debug("No shapes drawn");
        return;
      }
      const drawing = await editor.toImage([...shapeIds], { format: "jpeg" });
      await sendImage(drawing);
    } catch (err: any) {
      throw new Error("error before sending image", err);
    }
  }
  return (
    <button style={{ pointerEvents: "all" }} onClick={handleSendImage}>
      Send image
    </button>
  );
}

export default function DrawPage() {
  return (
    <div className="fixed inset-0">
      <Tldraw
        components={{
          SharePanel: Toolbar,
        }}
        {...options}
      ></Tldraw>
    </div>
  );
}
