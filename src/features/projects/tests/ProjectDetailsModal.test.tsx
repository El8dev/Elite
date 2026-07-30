import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';

describe('ProjectDetailsModal', () => {
  it('renders nothing when no project is provided', () => {
    const { container } = render(<ProjectDetailsModal project={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
