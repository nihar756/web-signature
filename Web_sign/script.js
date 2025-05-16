// Initialize variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentAngle = 0;
let history = [];

// Get DOM elements
const colorPicker = document.getElementById("colorPicker");
const widthSlider = document.getElementById("widthSlider");
const angleSlider = document.getElementById("angleSlider");
const canvas = document.getElementById("myCanvas");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
const colorCircle = document.querySelector(".color-circle");
const colorHex = document.querySelector(".color-hex");

// Get canvas context
const ctx = canvas.getContext("2d");

// Set initial line properties
ctx.lineWidth = widthSlider.value;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = colorPicker.value;

// Adjust canvas for high DPI displays
function setupCanvas() {
  // Get the device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  
  // Get the canvas dimensions from CSS
  const rect = canvas.getBoundingClientRect();
  
  // Set the canvas dimensions accounting for DPI
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  // Scale the context
  ctx.scale(dpr, dpr);
  
  // Set the display size
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Reset line properties after canvas reset
  ctx.lineWidth = widthSlider.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = colorPicker.value;
}

// Call setupCanvas on page load
window.addEventListener('load', setupCanvas);
window.addEventListener('resize', setupCanvas);

// Save canvas state for undo functionality
function saveState() {
  history.push(canvas.toDataURL());
  if (history.length > 10) {
    history.shift(); // Keep only the last 10 states
  }
}

// Draw function
function draw(e) {
  if (!isDrawing) return;
  
  // Get the correct coordinates whether it's a mouse or touch event
  const x = e.offsetX || e.touches[0].clientX - canvas.getBoundingClientRect().left;
  const y = e.offsetY || e.touches[0].clientY - canvas.getBoundingClientRect().top;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  lastX = x;
  lastY = y;
}

// Start drawing
function startDrawing(e) {
  isDrawing = true;
  
  // Get the correct coordinates whether it's a mouse or touch event
  lastX = e.offsetX || e.touches[0].clientX - canvas.getBoundingClientRect().left;
  lastY = e.offsetY || e.touches[0].clientY - canvas.getBoundingClientRect().top;
  
  // Save the current state before starting to draw
  saveState();
  
  // Start drawing immediately
  draw(e);
}

// Stop drawing
function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    // Save the state after drawing is complete
    saveState();
  }
}

// Update color
colorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  ctx.strokeStyle = color;
  colorCircle.style.backgroundColor = color;
  colorHex.textContent = color.toUpperCase();
});

// Update line width
widthSlider.addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value;
});

// Update angle (rotate canvas)
angleSlider.addEventListener("input", (e) => {
  const newAngle = e.target.value;
  const angleChange = newAngle - currentAngle;
  currentAngle = newAngle;
  
  // Save current canvas
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Rotate and draw
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angleChange * Math.PI / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.restore();
});

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Touch events for mobile
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startDrawing(e);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  draw(e);
});
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  stopDrawing();
});

// Prevent right-click menu on canvas
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Clear button
clearButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

// Save button
saveButton.addEventListener("click", () => {
  // Check if canvas is empty
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const isEmpty = !imageData.some(channel => channel !== 0);
  
  if (isEmpty) {
    alert("Please draw your signature before downloading.");
    return;
  }
  
  // Save to localStorage
  localStorage.setItem("signature", canvas.toDataURL());
  
  // Create download link
  const link = document.createElement("a");
  link.download = "my-signature.png";
  
  // Create a white background version for download
  const downloadCanvas = document.createElement('canvas');
  const downloadCtx = downloadCanvas.getContext('2d');
  downloadCanvas.width = canvas.width;
  downloadCanvas.height = canvas.height;
  
  // Fill with white background
  downloadCtx.fillStyle = "#FFFFFF";
  downloadCtx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
  
  // Draw the signature on top
  downloadCtx.drawImage(canvas, 0, 0);
  
  // Set as download source
  link.href = downloadCanvas.toDataURL("image/png");
  link.click();
});

// Initialize color display
colorHex.textContent = colorPicker.value.toUpperCase();
