
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DrawLayout from '../layout';

describe('DrawLayout', () => {
  it('should render children and a heading', () => {
    const { getByText } = render(
      <DrawLayout>
        <div>Child Content</div>
      </DrawLayout>
    );

    expect(getByText('This is my draw canvas layout')).toBeInTheDocument();
    expect(getByText('Child Content')).toBeInTheDocument();
  });
});
