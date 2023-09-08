import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="h-2 w-2 bg-primary"></div>
    </main>
  )
}
