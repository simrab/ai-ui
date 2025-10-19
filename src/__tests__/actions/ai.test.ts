
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import convertImageToHtml from '../../app/actions/ai';
import { GoogleGenAI } from '@google/genai';

// Mock the GoogleGenAI class
vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  return {
    GoogleGenAI: vi.fn(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

describe('convertImageToHtml', () => {
  let mockGenerateContent: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get the mocked function from the GoogleGenAI instance
    const mockInstance = new (GoogleGenAI as unknown as Mock)({ apiKey: 'test' });
    mockGenerateContent = mockInstance.models.generateContent;
  });

  it('should convert image to HTML and return success response', async () => {
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

    const result = await convertImageToHtml(contents);

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

  it('should handle response without HTML content', async () => {
    mockGenerateContent.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'No HTML content here',
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

    const result = await convertImageToHtml(contents);

    expect(result.success).toBe(true);
    expect(result.html).toBe('No HTML content here');
  });

  it('should handle empty response from AI', async () => {
    mockGenerateContent.mockResolvedValue({
      candidates: [],
    });

    const blob = new Blob([''], { type: 'image/jpeg' });
    const contents = {
      blob,
      height: 100,
      width: 100,
    };

    const result = await convertImageToHtml(contents);

    expect(result.success).toBe(false);
    expect(result.message).toBe('No HTML content found in AI response');
  });

  it('should handle AI service errors', async () => {
    const errorMessage = 'API Error';
    mockGenerateContent.mockRejectedValue(new Error(errorMessage));

    const blob = new Blob([''], { type: 'image/jpeg' });
    const contents = {
      blob,
      height: 100,
      width: 100,
    };

    const result = await convertImageToHtml(contents);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Error while sending data to AI');
    expect(result.error).toBeInstanceOf(Error);
  });

  it('should remove markdown code block markers from HTML', async () => {
    const htmlContent = '<div><p>Test content</p></div>';
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

    const result = await convertImageToHtml(contents);

    expect(result.success).toBe(true);
    expect(result.html).toBe(htmlContent);
    expect(result.html).not.toContain('```html');
    expect(result.html).not.toContain('```');
  });
});
