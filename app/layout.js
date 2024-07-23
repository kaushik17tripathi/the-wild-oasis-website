import Logo from "@/app/_components/Logo"  //import aliases here @ represents the root of the project
import Navigation from "@/app/_components/Navigation"
import "@/app/_styles/globals.css"
import { Josefin_Sans } from "next/font/google"
import Header from "./_components/Header"
import { ReservationProvider } from "./_components/ReservationContext"

const josefin = Josefin_Sans({//improves performance as font don't need to be downloaded from google server but from the local server
  subsets: ['latin'],//latin characters
  display: 'swap',//until the font is loaded, the browser will use a fallback font
})

export const metadata = {
  // title: 'The Wild Oasis',
  title: {
    template: '%s - The Wild Oasis', // %s will be replaced with the title of the page
    default: 'Welcome / The Wild Oasis'
  },
  description: "Luxurious cabin hotel located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
}

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title.default}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col `}>
        <Header />
        <div className="flex-1 px-8 py-12 grid ">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>
              {children}
            </ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
