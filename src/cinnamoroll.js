// Inject custom font
const fontUrl = chrome.runtime.getURL("src/assets/KosugiMaru-Regular.ttf");
const fontFace = new FontFace("Kosugi Maru", `url(${fontUrl})`);
fontFace.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
});

const cinnamorollAwakeGif = chrome.runtime.getURL(
  "src/assets/hello-kitty-cinnamoroll-2.gif"
);
const cinnamorollSleepyGif = chrome.runtime.getURL(
  "src/assets/hello-kitty-cinnamoroll-3.gif"
);

const cinnamoroll = document.createElement("div");
cinnamoroll.id = "cinnamoroll-companion";
cinnamoroll.innerHTML = `
  <img src="${cinnamorollAwakeGif}" alt="Cinnamoroll" width="250"></img>
  <div class="cinnamoroll-speech" style="display: none;">
    <p class="cinnamoroll-text"></p>
  </div>
`;
document.body.appendChild(cinnamoroll);

let x = Math.random() * (window.innerWidth - 250);
let y = Math.random() * (window.innerHeight - 250);

cinnamoroll.style.left = x + "px";
cinnamoroll.style.top = y + "px";

// Sleep/wake functionality
let isSleeping = false;
let sleepTimeoutId = null;

function goToSleep() {
  if (isSleeping) return;
  isSleeping = true;
  const img = cinnamoroll.querySelector("img");
  img.src = cinnamorollSleepyGif;
}

function wakeUp() {
  if (!isSleeping) return;
  isSleeping = false;
  const img = cinnamoroll.querySelector("img");
  img.src = cinnamorollAwakeGif;
}

function resetInactivityTimer() {
  if (sleepTimeoutId) clearTimeout(sleepTimeoutId);
  sleepTimeoutId = setTimeout(goToSleep, 6000); // 6 seconds of inactivity
}

// Start the inactivity timer
resetInactivityTimer();

// Drag functionality
let isDragging = false;
let hasDragged = false;
let timeoutId = null;
let offsetX = 0;
let offsetY = 0;

cinnamoroll.addEventListener("mousedown", (e) => {
  isDragging = true;
  hasDragged = false;
  offsetX = e.clientX - cinnamoroll.offsetLeft;
  offsetY = e.clientY - cinnamoroll.offsetTop;
  cinnamoroll.style.cursor = "grabbing";
  resetInactivityTimer();
  e.preventDefault();
});

cinnamoroll.addEventListener("click", (e) => {
  if (hasDragged) return; // Prevent click action if dragging occurred

  // Wake up if sleeping
  if (isSleeping) {
    wakeUp();
    resetInactivityTimer();
    e.preventDefault();
    return;
  }

  resetInactivityTimer();

  const speechBubble = cinnamoroll.querySelector(".cinnamoroll-speech");
  const speechText = cinnamoroll.querySelector(".cinnamoroll-text");

  const messages = [
    "こんにちは！ぼく、シナモンだよ！",
    "今日は、どんなお手伝いができるかな？",
    "知ってる？シナモン、お空を飛ぶのが大好きなんだ！",
    "今日も、ふわふわで素敵な一日になりますように！",
    "何かあったら、いつでもシナモンを呼んでね！",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  speechText.textContent = randomMessage;
  speechBubble.style.display = "block";

  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    speechBubble.style.display = "none";
  }, 4000);

  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  hasDragged = true;
  x = e.clientX - offsetX;
  y = e.clientY - offsetY;

  cinnamoroll.style.left = x + "px";
  cinnamoroll.style.top = y + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  cinnamoroll.style.cursor = "pointer";
});
