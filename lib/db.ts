import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  role: "ADMIN" | "USER"
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "LOW" | "MEDIUM" | "HIGH"
  project_id: string
  assignee_id: string | null
  due_date: string | null
  created_at: string
  updated_at: string
}
