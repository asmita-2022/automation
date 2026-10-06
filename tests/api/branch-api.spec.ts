import { test, expect } from '../../fixtures/api.fixture';

test.describe('Branch API CRUD Tests', () => {
  test('CREATE BRANCH', async ({
    branchService,
    branchPayload,
  }) => {
    const createdBranch =
      await branchService.createBranch(branchPayload);

    expect(createdBranch).toBeDefined();
    expect(createdBranch.id).toBeGreaterThan(0);

    expect(createdBranch.name).toBe(
      branchPayload.name
    );

    expect(createdBranch.slug).toBe(
      branchPayload.slug
    );

    expect(createdBranch.email).toBe(
      branchPayload.email
    );

    expect(createdBranch.phone).toBe(
      branchPayload.phone
    );

    expect(createdBranch.address).toBe(
      branchPayload.address
    );

    expect(createdBranch.status).toBe(
      branchPayload.status
    );

    expect(createdBranch.admin).toBeDefined();
  });

  test('READ BRANCH', async ({
    branchService,
    branchPayload,
  }) => {
    const createdBranch =
      await branchService.createBranch(branchPayload);

    const branch =
      await branchService.getBranch(createdBranch.slug);

    expect(branch.id).toBe(
      createdBranch.id
    );

    expect(branch.name).toBe(
      branchPayload.name
    );

    expect(branch.slug).toBe(
      branchPayload.slug
    );

    expect(branch.email).toBe(
      branchPayload.email
    );

    expect(branch.address).toBe(
      branchPayload.address
    );
  });

  test('UPDATE BRANCH', async ({
    branchService,
    branchPayload,
    branchUpdatePayload,
  }) => {
    const createdBranch =
      await branchService.createBranch(branchPayload);

    const updatedBranch =
      await branchService.updateBranch(
        createdBranch.slug,
        branchUpdatePayload
      );

    expect(updatedBranch.id).toBe(
      createdBranch.id
    );

    expect(updatedBranch.name).toBe(
      branchUpdatePayload.name
    );

    expect(updatedBranch.email).toBe(
      branchUpdatePayload.email
    );

    expect(updatedBranch.phone).toBe(
      branchUpdatePayload.phone
    );

    expect(updatedBranch.address).toBe(
      branchUpdatePayload.address
    );

    expect(updatedBranch.status).toBe(
      branchUpdatePayload.status
    );
  });

  test('DELETE BRANCH', async ({
    branchService,
    branchPayload,
  }) => {
    const createdBranch =
      await branchService.createBranch(branchPayload);

    await branchService.deleteBranch(
      createdBranch.slug
    );

    await expect(
      branchService.getBranch(createdBranch.slug)
    ).rejects.toThrow();
  });

  test('LIST BRANCHES', async ({
    branchService,
  }) => {
    const branches =
      await branchService.listBranches();

    expect(branches).toBeDefined();
    expect(branches.count).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(branches.results)).toBe(true);
  });

  test('NEGATIVE - GET NON-EXISTING BRANCH', async ({
    branchService,
  }) => {
    const nonExistingSlug =
      `branch-that-does-not-exist-${Date.now()}`;

    await expect(
      branchService.getBranch(nonExistingSlug)
    ).rejects.toThrow();
  });
});