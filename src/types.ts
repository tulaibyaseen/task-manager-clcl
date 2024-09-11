import { TaskStatus } from './enum';

export interface Task {
  id: number;
  parent_id: number;
  project_id: number;
  assignee_id: number;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface UpdateTaskPayload {
  name: string;
  description: string;
  project_id: number;
  parent_id: number | null;
  status: TaskStatus;
}

export interface User {
  id: number;
  key: string;
  name: string;
  email: string;
  role_id: number;
  is_active: number;
  created_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role_id: number;
  profile: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}
export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  is_active: number;
}

export interface Project {
  project_id: number;
  name: string;
  description: string;
  users: ProjectUser[];
  is_active: number;
  created_at: string;
}

export interface Comment {
  id: number;
  parent_id: number;
  content: string;
}
