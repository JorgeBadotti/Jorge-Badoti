
import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, WardrobeItem, Product, GeneratedLook, ClothingCategory } from '../types';

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini services will be mocked.");
}

// --- Helper Functions ---

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

async function urlToGenerativePart(url: string) {
    if (url.startsWith('data:')) {
        const [meta, base64Data] = url.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
        return { inlineData: { data: base64Data, mimeType } };
    }
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType = blob.type;
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
    });
    const data = await base64EncodedDataPromise;
    return { inlineData: { data, mimeType } };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// --- API Functions ---

export const analyzeUserImage = async (image: File): Promise<{ bodyType: string, measurements: UserProfile['measurements'] }> => {
  if (!ai) {
    console.warn("Mocking analyzeUserImage as API key is missing.");
    await sleep(1500);
    return { bodyType: 'rectangle', measurements: { bust: 90, waist: 75, hips: 95, height: 170 } };
  }

  try {
    const imagePart = await fileToGenerativePart(image);
    const prompt = `Analise a imagem da pessoa e estime o tipo de corpo e as medidas corporais em centímetros. Os tipos de corpo possíveis são: 'hourglass', 'rectangle', 'pear', 'apple', 'inverted-triangle'. Retorne um JSON com as chaves "bodyType" e "measurements". O objeto "measurements" deve ter as chaves "bust", "waist", "hips", "height".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  bodyType: { type: Type.STRING },
                  measurements: {
                      type: Type.OBJECT,
                      properties: {
                          bust: { type: Type.NUMBER },
                          waist: { type: Type.NUMBER },
                          hips: { type: Type.NUMBER },
                          height: { type: Type.NUMBER },
                      },
                      required: ["bust", "waist", "hips", "height"],
                  },
              },
              required: ["bodyType", "measurements"],
          },
      },
    });

    const jsonString = response.text;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in analyzeUserImage:", error);
    if (error instanceof Error && error.message.toLowerCase().includes('quota')) {
        throw new Error("Você excedeu sua cota da API. Verifique o status da sua chave no Google AI Studio e tente novamente.");
    }
    throw new Error("Não foi possível analisar a imagem. Verifique sua conexão ou tente novamente.");
  }
};

export const classifyClothingItem = async (image: File): Promise<{ name: string, category: string }> => {
  if (!ai) {
    console.warn("Mocking classifyClothingItem as API key is missing.");
    await sleep(1000 + Math.random() * 1000);
    const mockNames = ['Camisa de Algodão', 'Calça Jeans Slim', 'Tênis Casual', 'Jaqueta de Couro'];
    const mockCategories = Object.values(ClothingCategory).filter(c => c !== ClothingCategory.All);
    return {
      name: mockNames[Math.floor(Math.random() * mockNames.length)],
      category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
    };
  }
  
  try {
    const imagePart = await fileToGenerativePart(image);
    const categories = Object.values(ClothingCategory).filter(c => c !== ClothingCategory.All).join(', ');
    const prompt = `Analise a imagem da peça de roupa. Sua tarefa é classificá-la usando categorias de moda do Brasil. Forneça um nome descritivo para a peça (ex: 'Camisa de Botão Azul Claro', 'Calça Jeans Skinny Rasgada', 'Bolsa de Couro Caramelo') e escolha a categoria mais apropriada da seguinte lista: ${categories}. Certifique-se de que a categoria retornada seja EXATAMENTE uma das opções fornecidas. Retorne um JSON com as chaves "name" e "category".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["name", "category"],
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    const validCategories = Object.values(ClothingCategory);
    if (validCategories.includes(result.category as ClothingCategory)) {
        return result;
    } else {
        console.warn(`AI returned an invalid category: "${result.category}". Falling back.`);
        throw new Error(`Categoria inválida: ${result.category}`);
    }

  } catch(error) {
    console.error("Error in classifyClothingItem:", error);
    if (error instanceof Error && error.message.toLowerCase().includes('quota')) {
        throw new Error("Cota da API excedida. Verifique o status da sua chave.");
    }
    throw new Error("Falha na classificação.");
  }
};

export const generateLookDescriptions = async (
  userProfile: UserProfile,
  items: (WardrobeItem | Product)[],
  userPrompt: string
): Promise<{ looks: GeneratedLook[] }> => {
  if (!ai) {
    console.warn("Mocking generateLookDescriptions as API key is missing.");
    await sleep(2000);
    if (items.length < 2) {
      throw new Error("São necessárias pelo menos duas peças para criar um look (mock).");
    }
    const mockLooks: GeneratedLook[] = [
      { look_id: "mock1", name: "Look Urbano (Mock)", explanation: "Uma combinação perfeita para o dia a dia na cidade, unindo conforto e estilo.", body_affinity_index: 9.5, status: "DRAFT", items: [{id: items[0].id, name: items[0].name, source: 'closet'}, {id: items[1].id, name: items[1].name, source: 'closet'}] },
      { look_id: "mock2", name: "Elegância Casual (Mock)", explanation: "Ideal para um encontro casual ou um happy hour, este look é sofisticado na medida certa.", body_affinity_index: 9.2, status: "DRAFT", items: items.length > 2 ? [{id: items[0].id, name: items[0].name, source: 'closet'}, {id: items[2].id, name: items[2].name, source: 'closet'}] : [{id: items[0].id, name: items[0].name, source: 'closet'}, {id: items[1].id, name: items[1].name, source: 'closet'}] }
    ];
    return { looks: mockLooks };
  }

  const { name, measurements, bodyType, personalStyle } = userProfile;
  const itemsWithSource = items.map(item => ({
    id: item.id,
    name: item.name,
    source: 'brand' in item ? 'store' : 'closet',
  }));

  const systemInstruction = `Role: Você é o StyleMe AI Engine, um estilista digital de alta performance especializado em morfologia masculina e feminina. Sua função é gerar combinações de looks (modelos) que equilibram as proporções corporais usando a metodologia de geometria vestimentar.

Contexto do Usuário (Baseado na Interface):
- Nome: ${name}
- Biometria: Busto/Peitoral: ${measurements.bust}cm, Cintura: ${measurements.waist}cm, Quadril: ${measurements.hips}cm, Altura: ${measurements.height}cm.
- Tipo de Corpo: ${bodyType}
- Estilo Pessoal: ${personalStyle}

Diretrizes de Geração:
1. Compensação Visual: Se a cintura e o quadril forem próximos (como no perfil Retângulo), use peças que criem estrutura nos ombros ou definam levemente a cintura sem apertar.
2. Prioridade de Peças: O usuário está pedindo um look para a seguinte ocasião: "${userPrompt}". Se houver peças selecionadas (source: 'closet'), considere-as como peças-chave e construa o look ao redor delas. Complete o look preferencialmente com itens do user_closet.
3. Upselling Técnico: Sugira uma peça da store_catalog (source: 'store') apenas se ela resolver um problema de proporção ou elevar o estilo básico.
4. Tom de Voz: Profissional, direto e consultivo. Explique o "porquê" técnico de cada escolha.
5. Gere até 2 looks.

Peças Disponíveis:
${JSON.stringify(itemsWithSource)}

Saída Obrigatória (JSON): Retorne um objeto JSON com uma chave "looks" contendo um array de objetos de look. Se não for possível criar looks, retorne um JSON com uma chave "reason". Cada objeto de look deve seguir estritamente este formato:
{
  "look_id": "string (único, use o formato lk_nome_do_look_random)",
  "name": "Nome do Look",
  "explanation": "Justificativa técnica baseada nas medidas ${measurements.bust}, ${measurements.waist} e ${measurements.hips}",
  "items": [{"id": "id_da_peca", "name": "nome_da_peca", "source": "closet|store"}],
  "body_affinity_index": 0.0 (um número de 0.0 a 10.0),
  "status": "DRAFT"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: systemInstruction,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            looks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  look_id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        source: { type: Type.STRING },
                      },
                      required: ["id", "name", "source"],
                    },
                  },
                  body_affinity_index: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                },
                required: ["look_id", "name", "explanation", "items", "body_affinity_index", "status"],
              },
            },
            reason: { type: Type.STRING },
          },
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    if (result.reason) {
      throw new Error(result.reason);
    }
    if (!result.looks || result.looks.length === 0) {
      throw new Error("A IA não conseguiu gerar looks com os itens fornecidos. Tente uma combinação diferente.");
    }
    return { looks: result.looks };

  } catch (error) {
    console.error("Error in generateLookDescriptions:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('quota')) {
            throw new Error("Você excedeu sua cota da API para gerar looks. Verifique o status da sua chave no Google AI Studio e tente novamente.");
        }
        throw error;
    }
    throw new Error("Ocorreu um erro ao comunicar com a IA.");
  }
};

export const generateLookImage = async (
  userImage: string,
  itemImages: string[],
  lookDescription: string
): Promise<string> => {
    if (!ai) {
        console.warn("Mocking generateLookImage as API key is missing.");
        await sleep(2500);
        const seed = lookDescription.replace(/\s/g, '');
        return `https://picsum.photos/seed/${seed}/400/600`;
    }
  
  try {
    const userImagePart = await urlToGenerativePart(userImage);
    const itemImageParts = await Promise.all(itemImages.map(url => urlToGenerativePart(url)));

    const textPrompt = `Crie uma imagem fotorrealista da pessoa na primeira imagem (a modelo) vestindo as roupas das imagens seguintes. A pessoa deve estar em um ambiente que combine com a seguinte descrição de look: "${lookDescription}". A imagem final deve mostrar apenas a pessoa vestindo o look completo, de corpo inteiro. Não mostre as imagens das peças de roupa separadamente na imagem final.`;
    
    const contents = {
        parts: [
            { text: textPrompt },
            userImagePart,
            ...itemImageParts
        ],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contents,
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64Data}`;
      }
    }
    throw new Error("API did not return an image.");

  } catch (error) {
    console.error("Error generating look image with Gemini:", error);
    if (error instanceof Error && error.message.toLowerCase().includes('quota')) {
        throw new Error("Cota da API excedida ao gerar imagem. Verifique o status da sua chave.");
    }
    throw new Error("Falha ao gerar a imagem do look.");
  }
};
