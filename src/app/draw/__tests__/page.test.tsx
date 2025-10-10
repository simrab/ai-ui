
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Toolbar } from '../page';
import * as tldraw from 'tldraw';
import sendImage from '../../actions/ai';

vi.mock('../../actions/ai');

vi.mock('tldraw', async () => {
  const actual = await vi.importActual('tldraw');
  return {
    ...actual,
    useEditor: vi.fn(),
  };
});

describe('Toolbar', () => {
  it('should call toImage and sendImage on button click', async () => {
    const mockToImage = vi.fn().mockResolvedValue('mock-image-data');
    const mockGetCurrentPageShapeIds = vi.fn().mockReturnValue(new Set(['shape1']));
    const mockEditor = {
      toImage: mockToImage,
      getCurrentPageShapeIds: mockGetCurrentPageShapeIds,
    };

    (tldraw.useEditor as vi.Mock).mockReturnValue(mockEditor);

    const { getByText } = render(<Toolbar />);

    const button = getByText('Send image');
    fireEvent.click(button);

    await vi.waitFor(() => {
      expect(mockGetCurrentPageShapeIds).toHaveBeenCalled();
    });

    await vi.waitFor(() => {
      expect(mockToImage).toHaveBeenCalledWith(['shape1'], { format: 'jpeg' });
    });

    await vi.waitFor(() => {
      expect(sendImage).toHaveBeenCalledWith('mock-image-data');
    });
  });
});
