const API_KEY = "AIzaSyAxrFQPCbJOxoMhKHfcvvvG--Csk6bxg2s"; // HARDCODED GEMINI API KEY

// Get UI elements
const pdfFileInput = document.getElementById('pdf-file');
const deckNameInput = document.getElementById('deck-name');
const processBtn = document.getElementById('process-btn');
const statusMessage = document.getElementById('status-message');
const downloadSection = document.getElementById('download-section');
const downloadBtn = document.getElementById('download-btn');

// Process button click event
processBtn.addEventListener('click', async () => {
    try {
        const file = pdfFileInput.files[0];
        if (!file) throw new Error("Please select a PDF file.");

        const deckName = deckNameInput.value.trim() || "Study Notes";

        // Show status message
        processBtn.disabled = true;
        statusMessage.textContent = "Extracting text from PDF...";
        statusMessage.classList.remove("hidden");

        // Extract text
        const extractedText = await extractTextFromPDF(file);
        if (!extractedText) throw new Error("Failed to extract text from PDF.");

        statusMessage.textContent = "Generating Q&A pairs...";

        // Generate Q&A pairs with Gemini
        const qaPairsText = await generateQAPairsWithGemini(extractedText);
        const pairs = parseQAPairs(qaPairsText);

        if (pairs.length === 0) throw new Error("No Q&A pairs generated.");

        // Export to CSV
        exportToCSV(pairs, deckName);

        // Show download button
        statusMessage.textContent = `Successfully created deck with ${pairs.length} cards!`;
        downloadSection.classList.remove("hidden");
    } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
    } finally {
        processBtn.disabled = false;
    }
});

// Extract text from PDF
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map(item => item.str).join(" ") + "\n\n";
                }
                resolve(text);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Generate Q&A pairs with Gemini
async function generateQAPairsWithGemini(text) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const prompt = `Generate 15-20 Q&A pairs from this text:\n\n${text}`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        console.log("Gemini API Response:", data);

        if (!data || data.error) throw new Error(data.error?.message || "Unknown API error.");
        if (!data.candidates || !data.candidates.length) throw new Error("No response from Gemini API.");

        return data.candidates[0]?.content?.parts[0]?.text || "";
    } catch (error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
}

// Parse Q&A pairs
function parseQAPairs(text) {
    return text.split("\n\n").map(block => {
        const lines = block.split("\n");
        return lines.length >= 2 ? { front: lines[0].replace("Q: ", ""), back: lines[1].replace("A: ", "") } : null;
    }).filter(Boolean);
}

// Export to CSV
function exportToCSV(flashcards, deckName) {
    const csv = "Front,Back\n" + flashcards.map(card => `"${card.front}","${card.back}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${deckName}.csv`;
        a.click();
    };
}
