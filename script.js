
const canvas = document.getElementById("sketch-canvas");
const ctx = canvas.getContext("2d");
let painting = false;

canvas.addEventListener("mousedown", () => painting = true);
canvas.addEventListener("mouseup", () => painting = false);
canvas.addEventListener("mouseleave", () => painting = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
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

document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


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
