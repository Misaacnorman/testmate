
'use server';

import type { Test } from '@/lib/types';

// This is a mock database implementation.
// In a real application, you would use a proper database.

let tests: Test[] = [];

export async function getTests(): Promise<Test[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(tests));
}

export async function saveTests(newTests: Test[]): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  tests = JSON.parse(JSON.stringify(newTests));
}

export default async function DataPage() {
    return null;
}
