import test from 'node:test';
import assert from 'node:assert/strict';
import { navigationItems } from '../config/navigation.ts';
import { projectsSectionConfig } from '../config/projects.ts';

test('navigation distinguishes projects from professional experience', () => {
  assert.equal(navigationItems.find(item => item.href === '/portfolio')?.label, 'Projects');
  assert.equal(navigationItems.find(item => item.href === '/resume')?.label, 'Experience');
  assert.equal(navigationItems.some(item => item.label === 'Work'), false);
  assert.equal(projectsSectionConfig.title, 'Projects');
  assert.equal(new Set(navigationItems.map(item => item.order)).size, navigationItems.length);
});
