
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
  it('should send image and text to the AI', async () => {
    const { mockGenerateContent } = await import('@google/genai');
    mockGenerateContent.mockResolvedValue({ response: { text: () => 'mocked response' } });

    const blob = new Blob([''], { type: 'image/jpeg' });
    const contents = {
      blob,
      height: 100,
      width: 100,
    };

    await sendImage(contents);

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
  });
});
