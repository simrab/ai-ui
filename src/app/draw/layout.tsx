export default function DrawLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <h1> This is my draw canvas layout </h1>
      <div> {children} </div>
    </>
  );
}
