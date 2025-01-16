import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "@/public/styles/main.scss";
import StoreContextProvider from "@/components/context/StoreContext";
import { ToastContainer } from "react-toastify";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--inter",
  fallback: [
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Ubuntu",
    "Fira Sans",
    "Arial",
    "sans-serif",
  ],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--poppins",
  fallback: [
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Ubuntu",
    "Fira Sans",
    "Arial",
    "sans-serif",
  ],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--mont",
  fallback: [
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Ubuntu",
    "Fira Sans",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Deekshant | Portfolio React NextJs",
  description: "Portfolio React NextJs",
  keywords: [
    "Javascript",
    "Typescript",
    "React",
    "nextjs",
  ],
  authors: [
    {
      name: "Deekshant",
      url: "https://portfoliosite-txqj.onrender.com/",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" ></script>
      <link rel="icon" href="/uploads/favicon.png" sizes="any" />
      <StoreContextProvider>
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`}
      >
        {children}
        <ToastContainer/>
      </body>
      </StoreContextProvider>
    </html>
  );
}
