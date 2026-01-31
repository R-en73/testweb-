
// BGMコントロールの共通実装
const bgm = document.querySelector('#bgm');
const btn = document.querySelector('#music-btn');
const statusText = document.querySelector('#music-status');

// --- 1. ページ読み込み時の処理 ---
window.addEventListener('load', () => {
    // すべて sessionStorage に統一
    const isPlaying = sessionStorage.getItem('bgm_playing') === 'true';
    const savedTime = sessionStorage.getItem('bgm_time');

    if (savedTime) {
        bgm.currentTime = parseFloat(savedTime);
    }

    if (isPlaying) {
        bgm.volume = 0;
        bgm.play().then(() => {
            btn.classList.add('is-playing');
            statusText.textContent = 'BGM: ON';
            fadeAudio(bgm, 1);
        }).catch(() => {
            console.log("ユーザー操作待ち");
        });
    }
});

// --- 2. リンクをクリックした時の処理 ---
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            e.preventDefault();
            // 保存先も sessionStorage に修正
            sessionStorage.setItem('bgm_time', bgm.currentTime); 

            if (!bgm.paused) {
                fadeAudio(bgm, 0, () => {
                    window.location.href = href;
                });
            } else {
                window.location.href = href;
            }
        }
    });
});

// --- 3. 音量調節（フェード）用関数 ---
function fadeAudio(audio, targetVolume, callback) {
    const duration = 300;
    const step = 0.05;
    const intervalTime = duration * step;

    const timer = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(audio.volume + step, 1);
        } else if (audio.volume > targetVolume) {
            audio.volume = Math.max(audio.volume - step, 0);
        } else {
            clearInterval(timer);
            if (callback) callback();
        }
    }, intervalTime);
}

// --- 4. ボタン操作 ---
btn.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play();
        // 保存先も sessionStorage に修正
        sessionStorage.setItem('bgm_playing', 'true');
        btn.classList.add('is-playing');
        statusText.textContent = 'BGM: ON';
        fadeAudio(bgm, 1);
    } else {
        fadeAudio(bgm, 0, () => {
            bgm.pause();
            // 保存先も sessionStorage に修正
            sessionStorage.setItem('bgm_playing', 'false');
            btn.classList.remove('is-playing');
            statusText.textContent = 'BGM: OFF';
        });
    }
});

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    // overlay-nav 内リンクは対象外
    if (link.closest('#overlayNav')) return;

    const href = link.getAttribute('href');

    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      e.preventDefault();
      sessionStorage.setItem('bgm_time', bgm.currentTime);

      if (!bgm.paused) {
        fadeAudio(bgm, 0, () => {
          window.location.href = href;
        });
      } else {
        window.location.href = href;
      }
    }
  });
});


// ハンバーガーメニューの実装
const hamburger = document.getElementById("hamburger");
const overlayNav = document.getElementById("overlayNav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("is-open");
  overlayNav.classList.toggle("is-open");
});

document.querySelectorAll("#overlayNav a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("is-open");
    overlayNav.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  });
});