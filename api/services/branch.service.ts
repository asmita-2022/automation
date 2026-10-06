import { expect } from '@playwright/test';
import { ApiClient } from './../client';

import {
  Branch,
  BranchPayload,
  BranchStatus,
  BranchUpdatePayload,
  PaginatedBranchList,
} from '../types/branch.types';

export class BranchService {
  constructor(private readonly apiClient: ApiClient) {}

  async createBranch(payload: BranchPayload): Promise<Branch> {
    const response = await this.apiClient.post(
      'branch/branches/',
      payload
    );

    expect(
      response.status(),
      'Create branch should return 201'
    ).toBe(201);

    const body = await response.json();

    return body.data;
  }

  async getBranch(slug: string): Promise<Branch> {
    const response = await this.apiClient.get(
      `branch/branches/${slug}/`
    );

    expect(
      response.status(),
      'Get branch should return 200'
    ).toBe(200);

    const body = await response.json();

    return body.data;
  }

  async listBranches(
    params?: Record<string, string | number>
  ): Promise<PaginatedBranchList> {
    const response = await this.apiClient.get(
      'branch/branches/',
      params
    );

    expect(
      response.status(),
      'List branches should return 200'
    ).toBe(200);

    return response.json();
  }

  async updateBranch(
    slug: string,
    payload: BranchUpdatePayload
  ): Promise<Branch> {
    const response = await this.apiClient.put(
      `branch/branches/${slug}/`,
      payload
    );

    expect(
      response.status(),
      'Update branch should return 200'
    ).toBe(200);

    const body = await response.json();

    return body.data;
  }

  async updateBranchStatus(
    slug: string,
    status: BranchStatus
  ): Promise<Branch> {
    const response = await this.apiClient.patch(
      `branch/branches/${slug}/`,
      { status }
    );

    expect(
      response.status(),
      'Partially update branch should return 200'
    ).toBe(200);

    const body = await response.json();

    return body.data;
  }

  async deleteBranch(slug: string): Promise<void> {
    const response = await this.apiClient.delete(
      `branch/branches/${slug}/`
    );

    expect(
      response.status(),
      'Delete branch should return 200'
    ).toBe(200);
  }
}