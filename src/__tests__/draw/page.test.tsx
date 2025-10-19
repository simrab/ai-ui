
import convertImageToHtml from '@/app/actions/ai';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as tldraw from 'tldraw';
import { describe, expect, it, type Mock, vi } from 'vitest';

// Mock the sendImage function
vi.mock('@/app/actions/ai', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('tldraw', async () => {
  const actual = await vi.importActual('tldraw');
  return {
    ...actual,
    useEditor: vi.fn(),
  };
});

const mockSendImage = convertImageToHtml as Mock;

describe('Toolbar', () => {
  it('should call toImage, sendImage and open a new tab with HTML content on button click', async () => {
    const mockToImage = vi.fn().mockResolvedValue('mock-image-data');
    const mockGetCurrentPageShapeIds = vi.fn().mockReturnValue(new Set(['shape1']));
    const mockEditor = {
      toImage: mockToImage,
      getCurrentPageShapeIds: mockGetCurrentPageShapeIds,
    };

    (tldraw.useEditor as Mock).mockReturnValue(mockEditor);

    const htmlContent = '<h1>Generated HTML</h1>';
    
    // Set up the mock return value
    mockSendImage.mockResolvedValue({ success: true, html: htmlContent });

    // Mock window.open and document methods
    const mockDocument = {
      write: vi.fn(),
      close: vi.fn(),
    };
    const mockWindow = {
      document: mockDocument,
    };
    const mockWindowOpen = vi.fn().mockReturnValue(mockWindow);
    
    // Store original window.open and replace it
    const originalWindowOpen = window.open;
    window.open = mockWindowOpen;

    const { getByText } = render(<Toolbar />);

    const button = getByText('Generate HTML');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGetCurrentPageShapeIds).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockToImage).toHaveBeenCalledWith(['shape1'], { format: 'jpeg' });
    });

    await waitFor(() => {
      expect(mockSendImage).toHaveBeenCalledWith('mock-image-data');
    });

    // Verify that a new tab was opened
    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalled();
    });

    // Verify that the HTML content was written to the new tab
    await waitFor(() => {
      expect(mockDocument.write).toHaveBeenCalledWith(
        expect.stringContaining(htmlContent)
      );
    });

    // Verify that the document was closed
    await waitFor(() => {
      expect(mockDocument.close).toHaveBeenCalled();
    });

    // Restore original window.open
    window.open = originalWindowOpen;
  });

  it('should handle the case when window.open returns null (popup blocked)', async () => {
    const mockToImage = vi.fn().mockResolvedValue('mock-image-data');
    const mockGetCurrentPageShapeIds = vi.fn().mockReturnValue(new Set(['shape1']));
    const mockEditor = {
      toImage: mockToImage,
      getCurrentPageShapeIds: mockGetCurrentPageShapeIds,
    };

    (tldraw.useEditor as Mock).mockReturnValue(mockEditor);

    const htmlContent = '<h1>Generated HTML</h1>';
    mockSendImage.mockResolvedValue({ success: true, html: htmlContent });

    // Mock window.open to return null (popup blocked)
    const mockWindowOpen = vi.fn().mockReturnValue(null);
    const originalWindowOpen = window.open;
    window.open = mockWindowOpen;

    const { getByText } = render(<Toolbar />);

    const button = getByText('Generate HTML');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSendImage).toHaveBeenCalledWith('mock-image-data');
    });

    // Verify that window.open was called even though it returned null
    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalled();
    });

    // Restore original window.open
    window.open = originalWindowOpen;
  });
});
