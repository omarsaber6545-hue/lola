/* ==========================================================================
   Interactive Logic, Canvas Particles, Audio Synthesizer, and Typewriter
   ========================================================================== */

// --- Texts for pages ---
const PAGE_TEXTS = {
    1: `إزيك يا لولا، عاملة إيه؟ يا رب تكوني بخير. عارف إن إحنا مع بعض من فترة قصيرة جدًا، يمكن لسه مكملناش 3 أيام، لكن والله من ساعة ما دخلتي حياتي وأنا بقيت فرحان أكتر. بقيت أحب أمسك التلفون تاني زي الأول، وأستنى أي رسالة أو أي كلام منك.

إنتِ شخص جميل جدًا، زي العسل بجد، وقلبك بريء ونضيف بطريقة نادرة. عندك طيبة وحنية بتدخل القلب من غير أي استئذان، وبتخلي أي حد يتعلق بيكي بسهولة.

يمكن الوقت اللي عرفتك فيه كان من أصعب الفترات اللي بمر بيها، لكن وجودك خفف عني حاجات كتير، وخلى أيامي ألطف وأجمل.

بقيت أتمنى أشوف ضحكتك كل يوم، وأفرح بفرحتك، وأزعل لو شفتك زعلانة.

ربنا يديم وجودك الجميل في حياتي، ويحفظ قلبك الأبيض، لأنك فعلًا من أجمل الأشخاص اللي عرفتهم. ❤️`,

    2: `أنا عارف إن أنا ساعات بحس إني بخليكي تتكلمي معايا غصب، بس والله أنا بحب أتكلم معاكي جدًا. بحب كلامك، وبحب وجودك، لأنك بقيتي حرفيًا جزء كبير من يومي، ومش هكدب عليكي في ده.

فمش عايزك تزعلي مني خالص لو في أي وقت حسيتِ إني بكلمك كتير أو بضايقك. والله ده آخر شيء أتمنى يحصل.

ولو في يوم زهقتي مني، أو مش حبيتي تتكلمي معايا، فده قرارك وأنا هحترمه، ومش هزعل منك.

كل اللي يهمني إنك تكوني مرتاحة وسعيدة.

والمهم من كل ده... خلي بالك من نفسك. نفسي أشوفك دايمًا فرحانة، ناجحة، ومحققة كل اللي بتحلمي بيه.

وربنا يبعد عنك أي زعل أو تعب، ويفضل الضحك منور وشك على طول. ❤️`,

    3: `يمكن كل الكلام اللي فوق ميقدرش يوصف قد إيه وجودك فرق معايا، لكن حبيت أقولك جزء صغير من اللي جوايا.

أتمنى دايمًا أشوف ابتسامتك، وأشوفك مرتاحة وسعيدة، لأن ده بيفرحني أنا كمان.

شكراً إنك دخلتي حياتي، وشكرًا على كل لحظة حلوة بسببك.

وأتمنى تفضلي دايمًا أحلى لولا في الدنيا كلها. ❤️🌹`
};

// Global state variables
let currentScreen = 0;
let typewriterTimeouts = {};
let isTyping = false;
let audioCtx = null;
let isMusicPlaying = false;
let synthTimer = null;
let showerActive = false;

// DOM Elements
const screenPassword = document.getElementById('screen-password');
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const screen3 = document.getElementById('screen-3');

const passwordInput = document.getElementById('password-input');
const passwordForm = document.getElementById('password-form');
const errorMessage = document.getElementById('error-message');
const musicToggleBtn = document.getElementById('musicToggle');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    setupPasswordForm();
    setupNavigation();
    setupMusicToggle();
});

/* ==========================================================================
   PARTICLE CANVAS ENGINE (Floating Hearts & Sparkles)
   ========================================================================== */
let canvas, ctx;
let particles = [];
const HEART_TYPES = ['❤️', '💖', '💕', '🌸', '✨', '💗'];

function initCanvas() {
    canvas = document.getElementById('particleCanvas');
    ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Initial lightweight ambient particles (20 max for silky performance)
    for (let i = 0; i < 20; i++) {
        particles.push(createParticle(true));
    }

    requestAnimationFrame(renderParticles);
}

function createParticle(randomY = false) {
    return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 20,
        size: Math.random() * 12 + 10,
        speedY: Math.random() * -1.0 - 0.3,
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.6 + 0.3,
        symbol: HEART_TYPES[Math.floor(Math.random() * HEART_TYPES.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5
    };
}

function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Controlled particle count for smooth 60 FPS performance
    const maxAllowed = showerActive ? 45 : 20;
    if (particles.length < maxAllowed && Math.random() < 0.3) {
        particles.push(createParticle(false));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();

        // Respawn particles smoothly
        if (p.y < -30) {
            particles[i] = createParticle(false);
        }
    }

    requestAnimationFrame(renderParticles);
}

/* ==========================================================================
   ROMANTIC WEB AUDIO SYNTHESIZER
   ========================================================================== */
function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playRomanticMelody() {
    if (!audioCtx || !isMusicPlaying) return;

    // Dreamy chord scale (F major 7 / C major 9 chords in Hz)
    const notes = [
        261.63, 329.63, 392.00, 493.88, 523.25, // C4, E4, G4, B4, C5
        349.23, 440.00, 523.25, 659.25,          // F4, A4, C5, E5
        293.66, 349.23, 440.00, 523.25           // D4, F4, A4, C5
    ];

    const note = notes[Math.floor(Math.random() * notes.length)];
    
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 3.6);
    } catch (e) {
        console.log("Audio playback error", e);
    }

    // Interval for next gentle note
    const nextInterval = Math.random() * 800 + 1200;
    synthTimer = setTimeout(playRomanticMelody, nextInterval);
}

function toggleMusic() {
    initAudio();
    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.querySelector('.music-text').textContent = 'إيقاف الموسيقى';
        playRomanticMelody();
    } else {
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.querySelector('.music-text').textContent = 'موسيقى هادئة';
        if (synthTimer) clearTimeout(synthTimer);
    }
}

function setupMusicToggle() {
    musicToggleBtn.addEventListener('click', toggleMusic);
}

/* ==========================================================================
   PASSWORD VALIDATION
   ========================================================================== */
function setupPasswordForm() {
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        validatePassword();
    });
}

function validatePassword() {
    const entered = passwordInput.value.trim().toLowerCase();
    const glassCard = screenPassword.querySelector('.glass-card');

    if (entered === 'lola') {
        // Correct Password!
        errorMessage.textContent = '';
        glassCard.classList.remove('shake');
        
        // Auto start romantic music on user interaction
        if (!isMusicPlaying) {
            toggleMusic();
        }

        // Transition to Screen 1
        switchScreen(screenPassword, screen1, () => {
            currentScreen = 1;
            startTypewriter(1);
        });
    } else {
        // Incorrect Password
        errorMessage.textContent = 'كلمة المرور غلط شكلك كدا مش علا❤️';
        glassCard.classList.remove('shake');
        // Trigger reflow to restart animation
        void glassCard.offsetWidth;
        glassCard.classList.add('shake');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

/* ==========================================================================
   SCREEN TRANSITIONS
   ========================================================================== */
function switchScreen(fromScreen, toScreen, onComplete) {
    fromScreen.classList.remove('active');
    
    setTimeout(() => {
        fromScreen.classList.add('hidden');
        toScreen.classList.remove('hidden');
        
        // Trigger reflow
        void toScreen.offsetWidth;
        
        toScreen.classList.add('active');
        if (onComplete) onComplete();
    }, 600);
}

function setupNavigation() {
    // Button from Screen 1 to Screen 2
    document.getElementById('btn-to-screen-2').addEventListener('click', () => {
        switchScreen(screen1, screen2, () => {
            currentScreen = 2;
            startTypewriter(2);
        });
    });

    // Button from Screen 2 to Screen 3
    document.getElementById('btn-to-screen-3').addEventListener('click', () => {
        showerActive = true; // Intensify hearts on final screen
        switchScreen(screen2, screen3, () => {
            currentScreen = 3;
            triggerHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
            startTypewriter(3);
        });
    });

    // Button Restart from Screen 3 to Screen 0
    document.getElementById('btn-restart').addEventListener('click', () => {
        showerActive = false;
        // Reset inputs and elements
        passwordInput.value = '';
        errorMessage.textContent = '';
        
        // Hide footers and grand reveal
        document.getElementById('footer-1').classList.add('hidden', 'show');
        document.getElementById('footer-2').classList.add('hidden', 'show');
        document.getElementById('footer-3').classList.add('hidden', 'show');
        document.getElementById('grand-reveal').classList.add('hidden');

        // Clear typewriter texts
        document.getElementById('typewriter-1').innerHTML = '';
        document.getElementById('typewriter-2').innerHTML = '';
        document.getElementById('typewriter-3').innerHTML = '';

        switchScreen(screen3, screenPassword, () => {
            currentScreen = 0;
            passwordInput.focus();
        });
    });
}

/* ==========================================================================
   TYPEWRITER EFFECT ENGINE
   ========================================================================== */
function startTypewriter(screenNum) {
    const container = document.getElementById(`typewriter-${screenNum}`);
    const footer = document.getElementById(`footer-${screenNum}`);
    const fullText = PAGE_TEXTS[screenNum];
    
    container.innerHTML = '';
    footer.classList.add('hidden');
    footer.classList.remove('show');

    if (screenNum === 3) {
        document.getElementById('grand-reveal').classList.add('hidden');
    }

    let index = 0;
    isTyping = true;

    // Create caret element
    const caret = document.createElement('span');
    caret.className = 'cursor-caret';

    function typeChar() {
        if (!isTyping) return;

        if (index < fullText.length) {
            const char = fullText.charAt(index);
            
            // Insert character before caret
            if (caret.parentNode === container) {
                container.removeChild(caret);
            }
            container.appendChild(document.createTextNode(char));
            container.appendChild(caret);

            index++;

            // Ultra-fast fluid typing delay
            let delay = Math.floor(Math.random() * 5) + 5;
            if (char === '.' || char === '؟' || char === '!') delay += 40;
            if (char === '\n') delay += 50;

            typewriterTimeouts[screenNum] = setTimeout(typeChar, delay);
        } else {
            // Typing complete
            if (caret.parentNode === container) {
                container.removeChild(caret);
            }
            finishTyping(screenNum);
        }
    }

    typeChar();
}

function skipTypewriter(screenNum) {
    if (typewriterTimeouts[screenNum]) {
        clearTimeout(typewriterTimeouts[screenNum]);
    }
    isTyping = false;

    const container = document.getElementById(`typewriter-${screenNum}`);
    container.innerHTML = PAGE_TEXTS[screenNum];
    finishTyping(screenNum);
}

function finishTyping(screenNum) {
    isTyping = false;
    const footer = document.getElementById(`footer-${screenNum}`);
    const skipBtn = document.querySelector(`#screen-${screenNum} .skip-btn`);
    
    if (skipBtn) skipBtn.style.display = 'none';

    footer.classList.remove('hidden');
    setTimeout(() => {
        footer.classList.add('show');
    }, 100);

    // If Screen 3, reveal giant headline & explosion
    if (screenNum === 3) {
        const grandReveal = document.getElementById('grand-reveal');
        grandReveal.classList.remove('hidden');
        triggerHeartBurst(window.innerWidth / 2, window.innerHeight / 3, 50);
    }
}
