import { lazy, Suspense } from 'react';
import BrandSymbol from './components/BrandSymbol';
import Capabilities from './components/Capabilities';
import HowWeBuild from './components/HowWeBuild';
import Navigation from './components/Navigation';
import Reveal from './components/Reveal';
import ChatAssistant from './features/assistant/ChatAssistant';
import DiscoveryFlow from './features/discovery/DiscoveryFlow';
import ExperienceLab from './features/lab/ExperienceLab';
import SelectedExperiments from './features/work/SelectedExperiments';
import { EnvironmentProvider } from './environment/EnvironmentProvider';

const EnvironmentStage = lazy(() => import('./environment/EnvironmentStage'));

function AppContent() {
  return (
    <>
      <Suspense fallback={<div className="environment-stage environment-stage--loading" aria-hidden="true"><div className="environment-vignette" /></div>}>
        <EnvironmentStage />
      </Suspense>
      <div className="site-content">
        <Navigation />
        <main>
          <section className="hero section-shell immersive-hero" id="home" data-environment="entry" aria-labelledby="hero-title">
            <div className="hero-atmosphere" aria-hidden="true" />
            <div className="hero-grid page-container">
              <div className="hero-copy">
                <Reveal>
                  <p className="eyebrow hero-eyebrow"><span className="signal-dot" /> NOVA AI STUDIO <i>/</i> INDEPENDENT CREATIVE TECHNOLOGY</p>
                  <h1 id="hero-title">We build<br /><span className="hero-line-two">digital <em>experiences</em></span><br />that <i>think.</i></h1>
                  <p className="hero-description">AI-powered websites and digital experiences designed to help modern businesses stand out, connect, and grow.</p>
                  <div className="hero-actions">
                    <a className="button button--acid" href="#capabilities">Explore our capabilities <span aria-hidden="true">↘</span></a>
                    <a className="button button--quiet" href="#assistant"><span className="button-play" aria-hidden="true">↗</span> Talk to our AI</a>
                  </div>
                </Reveal>
                <div className="hero-footnote"><span>INDEPENDENT CREATIVE TECHNOLOGY STUDIO</span><span>DESIGNING FOR WHAT'S NEXT</span></div>
              </div>
              <div className="hero-coordinate" aria-hidden="true"><span>01 / SYSTEM ENTRY</span><i /><span>HUMAN-CENTERED INTELLIGENCE</span></div>
            </div>
            <div className="hero-baseline page-container"><span>SCROLL TO ENTER</span><span className="baseline-line"><i /></span><span className="hero-baseline__right">A DIGITAL ENVIRONMENT BY NOVA <i>↓</i></span></div>
          </section>

          <section className="principle-strip" data-environment="entry" aria-label="NOVA studio disciplines">
            <div className="page-container principle-strip__inner"><span>STRATEGY</span><i>✳</i><span>DESIGN</span><i>✳</i><span>INTERACTION</span><i>✳</i><span>INTELLIGENCE</span><i>✳</i><span>EXPERIENCE</span><span className="principle-strip__note">MADE TO WORK / MADE TO FEEL</span></div>
          </section>

          <section className="section section-shell capabilities-section" id="capabilities" data-environment="capabilities" aria-labelledby="capabilities-title">
            <div className="page-container">
              <div className="section-heading section-heading--split">
                <Reveal><p className="eyebrow section-index"><span>01</span> / WHAT WE MAKE</p></Reveal>
                <Reveal delay={70}><div className="section-heading__copy"><h2 id="capabilities-title">Systems designed<br />to make people <em>feel.</em></h2><p>Where considered design meets useful technology. Every part of the experience has a reason to be there.</p></div></Reveal>
              </div>
              <Reveal className="capability-list-reveal" delay={120}><Capabilities /></Reveal>
            </div>
          </section>

          <section className="section section-shell assistant-section" id="assistant" data-environment="assistant" aria-labelledby="assistant-title">
            <div className="assistant-backdrop-grid" aria-hidden="true" />
            <div className="page-container assistant-layout">
              <div className="assistant-copy">
                <Reveal>
                  <p className="eyebrow section-index"><span>02</span> / A BETTER FIRST QUESTION</p>
                  <h2 id="assistant-title">A useful conversation beats <em>another form.</em></h2>
                  <p className="section-body">Meet NOVA AI, a first-pass business guide. Tell it what you’re working on and see how a thoughtful assistant can turn a vague idea into a sharper next step.</p>
                  <div className="assistant-notes"><span><i>01</i> Context-aware conversation</span><span><i>02</i> Designed around real business needs</span><span><i>03</i> A clear path to a human</span></div>
                  <span className="prototype-disclaimer"><i /> A working prototype · responses are generated locally</span>
                </Reveal>
              </div>
              <Reveal className="chat-panel-reveal" delay={100}><ChatAssistant /></Reveal>
            </div>
          </section>

          <section className="section section-shell discovery-section" id="discovery" data-environment="discovery" aria-labelledby="discovery-title">
            <div className="page-container discovery-layout">
              <div className="discovery-intro">
                <Reveal>
                  <p className="eyebrow section-index"><span>03</span> / FIND YOUR DIRECTION</p>
                  <h2 id="discovery-title">The right website starts with <em>the right questions.</em></h2>
                  <p className="section-body">A small discovery tool for a big first decision. Share a little about your business and get a tailored experience direction you can actually build on.</p>
                  <div className="discovery-trust"><span className="discovery-trust-icon">✳</span><span><strong>Not a generic template.</strong><small>A recommendation shaped around your goals.</small></span></div>
                  <div className="discovery-index-mark" aria-hidden="true">N / 03</div>
                </Reveal>
              </div>
              <Reveal className="discovery-form-reveal" delay={100}><DiscoveryFlow /></Reveal>
            </div>
          </section>

          <section className="section section-shell process-section" id="process" data-environment="process" aria-labelledby="process-title">
            <div className="page-container">
              <div className="section-heading section-heading--split section-heading--process">
                <Reveal><p className="eyebrow section-index"><span>04</span> / HOW WE BUILD</p></Reveal>
                <Reveal delay={70}><div className="section-heading__copy"><h2 id="process-title">Good digital experiences aren't <em>accidents.</em></h2><p>Four clear steps. One thoughtful team. A process that leaves room for the unexpected.</p></div></Reveal>
              </div>
              <Reveal delay={120}><HowWeBuild /></Reveal>
            </div>
          </section>

          <section className="section section-shell lab-section" id="ai-lab" data-environment="ai-lab" aria-labelledby="lab-title">
            <div className="lab-backdrop-mark" aria-hidden="true">AI</div>
            <div className="page-container">
              <div className="lab-heading">
                <Reveal><p className="eyebrow section-index"><span>05</span> / THE EXPERIMENTAL SIDE</p></Reveal>
                <Reveal delay={70}><div className="lab-heading__row"><h2 id="lab-title"><span>AI</span> LAB</h2><p>Intelligence is better<br />when it’s <em>doing something.</em></p></div></Reveal>
              </div>
              <Reveal delay={120}><ExperienceLab /></Reveal>
              <div className="lab-footnote"><span>EXPERIMENTAL BY NATURE / USEFUL BY DESIGN</span><span>INTERACT WITH THE CONCEPTS ABOVE <i>↑</i></span></div>
            </div>
          </section>

          <section className="section section-shell work-section" id="work" data-environment="work" aria-labelledby="work-title">
            <div className="page-container">
              <div className="section-heading section-heading--split work-heading">
                <Reveal><p className="eyebrow section-index"><span>06</span> / SELECTED EXPERIMENTS</p></Reveal>
                <Reveal delay={70}><div className="section-heading__copy"><h2 id="work-title">Ideas made <em>tangible.</em></h2><p>Self-initiated concepts exploring what design and intelligent technology can make possible.</p></div></Reveal>
              </div>
              <Reveal delay={120}><SelectedExperiments /></Reveal>
              <p className="work-disclaimer"><span>✳</span> These are concept projects created for exploration—not commissioned client work.</p>
            </div>
          </section>

          <section className="section section-shell about-section" id="about" data-environment="about" aria-labelledby="about-title">
            <div className="page-container about-layout">
              <Reveal className="about-title-wrap"><p className="eyebrow section-index"><span>07</span> / A LITTLE ABOUT US</p><h2 id="about-title">Technology should feel <em>human.</em></h2></Reveal>
              <Reveal className="about-copy" delay={100}><div className="about-symbol" aria-hidden="true"><span /><i /><b /></div><p>We’re a small creative technology studio combining design, interaction, and artificial intelligence to make digital experiences that are not only beautiful, but genuinely useful.</p><a href="#contact" className="text-link">A little more about our approach <span>↗</span></a></Reveal>
            </div>
          </section>

          <section className="section section-shell contact-section" id="contact" data-environment="contact" aria-labelledby="contact-title">
            <div className="page-container contact-content">
              <Reveal><p className="eyebrow"><span className="signal-dot" /> THE NEXT THING STARTS HERE</p><h2 id="contact-title">Have an idea<br />worth <em>building?</em></h2><p>Let’s turn it into an intelligent digital experience.</p><div className="contact-actions"><a href="mailto:hello@nova.studio?subject=Let%27s%20build%20something" className="button button--acid">Start a project <span aria-hidden="true">↗</span></a><a href="#assistant" className="button button--quiet"><span className="button-play" aria-hidden="true">↗</span> Talk to NOVA AI</a></div></Reveal>
              <div className="contact-aside"><span>GOOD IDEAS START WITH A HELLO.</span><a href="mailto:hello@nova.studio">HELLO@NOVA.STUDIO ↗</a></div>
            </div>
          </section>
        </main>

        <footer className="site-footer" data-environment="contact">
          <div className="page-container">
            <div className="footer-top">
              <a className="brand-lockup footer-brand" href="#home"><BrandSymbol /><span className="brand-wordmark">NOVA<span>AI STUDIO</span></span></a>
              <p>AI × DESIGN × EXPERIENCE<br /><span>DALLAS, TX&nbsp; · &nbsp;WORKING EVERYWHERE</span></p>
              <a className="footer-email" href="mailto:hello@nova.studio">HELLO@NOVA.STUDIO <span>↗</span></a>
            </div>
            <div className="footer-bottom">
              <span>© 2026 NOVA AI STUDIO <i>·</i> CONCEPT SITE / PORTFOLIO SERIES 01</span>
              <nav aria-label="Footer navigation"><a href="#work">Work</a><a href="#capabilities">Capabilities</a><a href="#ai-lab">AI Lab</a><a href="#about">About</a></nav>
              <div className="footer-socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default function App() {
  return <EnvironmentProvider><AppContent /></EnvironmentProvider>;
}
