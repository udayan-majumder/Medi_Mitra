import { Geist, Geist_Mono, Poppins } from "next/font/google";
import Wrapper from "@/hooks/userauth.hooks";
import BackButtonHandler from "@/Components/BackButtonHandler";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // Specify the font weights you need
  subsets: ["latin"], // Specify the subset(s) you need
  variable: "--font-poppins", // Define a CSS variable for the font
}); 

export const metadata = {
  title: "Medi Mitra",
  description: "A Health Care Solutin For You",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <Wrapper>
            <BackButtonHandler />
            {children}
        </Wrapper>
      </body>
    </html>
  );
}



