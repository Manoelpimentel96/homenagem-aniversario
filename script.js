
(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);

  const screens = [...document.querySelectorAll('.screen')];

  const scanner = $('#scanner');
  const scannerProgress = $('#scannerProgress');
  const scannerPercent = $('#scannerPercent');
  const scannerStatus = $('#scannerStatus');
  const scanButton = $('#scanButton');

  const music = $('#backgroundMusic');
  const musicButton = $('#musicButton');
  const musicLabel = $('#musicLabel');

  const heartField = $('#heartField');
  const stars = $('#stars');
  const shootingStars = $('#shootingStars');

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let scanRunning = false;
  let scanCompleted = false;
  let musicPlaying = false;
  let heartTimer = null;

  /* ESTRELAS DO UNIVERSO */

  function createStars() {
    if (!stars || reduceMotion) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 150; i++) {
      const star = document.createElement('span');

      star.className = 'star';

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      const size = 1 + Math.random() * 2.2;

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.setProperty(
        '--duration',
        `${2 + Math.random() * 5}s`
      );

      star.style.animationDelay = `${Math.random() * 5}s`;

      fragment.appendChild(star);
    }

    stars.appendChild(fragment);
  }

  function createShootingStars() {
    if (!shootingStars || reduceMotion) return;

    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');

      star.className = 'shooting-star';

      star.style.left = `${15 + Math.random() * 90}%`;
      star.style.top = `${Math.random() * 65}%`;
      star.style.animationDelay = `${Math.random() * 12}s`;
      star.style.animationDuration = `${4 + Math.random() * 5}s`;

      shootingStars.appendChild(star);
    }
  }

  /* NAVEGAÇÃO ENTRE AS TELAS */

  function showScreen(id) {
    const target = document.getElementById(id);

    if (!target) return;

    screens.forEach((screen) => {
      screen.classList.toggle('active', screen === target);
    });

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      const destination = button.dataset.go;

      if (destination === 'welcome' && !scanCompleted) return;

      showScreen(destination);
    });
  });

  /* LEITOR BIOMÉTRICO CENOGRÁFICO */

  function updateScanner(percent) {
    const degrees = percent * 3.6;

    scannerProgress.style.background = `
      conic-gradient(
        #49f29a 0deg,
        #49f29a ${degrees}deg,
        rgba(73,242,154,.08) ${degrees}deg,
        rgba(73,242,154,.08) 360deg
      )
    `;

    scannerPercent.textContent = `${percent}%`;
  }

  function startScan() {
    if (scanRunning || scanCompleted) return;

    scanRunning = true;
    scanButton.disabled = true;
    scanButton.textContent = 'Realizando leitura...';

    scanner.classList.add('scanning');

    scannerStatus.textContent = 'Iniciando leitura visual...';

    let progress = 0;

    const duration = reduceMotion ? 100 : 55;

    const interval = window.setInterval(() => {
      progress += Math.floor(1 + Math.random() * 3);

      if (progress >= 100) {
        progress = 100;
      }

      updateScanner(progress);

      if (progress < 30) {
        scannerStatus.textContent = 'Analisando sinais...';
      } else if (progress < 65) {
        scannerStatus.textContent = 'Reconhecendo sua presença...';
      } else if (progress < 100) {
        scannerStatus.textContent = 'Preparando sua homenagem...';
      }

      if (progress >= 100) {
        window.clearInterval(interval);

        scanner.classList.remove('scanning');
        scanner.classList.add('complete');

        scannerStatus.textContent = 'Leitura concluída com sucesso!';

        scannerPercent.textContent = '100%';

        scanCompleted = true;
        scanRunning = false;

        scanButton.disabled = false;
        scanButton.innerHTML = 'Acessar minha homenagem <span>✦</span>';

        createHeartBurst();

        window.setTimeout(() => {
          showScreen('welcome');
        }, 1300);
      }
    }, duration);
  }

  scanButton.addEventListener('click', () => {
    if (scanCompleted) {
      showScreen('welcome');
      return;
    }

    // Inicia a música junto com a primeira interação.
    if (music && music.paused) {
      music.play()
        .then(() => {
          musicPlaying = true;
          musicButton.classList.add('playing');
          musicLabel.textContent = 'Pausar música';
          musicButton.setAttribute('aria-label', 'Pausar música');
        })
        .catch((error) => {
          console.error('Erro ao reproduzir música:', error);
        });
    }

    startScan();
  });

  /* MÚSICA DE FUNDO */

  async function toggleMusic() {
    if (!music) return;

    if (musicPlaying) {
      music.pause();
      musicPlaying = false;

      musicButton.classList.remove('playing');
      musicLabel.textContent = 'Tocar música';
      musicButton.setAttribute('aria-label', 'Tocar música');

      return;
    }

    try {
      await music.play();

      musicPlaying = true;

      musicButton.classList.add('playing');
      musicLabel.textContent = 'Pausar música';
      musicButton.setAttribute('aria-label', 'Pausar música');

    } catch (error) {
      console.error('Não foi possível iniciar a música:', error);

      musicLabel.textContent = 'Verifique musica.mp3';
    }
  }

  musicButton.addEventListener('click', toggleMusic);

  music.addEventListener('ended', () => {
    musicPlaying = false;
    musicButton.classList.remove('playing');
    musicLabel.textContent = 'Tocar música';
  });

  /* CORAÇÕES FLUTUANTES */

  function createFloatingHeart() {
    if (document.hidden || reduceMotion) return;

    const heart = document.createElement('span');

    heart.className = 'heart-float';
    heart.textContent = Math.random() > .4 ? '♡' : '♥';

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 19}px`;

    heart.style.setProperty(
      '--drift',
      `${Math.random() * 130 - 65}px`
    );

    heart.style.setProperty(
      '--drift-half',
      `${Math.random() * 65 - 32}px`
    );

    const duration = 12 + Math.random() * 10;

    heart.style.animationDuration = `${duration}s`;

    heartField.appendChild(heart);

    window.setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  function startHearts() {
    if (reduceMotion || heartTimer) return;

    for (let i = 0; i < 8; i++) {
      window.setTimeout(createFloatingHeart, i * 300);
    }

    heartTimer = window.setInterval(createFloatingHeart, 1500);
  }

  function stopHearts() {
    if (heartTimer) {
      window.clearInterval(heartTimer);
      heartTimer = null;
    }
  }

  /* EXPLOSÃO DE CORAÇÕES */

  function createHeartBurst() {
    if (reduceMotion) return;

    const symbols = ['♡', '♥', '✧', '✨', '🌹', '✦', '💗'];

    for (let i = 0; i < 35; i++) {
      const particle = document.createElement('span');

      const angle = (Math.PI * 2 * i) / 35;
      const distance = 70 + Math.random() * 180;

      particle.textContent = symbols[
        Math.floor(Math.random() * symbols.length)
      ];

      particle.style.position = 'fixed';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.zIndex = '30';
      particle.style.pointerEvents = 'none';

      particle.style.fontSize = `${15 + Math.random() * 20}px`;
      particle.style.color = '#f2a9ca';

      particle.style.transition =
        `transform ${1 + Math.random()}s cubic-bezier(.15,.7,.2,1), opacity 1.5s ease`;

      particle.style.transform = 'translate(-50%, -50%) scale(.2)';
      particle.style.opacity = '0';

      document.body.appendChild(particle);

      window.requestAnimationFrame(() => {
        particle.style.transform = `
          translate(
            calc(-50% + ${Math.cos(angle) * distance}px),
            calc(-50% + ${Math.sin(angle) * distance}px)
          ) scale(1.3) rotate(${Math.random() * 180}deg)
        `;

        particle.style.opacity = '1';
      });

      window.setTimeout(() => {
        particle.style.opacity = '0';
      }, 800);

      window.setTimeout(() => {
        particle.remove();
      }, 2200);
    }
  }

  /* REINICIAR A EXPERIÊNCIA */

  $('#restart').addEventListener('click', () => {
    scanRunning = false;
    scanCompleted = false;

    scanner.classList.remove('scanning', 'complete');

    updateScanner(0);

    scannerStatus.textContent = 'Aguardando identificação';

    scanButton.disabled = false;
    scanButton.innerHTML = 'Iniciar experiência <span>✦</span>';

    showScreen('intro');
  });

  /* ECONOMIA DE RECURSOS QUANDO A ABA NÃO ESTÁ VISÍVEL */

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopHearts();
    } else {
      startHearts();
    }
  });

  /* INICIALIZAÇÃO */

  createStars();
  createShootingStars();
  startHearts();


  /* PIX: COPIAR CHAVE E EXPLODIR DE RISADAS */

  const copyPixButton = document.querySelector('#copyPixButton');
  const pixFeedback = document.querySelector('#pixFeedback');

  function createLaughExplosion() {
    const emojis = ['😂', '🤣', '💜', '💸', '😆', '🫐'];

    for (let i = 0; i < 35; i++) {
      const particle = document.createElement('span');

      particle.className = 'laugh-particle';
      particle.textContent = emojis[
        Math.floor(Math.random() * emojis.length)
      ];

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 220;

      particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
      particle.style.setProperty('--rotation', `${Math.random() * 360}deg`);

      document.body.appendChild(particle);

      window.setTimeout(() => particle.remove(), 1700);
    }
  }

  if (copyPixButton) {
    copyPixButton.addEventListener('click', async () => {
      const pixKey = copyPixButton.dataset.pixKey;

      if (!pixKey || pixKey === 'COLOQUE_SUA_CHAVE_PIX_AQUI') {
        pixFeedback.textContent = 'Configure sua chave Pix no HTML!';
        return;
      }

      try {
        await navigator.clipboard.writeText(pixKey);

        copyPixButton.classList.add('copied');
        copyPixButton.innerHTML = '😂 Pix copiado! 💜';

        pixFeedback.textContent =
          'Agora não tem desculpa... estou esperando meu açaí! 😂';

        createLaughExplosion();

        window.setTimeout(() => {
          copyPixButton.classList.remove('copied');
          copyPixButton.innerHTML =
            '<span>💜</span> Pagar meu litro de açaí <span>💸</span>';
        }, 3000);

      } catch (error) {
        pixFeedback.textContent =
          'Não foi possível copiar. Tente novamente em uma página HTTPS.';
      }
    });
  }
})();
