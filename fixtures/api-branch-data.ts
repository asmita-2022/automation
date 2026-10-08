import {
  BranchPayload,
  BranchUpdatePayload,
} from '../api/types/branch.types';

const generatePhoneNumber = (): string => {
  const randomDigits = Math.floor(Math.random() * 1e7)
    .toString()
    .padStart(7, '0');

  return `+9779805${randomDigits}`;
};

export const generateBranchPayload = (): BranchPayload => {
  const suffix = Date.now().toString();

  return {
    name: `QA API Branch ${suffix}`,
    slug: `qa-api-branch-${suffix}`,
    email: `qa.api.branch.${suffix}@example.com`,
    phone: generatePhoneNumber(),
    address: 'Shankhamul, Kathmandu, Nepal',
    status: 'active',

    branch_admin: {
      first_name: 'Qa',
      last_name: `ApiAdmin${suffix}`,
      email: `qa.api.admin.${suffix}@example.com`,
      password: 'Admin@123',
      phone: generatePhoneNumber(),
      username: `qa.api.admin.${suffix}`,
    },
  };
};

export const generateBranchUpdatePayload =
  (): BranchUpdatePayload => {
    const suffix = Date.now().toString();

    return {
      name: `QA API Branch Updated ${suffix}`,
      email: `qa.api.branch.updated.${suffix}@example.com`,
      phone: generatePhoneNumber(),
      address: 'Jawalakhel, Lalitpur, Nepal',
      status: 'active',
    };
  };