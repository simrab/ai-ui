
import DrawLayout from '@/app/draw/layout';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
