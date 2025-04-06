import "@/styles/globals.css";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="w-screen min-h-screen flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
