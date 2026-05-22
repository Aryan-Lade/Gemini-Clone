/**
 * Gemini API Service
 * Handles all communication with the Google Gemini API
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const callGeminiAPI = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured");
  }

  try {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `Gemini API error: ${response.status}`,
      );
    }

    const result = await response.json();

    // Validate response structure
    if (
      !result.candidates ||
      !Array.isArray(result.candidates) ||
      result.candidates.length === 0
    ) {
      throw new Error("Invalid response structure: No candidates found");
    }

    const candidate = result.candidates[0];

    if (
      !candidate.content ||
      !candidate.content.parts ||
      !Array.isArray(candidate.content.parts) ||
      candidate.content.parts.length === 0
    ) {
      throw new Error("Invalid response structure: No content parts found");
    }

    const text = candidate.content.parts[0].text;

    if (!text) {
      throw new Error("Empty response text received from Gemini API");
    }

    return {
      success: true,
      content: text,
      fullResponse: result,
    };
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};

export const validateAPIResponse = (response) => {
  if (!response || typeof response !== "object") {
    return false;
  }

  return (
    response.candidates &&
    Array.isArray(response.candidates) &&
    response.candidates.length > 0 &&
    response.candidates[0].content &&
    response.candidates[0].content.parts &&
    Array.isArray(response.candidates[0].content.parts) &&
    response.candidates[0].content.parts.length > 0 &&
    response.candidates[0].content.parts[0].text
  );
};
