export type BranchStatus = 'Active' | 'Inactive';

export interface BranchAdminPayload {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  phone: string;
}

export interface BranchPayload {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  status: BranchStatus;
  branch_admin: BranchAdminPayload;
}

export interface BranchUpdatePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: BranchStatus;
}

export interface BranchAdmin {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface Branch {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  status: BranchStatus;
  is_active: boolean;
  admin: BranchAdmin;
  created_at: string;
  updated_at: string;
}

export interface BranchListItem {
  id: number;
  name: string;
  slug: string;
  address: string;
  status: BranchStatus;
  is_active: boolean;
}

export interface PaginatedBranchList {
  count: number;
  next: string | null;
  previous: string | null;
  results: BranchListItem[];
}