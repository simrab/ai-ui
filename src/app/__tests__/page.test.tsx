
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('should render the main content', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Content goes here')).toBeInTheDocument();
  });
});
