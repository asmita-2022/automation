import { test as base } from '@playwright/test';

import { ApiClient } from '../api/client';
import { AuthService } from '../api/services/auth.service';
import { BranchService } from '../api/services/branch.service';

import {
  generateBranchPayload,
  generateBranchUpdatePayload,
} from './api-branch-data';

import {
  BranchPayload,
  BranchUpdatePayload,
} from '../api/types/branch.types';

interface ApiFixtures {
  branchService: BranchService;
  branchPayload: BranchPayload;
  branchUpdatePayload: BranchUpdatePayload;
}

export const test = base.extend<ApiFixtures>({
  branchService: async ({ request }, use) => {
    const apiClient = new ApiClient(request);

    const authService = new AuthService(apiClient);

    const email = process.env.ORG_ADMIN_EMAIL as string;
    const password = process.env.ORG_ADMIN_PASSWORD as string;

    await authService.login(email, password);

    await use(new BranchService(apiClient));
  },

  branchPayload: async ({}, use) => {
    await use(generateBranchPayload());
  },

  branchUpdatePayload: async ({}, use) => {
    await use(generateBranchUpdatePayload());
  },
});

export { expect } from '@playwright/test';