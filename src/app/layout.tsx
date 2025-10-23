
import MiEncabezado from '../Components/header';
import '../app/globals.css'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body>
         <MiEncabezado />
        {children}
      </body>
    </html>
  );
}
