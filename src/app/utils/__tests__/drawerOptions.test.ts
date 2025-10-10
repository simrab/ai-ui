
import { describe, it, expect } from 'vitest';
import { options } from '../drawerOptions';

describe('drawerOptions', () => {
  it('should have the correct properties', () => {
    expect(options).toEqual({
      acceptedImageMimeTypes: ['image/jpeg'],
      persistenceKey: 'draw-canvas',
    });
  });
});
