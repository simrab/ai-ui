
import { options } from '@/lib/drawerOptions';
import { describe, expect, it } from 'vitest';

describe('drawerOptions', () => {
  it('should have the correct properties', () => {
    expect(options).toEqual({
      acceptedImageMimeTypes: ['image/jpeg'],
      persistenceKey: 'draw-canvas',
    });
  });
});
