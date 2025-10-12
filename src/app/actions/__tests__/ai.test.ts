
import { describe, it, expect, vi } from 'vitest';
import sendImage from '../ai';

// Mock the GoogleGenAI class
vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  const mockGoogleGenAI = vi.fn(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  }));
  return { GoogleGenAI: mockGoogleGenAI, mockGenerateContent };
});

describe('sendImage', () => {
  it('should send image and text to the AI and return html', async () => {
    const { mockGenerateContent } = await import('@google/genai');
    const htmlContent = '<h1>Hello</h1>';
    mockGenerateContent.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              {
                text: `\`\`\`html\n${htmlContent}\n\`\`\``,
              },
            ],
          },
        },
      ],
    });

    const blob = new Blob([''], { type: 'image/jpeg' });
    const contents = {
      blob,
      height: 100,
      width: 100,
    };

    const result = await sendImage(contents);

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: expect.any(String),
          },
        },
        { text: 'convert this image to html' },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    expect(result.success).toBe(true);
    expect(result.html).toBe(htmlContent);
  });
});
