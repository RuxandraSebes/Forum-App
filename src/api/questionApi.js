const API_BASE_URL = "http://localhost:8080"; // schimbă cu adresa ta reală dacă e diferită

export const getQuestionDetails = async (questionId) => {
  try {
    const response = await fetch("http://localhost:8080/questions/getAll");
    if (!response.ok) throw new Error("Failed to fetch question details");
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Eroare la getQuestionDetails:", error);
    throw error;
  }
};


export const getQuestionById = async (questionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`);
    if (!response.ok) throw new Error("Failed to fetch question details");
    const data = await response.json();
    return data; // Obiectul question direct
  } catch (error) {
    console.error("Eroare la getQuestionById:", error);
    throw error;
  }
};
export const addQuestionApi = async (questionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      throw new Error("Failed to add question");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAnswers = async (questionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`);
    if (!response.ok) throw new Error("Failed to fetch answers");
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Eroare la getAnswers:", error);
    throw error;
  }
};
