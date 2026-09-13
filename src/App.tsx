import { useState } from 'react'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import SmoothScroll from './components/SmoothScroll'
import WhatsAppFab from './components/WhatsAppFab'
import { ScrollProgress } from './components/primitives'
import About from './sections/About'
import AISection from './sections/AISection'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Ongoing from './sections/Ongoing'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

export default function App() {
  const [, setReady] = useState(false)

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Nav />

      <a
        href="#accueil"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-void"
      >
        Aller au contenu
      </a>

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <AISection />
        <Projects />
        <Ongoing />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  )
}
