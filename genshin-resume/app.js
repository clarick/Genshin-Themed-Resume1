const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.opacity = Math.random() * 0.7 + 0.3;
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(211, 188, 142, ${this.opacity})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#d3bc8e';
    ctx.fill();
  }
}

const particles = Array.from({ length: 90 }, () => new Particle());

class AmbientOrb {
  constructor() {
    this.reset(true);
  }
  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 40;
    this.r = Math.random() * 80 + 40;
    this.speedY = Math.random() * 0.25 + 0.08;
    this.speedX = Math.random() * 0.15 - 0.075;
    this.alpha = Math.random() * 0.06 + 0.02;
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < -this.r) this.reset();
  }
  draw() {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0, `rgba(211, 188, 142, ${this.alpha})`);
    g.addColorStop(1, 'rgba(211, 188, 142, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ambientOrbs = Array.from({ length: 8 }, () => new AmbientOrb());

function animateBackground() {
  ctx.clearRect(0, 0, width, height);
  ambientOrbs.forEach((o) => {
    o.update();
    o.draw();
  });
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateBackground);
}
animateBackground();

const cinematicFlash = document.getElementById('cinematic-flash');
const enterBurst = document.getElementById('enter-burst');
const panelHeaderLine = document.getElementById('panel-header-line');
const contentPanel = document.getElementById('content-panel');
const panelShimmer = document.querySelector('.panel-shimmer');
const startShimmer = document.querySelector('.start-shimmer');

function playCinematicFlash() {
  gsap.fromTo(
    cinematicFlash,
    { opacity: 0 },
    { opacity: 1, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 0.02 }
  );
}

function playEnterBurst() {
  enterBurst.innerHTML = '';
  for (let i = 0; i < 3; i += 1) {
    const ring = document.createElement('div');
    ring.className = 'burst-ring';
    enterBurst.appendChild(ring);
    gsap.fromTo(
      ring,
      { scale: 0.2, opacity: 0.7, rotate: i * 15 },
      {
        scale: 2.8 + i * 0.4,
        opacity: 0,
        rotate: i * 15 + 45,
        duration: 1.1,
        delay: i * 0.12,
        ease: 'power2.out',
      }
    );
  }
}

function animatePanelHeaderLine() {
  gsap.fromTo(panelHeaderLine, { scaleX: 0, opacity: 0.3 }, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power3.out' });
}

function runPanelShimmer() {
  if (!panelShimmer) return;
  gsap.fromTo(panelShimmer, { xPercent: -120 }, { xPercent: 120, duration: 1.4, ease: 'power2.inOut' });
}

function animateSkillBars(root) {
  root.querySelectorAll('.skill-bar-fill[data-progress]').forEach((bar) => {
    const target = `${bar.dataset.progress}%`;
    gsap.fromTo(bar, { width: '0%' }, { width: target, duration: 1.1, ease: 'power3.out', delay: 0.15 });
  });
}

function animateSectionContent(root) {
  const blocks = root.querySelectorAll(
    '.content-block, .stat-card, .talent-row, .quest-card, .edu-entry, .attr-grid li, .ref-card, .contact-chip, .character-portrait, .certification-block'
  );
  gsap.fromTo(
    blocks,
    { opacity: 0, y: 22, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      stagger: 0.06,
      ease: 'power3.out',
      clearProps: 'transform',
    }
  );

  const portrait = root.querySelector('.portrait-frame');
  if (portrait) {
    gsap.fromTo(
      portrait,
      { scale: 0.85, opacity: 0, rotate: -4 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.75, ease: 'back.out(1.6)' }
    );
  }

  animateSkillBars(root);
  animatePanelHeaderLine();
  runPanelShimmer();
}

function playStartIntro() {
  gsap.set('.intro-piece', { opacity: 0, y: 24 });
  gsap.set('.start-frame', { scale: 0.92, opacity: 0 });

  gsap
    .timeline({ delay: 0.2 })
    .to('.start-frame', { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' })
    .to(
      '.intro-piece',
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' },
      '-=0.55'
    );

  if (startShimmer) {
    gsap.set(startShimmer, { xPercent: -120 });
    gsap.to(startShimmer, {
      xPercent: 320,
      duration: 2.2,
      ease: 'power2.inOut',
      repeat: -1,
      repeatDelay: 3,
    });
  }

  gsap.to('#btn-start', {
    boxShadow: '0 0 28px rgba(211, 188, 142, 0.85)',
    duration: 1.2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
}

playStartIntro();

// Simple path avoids en-dash / special chars in the long filename on disk
const ENTRANCE_THEME_SRC = 'sound/entrance-theme.mp3';

const THEME_VOLUME = 0.45;
const THEME_FADE_IN = 2.4;
const THEME_FADE_OUT = 1.6;

let themeFadeTween = null;
let themeStarted = false;
let themeMuted = false;
let themeReady = false;

const entranceTheme = new Howl({
  src: [ENTRANCE_THEME_SRC],
  loop: true,
  volume: 0,
  html5: true,
  preload: true,
  onload: () => {
    themeReady = true;
  },
  onloaderror: () => {
    themeReady = false;
    if (musicHint) {
      musicHint.textContent =
        'Theme file missing or blocked. Open the site with Live Server (http://), not file://.';
      musicHint.classList.add('music-hint--error');
    }
  },
  onplayerror: () => {
    entranceTheme.once('unlock', () => playEntranceTheme());
  },
});

const sfxClick = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
  volume: 0.45,
});
const sfxClose = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
  volume: 0.35,
});

const btnMusic = document.getElementById('btn-music');
const musicHint = document.getElementById('music-hint');

function setMusicUi(playing) {
  if (!btnMusic) return;
  btnMusic.classList.toggle('is-playing', playing);
  btnMusic.setAttribute('aria-pressed', playing ? 'true' : 'false');
  btnMusic.setAttribute('aria-label', playing ? 'Mute entrance theme' : 'Play entrance theme');
  if (musicHint) {
    musicHint.textContent = playing
      ? 'Genshin Impact Main Theme · Orchestral Arrangement'
      : 'Tap Theme or anywhere to play the entrance song';
    musicHint.classList.toggle('is-active', playing);
  }
}

function fadeThemeVolume(toVolume, duration, onComplete) {
  if (themeFadeTween) themeFadeTween.kill();
  const state = { vol: entranceTheme.volume() };
  themeFadeTween = gsap.to(state, {
    vol: toVolume,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => entranceTheme.volume(state.vol),
    onComplete: () => {
      themeFadeTween = null;
      if (onComplete) onComplete();
    },
  });
}

function beginThemePlayback() {
  const playId = entranceTheme.play();
  if (playId === undefined) {
    return false;
  }
  themeStarted = true;
  fadeThemeVolume(THEME_VOLUME, THEME_FADE_IN);
  setMusicUi(true);
  return true;
}

function playEntranceTheme() {
  if (themeMuted) return;

  if (themeReady) {
    if (!entranceTheme.playing()) {
      beginThemePlayback();
    } else {
      fadeThemeVolume(THEME_VOLUME, THEME_FADE_IN);
      setMusicUi(true);
    }
    return;
  }

  entranceTheme.once('load', () => {
    themeReady = true;
    beginThemePlayback();
  });
  entranceTheme.load();
}

function playEntranceThemeFromGesture() {
  entranceTheme.once('unlock', () => playEntranceTheme());
  playEntranceTheme();
}

function pauseEntranceTheme(onComplete) {
  fadeThemeVolume(0, THEME_FADE_OUT, () => {
    entranceTheme.pause();
    setMusicUi(false);
    if (onComplete) onComplete();
  });
}

function resumeEntranceThemeIfAllowed() {
  if (themeMuted || !themeStarted) return;
  playEntranceTheme();
}

function toggleEntranceTheme() {
  if (entranceTheme.playing() && entranceTheme.volume() > 0.01 && !themeMuted) {
    themeMuted = true;
    pauseEntranceTheme();
    return;
  }
  themeMuted = false;
  playEntranceThemeFromGesture();
}

function unlockEntranceAudioOnce() {
  if (themeMuted) return;
  if (themeStarted && entranceTheme.playing()) return;
  playEntranceThemeFromGesture();
}

const startBtn = document.getElementById('btn-start');
const backBtn = document.getElementById('btn-back');
const startScreen = document.getElementById('start-screen');
const mainUI = document.getElementById('main-ui');
const panelBody = document.getElementById('panel-body');
const panelTitle = document.getElementById('panel-title');
const menuItems = document.querySelectorAll('.menu-item');

if (btnMusic) {
  btnMusic.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEntranceTheme();
  });
}

if (startScreen) {
  startScreen.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#btn-start, #btn-music')) return;
    unlockEntranceAudioOnce();
  });
}

startBtn.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
});

const PROFILE_PHOTO = 'images/profile.png';

const sectionTitles = {
  profile: 'Character · Profile',
  talents: 'Talents · Skills',
  quests: 'Quest Log · Experience',
  education: 'Chronicles · Education',
  attributes: 'Attributes · Details',
  wish: 'Contact · References',
};

const resumeData = {
  profile: `
    <div class="profile-sheet">
      <div class="character-portrait">
        <div class="portrait-frame">
          <img src="${PROFILE_PHOTO}" alt="Clarick John S. Cascaño" class="portrait-img" />
        </div>
        <p class="portrait-name">Clarick John S. Cascaño</p>
        <span class="vision-badge">IT Vision</span>
      </div>
      <div class="profile-details">
        <div class="content-block">
          <h3>Adventurer Profile</h3>
          <p>Undergraduate pursuing a <strong>Bachelor of Science in Information Technology (BSIT)</strong> at Northern Samar Colleges. Builds foundation in web development, database handling, computer troubleshooting, and basic graphic design—with a strong drive to learn and grow in professional IT environments.</p>
        </div>
        <div class="stat-grid">
          <div class="stat-card"><div class="stat-value">21</div><div class="stat-name">Age</div></div>
          <div class="stat-card"><div class="stat-value">BSIT</div><div class="stat-name">Class</div></div>
          <div class="stat-card"><div class="stat-value">★4</div><div class="stat-name">Student</div></div>
          <div class="stat-card"><div class="stat-value">OJT</div><div class="stat-name">Quest Type</div></div>
        </div>
        <div class="content-block objective-block">
          <h3>Career Objective</h3>
          <p>Seeking an <strong>On-the-Job Training (OJT)</strong> placement to apply IT and layout-design skills, support day-to-day office operations, and gain practical experience while contributing to the hosting organization.</p>
        </div>
        <ul class="detail-list">
          <li><span class="detail-key">Birthday</span><span class="detail-val">August 22, 2005</span></li>
          <li><span class="detail-key">Origin</span><span class="detail-val">Brgy. Dalakit, Catarman, Northern Samar</span></li>
          <li><span class="detail-key">Affiliation</span><span class="detail-val">Northern Samar Colleges</span></li>
        </ul>
      </div>
    </div>
  `,
  talents: `
    <div class="content-block">
      <h3>Combat Talents · Technical Skills</h3>
      <p>Proficiencies aligned with your resume—rated for clarity in a Genshin-style talent view.</p>
    </div>
    <div class="talent-row">
      <h4>Normal Attack · Coding & Scripting</h4>
      <p>Basic coding, scripting fundamentals, and willingness to learn new stacks</p>
      <div class="skill-bar"><div class="skill-bar-fill skill-bar-fill--red" data-progress="72"></div></div>
    </div>
    <div class="talent-row">
      <h4>Elemental Skill · Digital Literacy</h4>
      <p>AI literacy, cybersecurity awareness, database handling basics</p>
      <div class="skill-bar"><div class="skill-bar-fill skill-bar-fill--red" data-progress="68"></div></div>
    </div>
    <div class="talent-row">
      <h4>Elemental Burst · Systems & Design</h4>
      <p>Computer hardware, software troubleshooting, basic graphic design</p>
      <div class="skill-bar"><div class="skill-bar-fill skill-bar-fill--red" data-progress="75"></div></div>
    </div>
    <div class="content-block">
      <h3>Passive · Traits</h3>
      <ul class="bullet-list">
        <li>Adaptable and willing to learn</li>
        <li>Comfortable with office and customer-facing settings</li>
        <li>Interest in layout design and practical IT work</li>
      </ul>
    </div>
  `,
  quests: `
    <div class="quest-card">
      <div class="quest-type">Main Quest · OJT</div>
      <h4>Sales Associate</h4>
      <p class="quest-meta">SOUQ miniMart · Catarman, Northern Samar</p>
      <p class="quest-meta">June 20, 2025 — September 5, 2025</p>
      <p>On-the-job training in retail operations: customer service, daily store tasks, teamwork, and professional workplace conduct.</p>
    </div>
    <div class="quest-card">
      <div class="quest-type">Commission · Seminar</div>
      <h4>Cybersecurity Awareness</h4>
      <p class="quest-meta">March 6, 2024</p>
      <p>Training focused on safe digital practices and security-minded habits for IT students.</p>
    </div>
    <div class="quest-card">
      <div class="quest-type">Commission · Workshop</div>
      <h4>Arduino & Robotics Workshop</h4>
      <p class="quest-meta">March 25, 2024</p>
      <p>Hands-on exposure to hardware prototyping, robotics concepts, and applied problem-solving.</p>
    </div>
    <div class="content-block">
      <h3>Awards & Certificates</h3>
      <p class="muted">No entries listed on resume (N/A)—slot reserved for future achievements.</p>
    </div>
  `,
  education: `
    <div class="content-block">
      <h3>Academy Records · Tertiary</h3>
    </div>
    <div class="edu-entry edu-entry--highlight">
      <div class="edu-tier">Current</div>
      <h4>Bachelor of Science in Information Technology</h4>
      <p class="edu-school">Northern Samar Colleges</p>
      <p class="edu-years">2023 — Present</p>
    </div>
    <div class="content-block">
      <h3>Secondary Education</h3>
    </div>
    <div class="edu-entry">
      <h4>Secondary Level</h4>
      <p class="edu-school">Saint Michael Academy</p>
      <p class="edu-years">2021 — 2023</p>
    </div>
    <div class="edu-entry">
      <h4>Secondary Level</h4>
      <p class="edu-school">Catarman National High School</p>
      <p class="edu-years">2018 — 2021</p>
    </div>
    <div class="content-block">
      <h3>Elementary Education</h3>
    </div>
    <div class="edu-entry">
      <h4>Elementary Level</h4>
      <p class="edu-school">Northern Samar Colleges</p>
      <p class="edu-years">2013 — 2017</p>
    </div>
    <div class="edu-entry">
      <h4>Elementary Level</h4>
      <p class="edu-school">Generoso R. Frigillana Memorial School</p>
      <p class="edu-years">2010 — 2013</p>
    </div>
  `,
  attributes: `
    <div class="content-block">
      <h3>Character Attributes</h3>
      <p>Personal details as shown on your formal resume.</p>
    </div>
    <ul class="attr-grid">
      <li><span class="detail-key">Age</span><span class="detail-val">21 years old</span></li>
      <li><span class="detail-key">Birth date</span><span class="detail-val">August 22, 2005</span></li>
      <li><span class="detail-key">Height</span><span class="detail-val">5′4″</span></li>
      <li><span class="detail-key">Weight</span><span class="detail-val">50 kg</span></li>
      <li><span class="detail-key">Citizenship</span><span class="detail-val">Filipino</span></li>
      <li><span class="detail-key">Civil status</span><span class="detail-val">Single</span></li>
      <li><span class="detail-key">Religion</span><span class="detail-val">Born Again Christian</span></li>
      <li><span class="detail-key">Address</span><span class="detail-val">Brgy. Dalakit, Catarman, Northern Samar</span></li>
    </ul>
    <div class="content-block certification-block">
      <h3>Certification</h3>
      <p class="cert-text">I hereby certify that the above information is true and correct to the best of my knowledge.</p>
      <p class="cert-signature">Clarick John S. Cascaño</p>
      <p class="cert-role">Applicant</p>
    </div>
  `,
  wish: `
    <div class="content-block">
      <h3>Contact · Wish Banner</h3>
      <p>Reach out for OJT opportunities, IT-related training, or collaboration.</p>
    </div>
    <div class="contact-links">
      <a class="contact-chip contact-chip--primary" href="mailto:benoitcascano@gmail.com">benoitcascano@gmail.com</a>
      <a class="contact-chip" href="tel:+639677250857">0967 725 0857</a>
    </div>
    <div class="content-block">
      <h3>Character References</h3>
    </div>
    <div class="ref-card">
      <h4>Mar Riel C. Abuke, LPT</h4>
      <p>BSIT Coordinator · Northern Samar Colleges</p>
    </div>
    <div class="ref-card">
      <h4>Amb. Dr. Antonell Albano</h4>
      <p>Founder / President · Alliance of Hospitality and Tourism Movers of the Philippines (AHTOMP)</p>
    </div>
  `,
};

let isTransitioning = false;

function setActiveMenu(targetKey) {
  menuItems.forEach((item) => {
    item.classList.toggle('active', item.getAttribute('data-target') === targetKey);
  });
}

function loadSection(targetKey, animate = true) {
  const html = resumeData[targetKey];
  if (!html) return;

  panelTitle.textContent = sectionTitles[targetKey] || 'Archive';
  setActiveMenu(targetKey);

  if (!animate) {
    panelBody.innerHTML = html;
    gsap.set(panelBody, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' });
    animateSectionContent(panelBody);
    return;
  }

  gsap.to(panelBody, {
    duration: 0.28,
    opacity: 0,
    y: -14,
    scale: 0.98,
    filter: 'blur(4px)',
    ease: 'power2.in',
    onComplete: () => {
      panelBody.innerHTML = html;
      gsap.fromTo(
        panelBody,
        { opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' },
        {
          duration: 0.55,
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          onComplete: () => animateSectionContent(panelBody),
        }
      );
    },
  });
}

function enterMainUI() {
  if (isTransitioning) return;
  isTransitioning = true;
  pauseEntranceTheme();
  playCinematicFlash();
  playEnterBurst();

  gsap.set(startScreen, { opacity: 1, scale: 1, filter: 'blur(0px)' });
  gsap.set('.top-bar', { y: -30, opacity: 0 });
  gsap.set(contentPanel, { scale: 0.88, opacity: 0, rotateY: -8, transformPerspective: 900 });

  gsap
    .timeline({
      onComplete: () => {
        gsap.set('.menu-item', { clearProps: 'transform,opacity' });
        loadSection('profile', false);
        isTransitioning = false;
      },
    })
    .to(startScreen, {
      duration: 0.65,
      opacity: 0,
      scale: 1.12,
      filter: 'blur(6px)',
      ease: 'power3.in',
    })
    .call(() => {
      startScreen.classList.add('hidden');
      mainUI.classList.remove('hidden');
      gsap.set(mainUI, { opacity: 0 });
    })
    .to(mainUI, { duration: 0.5, opacity: 1, ease: 'power2.out' })
    .to('.top-bar', { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.4)' }, '-=0.35')
    .fromTo(
      '.menu-item',
      { x: -48, skewX: -10, opacity: 0 },
      {
        duration: 0.5,
        x: 0,
        skewX: -10,
        opacity: 1,
        stagger: 0.07,
        ease: 'back.out(1.35)',
      },
      '-=0.25'
    )
    .fromTo(
      contentPanel,
      { scale: 0.88, opacity: 0, rotateY: -8 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 0.75, ease: 'power3.out' },
      '-=0.55'
    );
}

function exitToStartScreen() {
  if (isTransitioning) return;
  isTransitioning = true;
  sfxClose.play();

  gsap
    .timeline({
      onComplete: () => {
        mainUI.classList.add('hidden');
        startScreen.classList.remove('hidden');
        gsap.set(mainUI, { clearProps: 'opacity' });
        gsap.set(startScreen, { opacity: 1, scale: 1, filter: 'blur(0px)' });
        gsap.set(contentPanel, { clearProps: 'transform,opacity' });
        isTransitioning = false;
      },
    })
    .to(contentPanel, { scale: 0.94, opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' })
    .to('.menu-item', { x: -24, opacity: 0, duration: 0.3, stagger: 0.03, ease: 'power2.in' }, '-=0.2')
    .to(mainUI, { duration: 0.4, opacity: 0, ease: 'power2.in' })
    .call(() => {
      mainUI.classList.add('hidden');
      startScreen.classList.remove('hidden');
    })
    .fromTo(
      startScreen,
      { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
      { duration: 0.75, opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power3.out' }
    )
    .fromTo('.start-frame', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.2)' }, '-=0.5')
    .call(() => resumeEntranceThemeIfAllowed());
}

startBtn.addEventListener('click', enterMainUI);
backBtn.addEventListener('click', exitToStartScreen);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mainUI.classList.contains('hidden')) {
    exitToStartScreen();
  }
});

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (isTransitioning) return;
    sfxClick.play();
    gsap.fromTo(item, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.55)' });
    loadSection(item.getAttribute('data-target'));
  });
});
