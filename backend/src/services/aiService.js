const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/environment');

class AIService {
  constructor() {
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  async generatePropertyDescription(property) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: "You are a real estate description generator."
          },
          {
            role: "user",
            content: `Generate an engaging description for a ${property.type} 
                      with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, 
                      located in a desirable area.`
          }
        ]
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Description Generation Error:', error);
      return null;
    }
  }
}

module.exports = new AIService();
