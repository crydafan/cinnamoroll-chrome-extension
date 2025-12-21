// Inject custom font
const fontUrl = chrome.runtime.getURL("src/assets/KosugiMaru-Regular.ttf");
const fontFace = new FontFace("Kosugi Maru", `url(${fontUrl})`);
fontFace.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
});

const cinnamorollGif = chrome.runtime.getURL(
  "src/assets/hello-kitty-cinnamoroll-2.gif"
);

const cinnamoroll = document.createElement("div");
cinnamoroll.id = "cinnamoroll-companion";
cinnamoroll.innerHTML = `
  <img src="${cinnamorollGif}" alt="Cinnamoroll" width="250"></img>
  <div class="cinnamoroll-speech" style="display: none;">
    <p class="cinnamoroll-text"></p>
  </div>
`;
document.body.appendChild(cinnamoroll);

let x = Math.random() * (window.innerWidth - 250);
let y = Math.random() * (window.innerHeight - 250);

cinnamoroll.style.left = x + "px";
cinnamoroll.style.top = y + "px";

/*
function updateCinnamorollMood() {
  const cinnamorollSleepyGif = chrome.runtime.getURL(
    "src/assets/hello-kitty-cinnamoroll-3.gif"
  );

  cinnamoroll.innerHTML = `
  <img src="${cinnamorollSleepyGif}" alt="Cinnamoroll" width="250"></img>
  <div class="cinnamoroll-speech" style="display: none;">
    <p class="cinnamoroll-text"></p>
  </div>
`;
}

setTimeout(() => {
  updateCinnamorollMood();
}, 60000); // Change mood after 1 minute
*/

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
  e.preventDefault();
});

cinnamoroll.addEventListener("click", (e) => {
  if (hasDragged) return; // Prevent click action if dragging occurred

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
