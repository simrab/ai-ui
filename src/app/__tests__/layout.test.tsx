
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout from '../layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({ className: 'geist-sans' }),
  Geist_Mono: () => ({ className: 'geist-mono' }),
}));

describe('RootLayout', () => {
  it('should render children', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Child Content</div>
      </RootLayout>
    );

    expect(getByText('Child Content')).toBeInTheDocument();
  });
});
