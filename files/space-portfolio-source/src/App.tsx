import { useCallback, useEffect, useState } from 'react';
import { SceneProvider } from './context/SceneContext';
import { SpaceScene } from './components/SpaceScene/SpaceScene';
import { HUD } from './components/HUD/HUD';
import { Navigation } from './components/Navigation/Navigation';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { MusicControl } from './components/MusicControl/MusicControl';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Skills } from './components/Skills/Skills';
import { Projects } from './components/Projects/Projects';
import { Experience } from './components/Experience/Experience';
import { Contact } from './components/Contact/Contact';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useSpaceAudio } from './hooks/useSpaceAudio';

function App() {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const reducedMotion = useReducedMotion();
  const { progress, activeSection } = useScrollProgress();
  const audio = useSpaceAudio('/audio/morning-light.mp3');

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [entered]);

  const handleEnter = useCallback(() => {
    audio.play();
    setExiting(true);
    window.setTimeout(() => setEntered(true), 750);
  }, [audio]);

  const handleExploreProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <SceneProvider
      reducedMotion={reducedMotion}
      getAmplitude={audio.getAmplitude}
      scrollProgressValue={progress}
    >
      <SpaceScene />
      <HUD />
      <Navigation active={activeSection} />
      <MusicControl isOn={audio.isOn} onToggle={audio.toggle} />

      <a href="#home" className="skip-link">Skip to content</a>

      <main className="content" id="main">
        <Hero onExploreProjects={handleExploreProjects} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {!entered && <LoadingScreen onEnter={handleEnter} exiting={exiting} />}
    </SceneProvider>
  );
}

export default App;
