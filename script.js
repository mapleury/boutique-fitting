const canvas = document.getElementById("sketch-canvas");
const ctx = canvas.getContext("2d");

let painting = false;

function startPosition(e) {
  painting = true;
  draw(e); // start with dot
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;

  e.preventDefault(); // prevent scrolling while drawing

  const rect = canvas.getBoundingClientRect();
  let x, y;

  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Mouse Events
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch Events
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);


//download png
document.getElementById("downloadPng").addEventListener("click", () => {
  const sketchCanvas = document.getElementById("sketch-canvas");

  // Prepare text inputs (excluding empty ones)
  const inputs = Array.from(document.querySelectorAll("input[type='text']")).filter(i => i.value.trim() !== "");
  const itemsPerColumn = Math.ceil(inputs.length / 2);

  const rowHeight = 30;
  const canvasPadding = 20;
  const columnSpacing = 300;
  const sketchHeight = 420;
  const width = 800;
  const height = (itemsPerColumn * rowHeight + canvasPadding * 2 + sketchHeight + 40);

  // Create temporary canvas
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");

  // Background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = "#222";
  ctx.font = "bold 20px 'Segoe UI', sans-serif";
  ctx.fillText("Fitting Data Summary", canvasPadding, 30);

  // Draw form inputs in two columns
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

  // Add sketch canvas
  ctx.drawImage(sketchCanvas, canvasPadding, yPos + 20, 400, 400);
  ctx.strokeStyle = "#999";
  ctx.strokeRect(canvasPadding, yPos + 20, 400, 400);
  ctx.font = "italic 14px 'Segoe UI', sans-serif";
  ctx.fillText("Model", canvasPadding, yPos + 18);

  // Download
  const link = document.createElement("a");
  link.download = "fitting_data.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
});
