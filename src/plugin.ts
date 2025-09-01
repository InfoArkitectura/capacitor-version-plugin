import { registerPlugin } from '@capacitor/core';

import type { VersionManagerPlugin } from './definitions';

const VersionManager = registerPlugin<VersionManagerPlugin>('VersionManager', {
  web: () => import('./web').then(m => new m.VersionManagerWeb()),
});

export * from './definitions';
export { VersionManager };
