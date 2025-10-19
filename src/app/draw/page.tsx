"use client";

import { Toolbar } from "@/components/toolbar/Toolbar";
import { options } from "@/lib/drawerOptions";
import { Suspense } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function DrawPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>  
      <div className="fixed inset-0">
        <Tldraw
          components={{
            SharePanel: Toolbar
          }}
          {...options}
        ></Tldraw>
      </div>
    </Suspense>
  );
}
