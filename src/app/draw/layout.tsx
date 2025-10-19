import { Suspense } from "react";

export default function DrawLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div> {children} </div>
    </Suspense>
  );
}
