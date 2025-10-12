"use client";

import ModalHtml from "@/components/modal-htlml";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import sendImage from "../actions/ai";
import { options } from "../utils/drawerOptions";
export function Toolbar() {
  const editor = useEditor();
  const [html, setHtml] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);


  async function handleSendImage() {
    try {
      // Check if we have any image
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) {
        console.debug("No shapes drawn");
        return;
      }
      const drawing = await editor.toImage([...shapeIds], { format: "jpeg" });
      const response = await sendImage(drawing);
      if(response.html) {
        setHtml(response.html);
        setOpen(true);
      }
    } catch (err: any) {
      throw new Error("error before sending image", err);
    }
  }
  return (
    <>
    <Button className="mr-1 my-4" style={{ pointerEvents: "all" }} onClick={handleSendImage}>
      Generate HTML
    </Button>
    <ModalHtml html={html} open={open} setOpen={setOpen} />
    </>
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
