import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Globe, Target, Zap, Users, Trophy, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-40 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-400" />
            <span className="font-bold text-lg tracking-tight">WikiRace</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/lobby?mode=join">
              <Button variant="ghost" className="text-slate-400 hover:text-white text-sm">
                Join Game
              </Button>
            </Link>
            <Link href="/lobby?mode=solo">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white text-sm">
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <Badge variant="outline" className="border-violet-500/50 text-violet-300 bg-violet-500/10 mb-6">
          Wikipedia Navigation Game
        </Badge>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Navigate the
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Wikipedia
          </span>{' '}
          maze
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Start on one Wikipedia article. Reach the target article using only the links inside each page.
          No searching. No shortcuts. Pure knowledge and intuition.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/lobby?mode=solo">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-base font-semibold w-full sm:w-auto">
              Play Solo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/lobby?mode=create">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 h-12 text-base w-full sm:w-auto">
              Create Lobby
            </Button>
          </Link>
          <Link href="/lobby?mode=join">
            <Button size="lg" variant="ghost" className="text-slate-400 hover:text-white px-8 h-12 text-base w-full sm:w-auto">
              Join by Code
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">How it works</h2>
          <p className="text-slate-400">Three simple steps to start playing</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Get your articles',
              desc: "You're given a start Wikipedia article and a target article to reach.",
              icon: Globe,
              color: 'text-violet-400',
              bg: 'bg-violet-500/10',
            },
            {
              step: '02',
              title: 'Click through links',
              desc: 'Navigate by clicking links inside each article. No search bar allowed.',
              icon: Target,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              step: '03',
              title: 'Reach the target',
              desc: 'The faster you reach the target with fewer clicks, the better your score.',
              icon: Trophy,
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
            },
          ].map((item) => (
            <div key={item.step} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="text-xs text-slate-600 font-mono font-bold mb-2">{item.step}</div>
              <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Real-time stats',
              desc: 'Track your clicks, time, and full navigation path as you play.',
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
            },
            {
              icon: Users,
              title: 'Multiplayer ready',
              desc: 'Create private lobbies and compete with friends in real time.',
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              icon: Shield,
              title: 'Fair play',
              desc: 'No Ctrl+F, no search. Pure link navigation with anti-cheat built in.',
              color: 'text-red-400',
              bg: 'bg-red-500/10',
            },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 p-5 bg-slate-900/30 rounded-2xl border border-slate-800">
              <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center text-slate-600 text-sm">
        <p>WikiRace — A Wikipedia navigation game. Not affiliated with Wikipedia.</p>
      </footer>
    </div>
  );
}
