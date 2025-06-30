const canvas = document.getElementById("sketch-canvas");
const ctx = canvas.getContext("2d");
let painting = false;

function getXY(e) {
  const rect = canvas.getBoundingClientRect();
  return e.touches
    ? [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top]
    : [e.clientX - rect.left, e.clientY - rect.top];
}

function startDrawing(e) {
  painting = true;
  const [x, y] = getXY(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  e.preventDefault();
}

function draw(e) {
  if (!painting) return;
  const [x, y] = getXY(e);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(x, y);
  ctx.stroke();
  e.preventDefault();
}

function stopDrawing() {
  painting = false;
  ctx.beginPath();
}

// Drawing events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchend", stopDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });

// Clear button
document.getElementById("clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Download PNG with form data
document.getElementById("downloadPng").addEventListener("click", () => {
  const formInputs = Array.from(document.querySelectorAll("input[type='text'], input[type='tel'], input[type='date']"))
    .filter(input => input.value.trim() !== "")
    .map(input => {
      const label = input.closest("label");
      const text = label ? label.firstChild.textContent.trim() : "Field";
      return `${text}: ${input.value}`;
    });

  const itemsPerColumn = Math.ceil(formInputs.length / 2);
  const rowHeight = 30;
  const padding = 20;
  const columnSpacing = 300;
  const sketchHeight = 420;
  const width = 800;
  const height = (itemsPerColumn * rowHeight + padding * 2 + sketchHeight + 40);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");

  tempCtx.fillStyle = "#fff";
  tempCtx.fillRect(0, 0, width, height);
  tempCtx.fillStyle = "#222";
  tempCtx.font = "bold 20px 'Segoe UI'";
  tempCtx.fillText("Fitting Data Summary", padding, 30);

  tempCtx.fillStyle = "#000";
  tempCtx.font = "15px 'Segoe UI'";
  let xPos = padding;
  let yPos = 60;

  formInputs.forEach((line, index) => {
    tempCtx.fillText(line, xPos, yPos);
    if ((index + 1) % itemsPerColumn === 0) {
      xPos += columnSpacing;
      yPos = 60;
    } else {
      yPos += rowHeight;
    }
  });

  tempCtx.drawImage(canvas, padding, yPos + 20, 400, 400);
  tempCtx.strokeStyle = "#aaa";
  tempCtx.strokeRect(padding, yPos + 20, 400, 400);
  tempCtx.font = "italic 14px 'Segoe UI'";
  tempCtx.fillText("Sketch", padding, yPos + 18);

  const link = document.createElement("a");
  link.download = "fitting_data.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
});
