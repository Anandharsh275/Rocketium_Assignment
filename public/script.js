const API_BASE = '/api';

// Initialize canvas
async function initCanvas() {
    const width = document.getElementById('canvasWidth').value;
    const height = document.getElementById('canvasHeight').value;
    
    try {
        const response = await fetch(`${API_BASE}/canvas/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ width: parseInt(width), height: parseInt(height) })
        });
        
        const result = await response.json();
        if (result.success) {
            showStatus('Canvas initialized successfully', 'success');
            updatePreviewCanvas(result.canvas.width, result.canvas.height);
            updatePreview();
        }
    } catch (error) {
        showStatus('Error initializing canvas', 'error');
    }
}

// Add rectangle
async function addRectangle() {
    const data = {
        x: parseInt(document.getElementById('rectX').value),
        y: parseInt(document.getElementById('rectY').value),
        width: parseInt(document.getElementById('rectWidth').value),
        height: parseInt(document.getElementById('rectHeight').value),
        color: document.getElementById('rectColor').value
    };
    
    await addElement('/canvas/rectangle', data, 'Rectangle added');
}

// Add circle
async function addCircle() {
    const data = {
        x: parseInt(document.getElementById('circleX').value),
        y: parseInt(document.getElementById('circleY').value),
        radius: parseInt(document.getElementById('circleRadius').value),
        color: document.getElementById('circleColor').value
    };
    
    await addElement('/canvas/circle', data, 'Circle added');
}

// Add text
async function addText() {
    const data = {
        x: parseInt(document.getElementById('textX').value),
        y: parseInt(document.getElementById('textY').value),
        text: document.getElementById('textContent').value,
        fontSize: parseInt(document.getElementById('textSize').value),
        color: document.getElementById('textColor').value
    };
    
    await addElement('/canvas/text', data, 'Text added');
}

// Add image
async function addImage() {
    const fileInput = document.getElementById('imageFile');
    if (!fileInput.files[0]) {
        showStatus('Please select an image file', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('x', document.getElementById('imageX').value);
    formData.append('y', document.getElementById('imageY').value);
    
    const width = document.getElementById('imageWidth').value;
    const height = document.getElementById('imageHeight').value;
    if (width) formData.append('width', width);
    if (height) formData.append('height', height);
    
    try {
        const response = await fetch(`${API_BASE}/canvas/image`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (result.success) {
            showStatus('Image added successfully', 'success');
            updatePreview();
        }
    } catch (error) {
        showStatus('Error adding image', 'error');
    }
}

// Generic function to add elements
async function addElement(endpoint, data, successMessage) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            showStatus(successMessage, 'success');
            updatePreview();
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    }
}

// Update preview canvas
async function updatePreview() {
    try {
        const response = await fetch(`${API_BASE}/canvas/state`);
        const canvasState = await response.json();
        
        const canvas = document.getElementById('previewCanvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw elements
        for (const element of canvasState.elements) {
            switch (element.type) {
                case 'rectangle':
                    ctx.fillStyle = element.color;
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                    
                case 'circle':
                    ctx.fillStyle = element.color;
                    ctx.beginPath();
                    ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
                    
                case 'text':
                    ctx.fillStyle = element.color;
                    ctx.font = `${element.fontSize}px Arial`;
                    ctx.fillText(element.text, element.x, element.y);
                    break;
                    
                case 'image':
                    const img = new Image();
                    img.onload = function() {
                        const width = element.width || img.width;
                        const height = element.height || img.height;
                        ctx.drawImage(img, element.x, element.y, width, height);
                    };
                    img.src = element.src;
                    break;
            }
        }
    } catch (error) {
        showStatus('Error updating preview', 'error');
    }
}

// Export as PDF using jsPDF
async function exportPDF() {
    try {
        showStatus('Generating PDF...', 'success');
        
        // Load jsPDF library dynamically
        if (!window.jsPDF) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
        
        const canvas = document.getElementById('previewCanvas');
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('canvas-export.pdf');
        
        showStatus('PDF exported successfully!', 'success');
    } catch (error) {
        showStatus('Error exporting PDF', 'error');
    }
}

// Update preview canvas dimensions
function updatePreviewCanvas(width, height) {
    const canvas = document.getElementById('previewCanvas');
    canvas.width = width;
    canvas.height = height;
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
});