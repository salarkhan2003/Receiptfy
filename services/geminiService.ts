
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractReceiptData(base64Data: string, mimeType: string = 'image/jpeg'): Promise<OCRResult> {
  try {
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64String,
            },
          },
          {
            text: `Meticulously extract all financial data from this receipt. 
            Focus on:
            - merchant: Store name
            - date: YYYY-MM-DD
            - total: Final grand total amount paid
            - subtotal: Amount before any taxes or extra charges
            - tax: Aggregate tax amount
            - taxRate: Percentage
            - taxes: ARRAY of objects {name, amount, rate} for specific taxes found (e.g., CGST, SGST, GST, VAT, Service Tax)
            - serviceCharge: Any tips or service fees
            - discount: Negative values or discounts
            - paymentMethod: e.g., UPI, Cash, Card
            - items: ARRAY of {name, price, quantity}
            
            Return strictly JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            date: { type: Type.STRING },
            total: { type: Type.NUMBER },
            subtotal: { type: Type.NUMBER },
            tax: { type: Type.NUMBER },
            taxRate: { type: Type.NUMBER },
            taxes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  rate: { type: Type.NUMBER }
                }
              }
            },
            serviceCharge: { type: Type.NUMBER },
            discount: { type: Type.NUMBER },
            paymentMethod: { type: Type.STRING },
            category: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  quantity: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["merchant", "total"]
        },
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as OCRResult;
  } catch (error) {
    console.error("OCR extraction failed:", error);
    return {};
  }
}
