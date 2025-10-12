
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout from '../app/layout';

vi.mock('next/font/google', () => ({
  Geist: () => ({ className: 'geist-sans' }),
  Geist_Mono: () => ({ className: 'geist-mono' }),
}));

describe('RootLayout', () => {
  it('should render children', () => {
    const { getByText } = render(
      <RootLayout>
        <span>Child Content</span>
      </RootLayout>
    );

    expect(getByText('Child Content')).toBeInTheDocument();
  });
});
