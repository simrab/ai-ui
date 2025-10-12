
import sendImage from '@/app/actions/ai';
import { Toolbar } from '@/app/draw/page';
import ModalHtml from '@/components/modal-htlml';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as tldraw from 'tldraw';
import { describe, expect, it, type Mock, vi } from 'vitest';

// Mock the sendImage function
vi.mock('@/app/actions/ai', () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock the ModalHtml component
vi.mock('@/components/modal-htlml', () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

vi.mock('tldraw', async () => {
  const actual = await vi.importActual('tldraw');
  return {
    ...actual,
    useEditor: vi.fn(),
  };
});

const mockSendImage = sendImage as Mock;
const MockedModalHtml = ModalHtml as Mock;

describe('Toolbar', () => {
  it('should call toImage, sendImage and open the modal on button click', async () => {
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

    const { getByText } = render(<Toolbar />);

    const button = getByText('Send image');
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

    await waitFor(() => {
      expect(MockedModalHtml).toHaveBeenCalledWith(
        expect.objectContaining({
          html: htmlContent,
          open: true,
        }),
        undefined
      );
    });
  });
});
