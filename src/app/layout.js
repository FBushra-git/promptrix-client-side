import { Finlandica } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

const finlandica = Finlandica({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata = {
  title: 'Promptrix',
  description: 'Building my project',
  icons: {
    icon: "/logo.png", // Path to your file in the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${finlandica.className} bg-[#1a1a2e] text-white min-h-screen flex flex-col`}>
        <header className="p-6 border-b border-white/10">
          <Navbar></Navbar>
        </header>

        <main className="flex-grow">
          {children}
        </main>

       <Footer></Footer>
       <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1a2e",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#967bb6", // Lavender matching your button gradient
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}