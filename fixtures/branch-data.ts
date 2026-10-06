export interface BranchAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface BranchData {
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
  admin: BranchAdminData;
}

export interface BranchUpdateData {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
}

const generatePhoneNumber = (): string => {
  const randomDigits = Math.floor(Math.random() * 1e7)
    .toString()
    .padStart(7, '0');

  return `9805${randomDigits}`;
};

export const generateBranchData = (): BranchData => {
  const suffix = Date.now().toString();

  return {
    name: `QA Branch ${suffix}`,
    slug: `qa-branch-${suffix}`,
    phone: generatePhoneNumber(),
    email: `qa.branch.${suffix}@example.com`,
    address: 'Shankhamul, Kathmandu, Nepal',
    status: 'Active',
    admin: {
      firstName: 'Qa',
      lastName: `Admin${suffix}`,
      email: `qa.admin.${suffix}@example.com`,
      password: 'Admin@123',
      phone: generatePhoneNumber(),
    },
  };
};

export const generateBranchUpdateData = (): BranchUpdateData => {
  const suffix = Date.now().toString();

  return {
    name: `QA Branch Updated ${suffix}`,
    phone: generatePhoneNumber(),
    email: `qa.branch.updated.${suffix}@example.com`,
    address: 'Jawalakhel, Lalitpur, Nepal',
    status: 'Active',
  };
};