# ExamEdge - PDF to Anki Flashcard Converter (Google Gemini API)

ExamEdge is a tool that extracts text from PDF files and generates flashcards using the Google Gemini AI API. The flashcards are exported in CSV format and can be imported into Anki for studying.

## Features

- Extracts text from PDFs using PDF.js
- Generates high-quality Q&A pairs using Google Gemini AI
- Exports flashcards to CSV for Anki
- Handles API errors effectively
- Simple web-based interface (no installation required)

## Setup Instructions

### Clone the Repository
git clone https://github.com/AdnanA2/ExamEdge.git


cd pdf-to-anki-gemini  

### Open the Application
Open `index.html` in a web browser.

## How to Use

1. Upload a PDF file containing study material.
2. Click **"Process PDF & Create Deck"** to extract text.
3. Google Gemini AI generates Q&A pairs automatically.
4. Click **"Download Anki Deck"** to save the flashcards in CSV format.
5. Import the CSV into Anki via `File > Import`.

## API Configuration

- The Google Gemini API key is hardcoded in `index.html`.
- If needed, replace it in the script:
  const API_KEY = "YOUR_GOOGLE_GEMINI_API_KEY_HERE";
- Hardcoding API keys in client-side code is not secure. Consider using a backend to handle API requests.

## Troubleshooting

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Error: Gemini API error: Model not found | Ensure you're using `gemini-2.0-flash` in the API URL |
| No Q&A pairs generated | Try using a simpler or shorter PDF |
| PDF text extraction is incomplete | Ensure the PDF contains selectable text, not scanned images |

## Future Enhancements

- Support for multiple PDFs
- Allow manual flashcard edits
- Drag & Drop PDF upload

## License

This project is open-source.

## Credits

Developed by Captain Adnan's Team.  
Powered by **Google Gemini API**.
