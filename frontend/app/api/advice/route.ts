export interface CompanyInfo {
  // Basic Information
  gicsGroup: string;
  companyName?: string;
  yearsInBusiness?: string;
  location?: string;

  // Financial & Scale
  teamSize: string;
  capital: string;
  annualRevenue?: string;
  numClients: string;

  // Market Position
  products?: string;
  targetMarket?: string;
  competitors?: string;

  // Impact & Culture
  socialImpact: string;
  values?: string;
  challenges?: string;
  goals?: string;

  // Additional Information
  additionalInfo?: string;

  // Language Selection
  language: string;
}

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const streamMode = searchParams.get('stream') === 'true';
    console.log("call /api/advice");
    const { companyInfo, language } = await request.json();

    const languagePrompts = {
      en: 'Please provide the following recommendations in English:',
      zh: '请用中文提供以下建议：',
      ja: '以下のアドバイスを日本語で提供してください：',
      ko: '다음 권장 사항을 한국어로 제공해 주세요:',
      es: 'Por favor, proporcione las siguientes recomendaciones en español:'
    };
    
    try {
      console.log("call /api/advice AI_API_URL: ", process.env.AI_API_URL);
      const response = await fetch(`${process.env.AI_API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ARK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-v3-250324",
          messages: [
            {
              role: "user",
              content: `${languagePrompts[language] || languagePrompts.en}

                Company characteristics:
                Basic Information:
                - Industry Group: ${companyInfo.gicsGroup}
                - Company Name: ${companyInfo.companyName || 'N/A'}
                - Years in Business: ${companyInfo.yearsInBusiness || 'N/A'}
                - Location: ${companyInfo.location || 'N/A'}

                Financial & Scale:
                - Team Size: ${companyInfo.teamSize} employees
                - Available Capital: $${companyInfo.capital}
                - Annual Revenue: $${companyInfo.annualRevenue || 'N/A'}
                - Current Client Base: ${companyInfo.numClients} clients

                Market Position:
                - Main Products/Services: ${companyInfo.products || 'N/A'}
                - Target Market: ${companyInfo.targetMarket || 'N/A'}
                - Key Competitors: ${companyInfo.competitors || 'N/A'}
                
                Impact & Culture:
                - Social Impact Score: ${companyInfo.socialImpact}/10
                - Company Values: ${companyInfo.values || 'N/A'}
                - Current Challenges: ${companyInfo.challenges || 'N/A'}
                - Future Goals: ${companyInfo.goals || 'N/A'}

                Additional Context:
                ${companyInfo.additionalInfo ? `\n${companyInfo.additionalInfo}` : ''}

                Please provide comprehensive recommendations for:
                1. Growth strategy
                   - Market expansion opportunities
                   - Product/service development
                   - Customer acquisition strategies

                2. Resource allocation
                   - Budget optimization
                   - Team development
                   - Technology investments

                3. Market positioning
                   - Competitive advantage
                   - Brand development
                   - Customer value proposition

                4. Risk management
                   - Market risks
                   - Operational risks
                   - Financial risks

                5. Sustainability initiatives
                   - Environmental impact
                   - Social responsibility
                   - Long-term viability`
            }
          ],
          max_tokens: 12800,
          stream: streamMode
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API responded with status: ${response.status}`);
      }

      if (streamMode) {
        // Stream the response to the frontend
        const encoder = new TextEncoder();
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          async start(controller) {
            let buffer = '';
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              // Decode and forward data
              const chunk = new TextDecoder().decode(value);
              buffer += chunk;
              // Attempt to extract content from OpenAI-style stream
              const lines = buffer.split('\n');
              buffer = lines.pop()!;
              for (const line of lines) {
                if (line.startsWith('data:')) {
                  const dataStr = line.replace('data: ', '').trim();
                  if (dataStr === '[DONE]') continue;
                  try {
                    const json = JSON.parse(dataStr);
                    const content = json.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(encoder.encode(content));
                    }
                  } catch (e) { /* skip malformed lines */ }
                }
              }
            }
            controller.close();
          }
        });
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        });
      } else {
        // Non-streaming: return the full advice as before
        const data = await response.json();
        return Response.json({ advice: data.choices[0].message.content });
      }
    } catch (error) {
      console.error('API Error:', error);
      return Response.json({ error: 'Failed to get advice' }, { status: 500 });
    }
}