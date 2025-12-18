# Canvas to PDF Full-Stack Application

A complete full-stack application that allows users to create canvas drawings and export them as optimized PDF files.

## Features

- **Canvas Management**: Initialize canvas with custom dimensions
- **Element Addition**: Add rectangles, circles, text, and images
- **Real-time Preview**: Live canvas preview in the browser
- **PDF Export**: Export canvas as compressed PDF file
- **File Upload**: Support for image uploads

## Technology Stack

- **Backend**: Node.js, Express, Canvas API, PDFKit
- **Frontend**: HTML5, CSS3, JavaScript
- **File Handling**: Multer for image uploads

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `POST /api/canvas/init` - Initialize canvas with dimensions
- `POST /api/canvas/rectangle` - Add rectangle to canvas
- `POST /api/canvas/circle` - Add circle to canvas
- `POST /api/canvas/text` - Add text to canvas
- `POST /api/canvas/image` - Upload and add image to canvas
- `GET /api/canvas/state` - Get current canvas state
- `GET /api/canvas/export` - Export canvas as PDF

## Usage

1. **Initialize Canvas**: Set width and height, then click "Initialize Canvas"
2. **Add Elements**: Use the forms to add rectangles, circles, text, or images
3. **Preview**: Click "Update Preview" to see your canvas
4. **Export**: Click "Export as PDF" to download the final PDF

## File Structure

```
├── server.js          # Backend API server
├── package.json       # Dependencies and scripts
├── public/            # Frontend files
│   ├── index.html     # Main HTML interface
│   ├── style.css      # Styling
│   └── script.js      # Frontend JavaScript
└── uploads/           # Image upload directory
```