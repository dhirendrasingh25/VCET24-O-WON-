const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBVN7dcDgispP78Z0p3WqcE0_lxtagrN1A");
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "Age of the user is 30, no such ailments, lifestyle is medium class type, currently there are no suddent emergencies, i have some dependents like family and more, graduated in BE in CS branch and currently working in JP, monthly income would be around 2-3lacs, can you suggest me the availabe investment plans based on current trends, give in json form.";

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

run();
