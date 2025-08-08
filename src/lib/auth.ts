import { createClient } from '@blinkdotnew/sdk';

// TaskSphere Authentication Service
export const authService = createClient({
  projectId: 'tasksphere-collaborative-task-boards-9duzugk2',
  authRequired: true
});

// Disable analytics to prevent network errors
if (authService.analytics && typeof authService.analytics.disable === 'function') {
  authService.analytics.disable();
}

// Export as default for convenience
export default authService;