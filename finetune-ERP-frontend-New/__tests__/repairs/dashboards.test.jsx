// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import IssuesDashboard from '../../src/pages/IssuesDashboard';
import OtherIssuesDashboard from '../../src/pages/OtherIssuesDashboard';
import QuestionsDashboard from '../../src/pages/QuestionsDashboard';

vi.mock('../../src/api/erpApi', () => ({
  useGetIssuesQuery: () => ({ data: [{ id: 1, name: 'Screen' }], isLoading: false }),
  useCreateIssueMutation: () => [vi.fn()],
  useUpdateIssueMutation: () => [vi.fn()],
  useDeleteIssueMutation: () => [vi.fn()],
  useGetOtherIssuesQuery: () => ({ data: [{ id: 1, name: 'Battery' }], isLoading: false }),
  useCreateOtherIssueMutation: () => [vi.fn()],
  useUpdateOtherIssueMutation: () => [vi.fn()],
  useDeleteOtherIssueMutation: () => [vi.fn()],
  useGetQuestionsQuery: () => ({ data: [{ id: 1, text: 'Q1' }], isLoading: false }),
  useCreateQuestionMutation: () => [vi.fn()],
  useUpdateQuestionMutation: () => [vi.fn()],
  useDeleteQuestionMutation: () => [vi.fn()],
}));

test('dashboard pages render fetched entities', () => {
  render(<IssuesDashboard />);
  expect(screen.getByText('Screen')).toBeTruthy();
  render(<OtherIssuesDashboard />);
  expect(screen.getByText('Battery')).toBeTruthy();
  render(<QuestionsDashboard />);
  expect(screen.getByText('Q1')).toBeTruthy();
});
