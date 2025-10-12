

// Note: Test file name is modal-html.test.tsx to correct the typo in the component file name modal-htlml.tsx

import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModalHtml from '../../components/modal-htlml';

describe('ModalHtml', () => {
  it('should render the HTML and call setOpen on close', () => {
    const setOpen = vi.fn();
    const html = '<h1>Test HTML</h1>';
    const { getByText, getByTitle, getAllByText } = render(
      <ModalHtml html={html} open={true} setOpen={setOpen} />
    );

    // Check if the title and description are rendered
    expect(getByText('HTML create')).toBeInTheDocument();
    expect(getByText('HTML created from the image by Google Gemini')).toBeInTheDocument();

    // Check if the HTML is rendered
    const renderedHtml = getByTitle('generate html');
    expect(renderedHtml).toBeInTheDocument();
    expect(renderedHtml.innerHTML).toBe(html);

    // Check if the close button is rendered and calls setOpen on click
    const closeButtons = getAllByText('Close');
    const closeButton = closeButtons.find(
      (el) => el.tagName.toLowerCase() === 'button'
    );
    expect(closeButton).toBeInTheDocument();
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    // onOpenChange is called with false when the dialog is closed.
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('should render "No html produced yet..." when html is null', () => {
    const setOpen = vi.fn();
    const { getByText } = render(
      <ModalHtml html={null} open={true} setOpen={setOpen} />
    );

    expect(getByText('No html produced yet...')).toBeInTheDocument();
  });
});
