import Link from "next/link"
import { Mountain, Map, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50">
      {/* Global Technical Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <header className="px-4 lg:px-6 h-16 flex items-center border-b-2 border-black bg-white/80 backdrop-blur-sm relative z-10">
        <Link className="flex items-center justify-center group" href="#">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center transform -skew-x-12 mr-2 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
            <Mountain className="h-5 w-5 transform skew-x-12" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Route Mill</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 hover:text-yellow-600 transition-colors" href="#">
            Features
          </Link>
          <Link className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 hover:text-yellow-600 transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 hover:text-yellow-600 transition-colors" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none uppercase">
                  Track Your Climbs.<br/>Crush Your Projects.
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl font-mono text-xs uppercase tracking-widest mt-4">
                  // The ultimate companion for your climbing gym. View routes, log sends, and connect with the community.
                </p>
              </div>
              <div className="space-x-4 pt-8">
                <Link href="#">
                  <Button size="lg" variant="primary">Get Started</Button>
                </Link>
                <Link href="#">
                  <Button size="lg" variant="secondary">Learn more</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-100 border-t-2 border-black">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col items-center space-y-4 text-center p-8">
                <div className="p-4 bg-black text-white transform -skew-x-12">
                  <Map className="h-8 w-8 transform skew-x-12" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Interactive Gym Map</h2>
                <p className="text-slate-500 text-sm">
                  Visualize the gym layout and find routes on specific walls easily.
                </p>
              </Card>
              <Card className="flex flex-col items-center space-y-4 text-center p-8">
                <div className="p-4 bg-black text-white transform -skew-x-12">
                  <Trophy className="h-8 w-8 transform skew-x-12" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Track Progress</h2>
                <p className="text-slate-500 text-sm">
                  Log your sends, track your grades, and see your improvement over time.
                </p>
              </Card>
              <Card className="flex flex-col items-center space-y-4 text-center p-8">
                <div className="p-4 bg-black text-white transform -skew-x-12">
                  <Users className="h-8 w-8 transform skew-x-12" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Community Feed</h2>
                <p className="text-slate-500 text-sm">
                  See what others are climbing, share beta, and cheer each other on.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-black bg-white relative z-10">
        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">© 2024 Route Mill. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 font-mono uppercase tracking-widest" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 font-mono uppercase tracking-widest" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
