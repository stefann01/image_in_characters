let streaming = false;
const defaultDensities = [
  "Ñ@#W$9876543210?!abc;:+=-,._       ",
  "01",
  "       .:-i|=+%O#@",
  " .:-=+*#%@",
  "     .░░▒▓▓██",
  "█▓▒░:.        ",
  "█▓▒░      "
];
const size = 64;
const cellSize = 14;
const divParent = document.getElementById("parent");
if (divParent) {
  divParent.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  divParent.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  divParent.style.width = size * cellSize + "px";
  divParent.style.height = size * cellSize + "px";
}
let selectedDensity = defaultDensities[0];
const video = document.getElementById("videoElement");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
if (canvas) {
  canvas.width = size;
  canvas.height = size;
}
function stream() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true}).then(function(stream2) {
      const video2 = document.getElementById("videoElement");
      video2.srcObject = stream2;
      streaming = true;
    }).catch(function(err) {
      console.log("Something went wrong!");
    });
  }
}
function processVideo() {
  try {
    if (streaming && video) {
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = context?.getImageData(0, 0, canvas.width, canvas.height).data;
      divParent?.replaceChildren();
      if (data) {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const index = avg * selectedDensity.length / 255;
          const character = selectedDensity[Math.floor(index)];
          const paragraph = document.createElement("p");
          paragraph.innerText = character;
          paragraph.style.fontSize = cellSize + "px";
          paragraph.style.color = `rgb(${avg}, ${avg}, ${avg})`;
          paragraph.style.width = cellSize + "px";
          paragraph.style.height = cellSize + "px";
          divParent?.appendChild(paragraph);
        }
      }
    }
  } catch (e) {
    return;
  }
  setTimeout(processVideo, 30 / 1e3);
}
document.getElementById("videoElement")?.addEventListener("play", function() {
  processVideo();
});
document.addEventListener("DOMContentLoaded", () => {
  stream();
});
const customDensitySelector = document.getElementById("customDensity");
const densitySelector = document.getElementById("density-selector");
const densityOptions = document.getElementById("density-options");
if (customDensitySelector) {
  customDensitySelector.addEventListener("input", (e) => {
    selectedDensity = e.target.value || defaultDensities[0];
    if (densitySelector) {
      densitySelector.innerText = selectedDensity;
      if (densityOptions) {
        for (let i = 0; i < densityOptions.children.length; i++) {
          densityOptions.children[i].classList.remove("selected-density");
        }
      }
    }
  });
}
if (densityOptions && densitySelector) {
  defaultDensities.forEach((density) => {
    const option = document.createElement("div");
    option.innerText = density;
    option.classList.add("density-option");
    if (density === selectedDensity) {
      option.classList.add("selected-density");
    }
    option.addEventListener("click", () => {
      selectedDensity = density;
      densityOptions.style.display = "none";
      densitySelector.innerHTML = density;
      for (let i = 0; i < densityOptions.children.length; i++) {
        const child = densityOptions.children[i];
        if (child.textContent === density) {
          child.classList.add("selected-density");
        } else {
          child.classList.remove("selected-density");
        }
      }
    });
    densityOptions.appendChild(option);
  });
  densitySelector.innerHTML = selectedDensity;
  densityOptions.style.display = "none";
  densitySelector.addEventListener("click", (e) => {
    densityOptions.style.display = densityOptions.style.display === "block" ? "none" : "block";
  });
}
