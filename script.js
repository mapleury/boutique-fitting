const canvas = document.getElementById("sketch-canvas");
const ctx = canvas.getContext("2d");
let painting = false;

// Mouse support
canvas.addEventListener("mousedown", () => painting = true);
canvas.addEventListener("mouseup", () => {
  painting = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", drawMouse);
canvas.addEventListener("mouseleave", () => painting = false);

// Touch support
canvas.addEventListener("touchstart", (e) => {
  painting = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchend", () => {
  painting = false;
  ctx.beginPath();
});
canvas.addEventListener("touchmove", drawTouch);

function drawMouse(e) {
  if (!painting) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function drawTouch(e) {
  e.preventDefault();
  if (!painting) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}

document.getElementById("clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("downloadPng").addEventListener("click", () => {
  const sketchCanvas = document.getElementById("sketch-canvas");
  const inputs = Array.from(document.querySelectorAll("input[type='text'], textarea"))
    .filter(i => i.value.trim() !== "");

  const itemsPerColumn = Math.ceil(inputs.length / 2);
  const rowHeight = 30;
  const canvasPadding = 20;
  const columnSpacing = 300;
  const sketchHeight = 420;
  const width = 800;
  const height = (itemsPerColumn * rowHeight + canvasPadding * 2 + sketchHeight + 40);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#222";
  ctx.font = "bold 20px 'Segoe UI', sans-serif";
  ctx.fillText("Fitting Data Summary", canvasPadding, 30);

  ctx.font = "15px 'Segoe UI', sans-serif";
  ctx.fillStyle = "#000";
  let xPos = canvasPadding;
  let yPos = 60;

  inputs.forEach((input, index) => {
    const label = input.closest("label");
    const labelText = label ? label.firstChild.textContent.trim() : "Field";
    const text = `${labelText}: ${input.value}`;
    ctx.fillText(text, xPos, yPos);

    if ((index + 1) % itemsPerColumn === 0) {
      xPos += columnSpacing;
      yPos = 60;
    } else {
      yPos += rowHeight;
    }
  });

  ctx.drawImage(sketchCanvas, canvasPadding, yPos + 20, 400, 400);
  ctx.strokeStyle = "#999";
  ctx.strokeRect(canvasPadding, yPos + 20, 400, 400);
  ctx.font = "italic 14px 'Segoe UI', sans-serif";
  ctx.fillText("Model", canvasPadding, yPos + 18);

  const link = document.createElement("a");
  link.download = "fitting_data.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
});
