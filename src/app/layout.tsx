
import NavBar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Suspense } from "react";
import { Loader } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

 export const metadata: Metadata = {
  title: {
    template: "%s | Electronic Health Record",
    absolute: "MedTrack",
  },
  description:
    "Electronic Health Record",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  


  return (
    <SessionProvider>
    <html lang="en">
      <body className={inter.className}>       
          <NavBar />          
          <Suspense fallback={<Loader />}>
          {children}
          </Suspense>
        
          <Toaster />        
      </body>
    </html>
    </SessionProvider>
  );
}