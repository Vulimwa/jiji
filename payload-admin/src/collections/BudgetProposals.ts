import { CollectionConfig } from 'payload/types';

export const BudgetProposals: CollectionConfig = {
  slug: 'budget-proposals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'estimated_cost', 'current_progress', 'created_at'],
    group: 'Community Budget',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Infrastructure', value: 'infrastructure' },
        { label: 'Education', value: 'education' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Environment', value: 'environment' },
        { label: 'Transportation', value: 'transportation' },
        { label: 'Public Safety', value: 'public_safety' },
        { label: 'Recreation', value: 'recreation' },
        { label: 'Technology', value: 'technology' },
      ],
    },
    {
      name: 'estimated_cost',
      type: 'number',
      required: true,
      admin: {
        description: 'Estimated cost in KSh',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Funded', value: 'funded' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'current_progress',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Current implementation progress (0-100%)',
      },
    },
    {
      name: 'address',
      type: 'text',
      admin: {
        description: 'Project location address',
      },
    },
    {
      name: 'cycle_id',
      type: 'text',
      required: true,
      admin: {
        description: 'Budget cycle ID from Supabase',
      },
    },
    {
      name: 'submitted_by',
      type: 'text',
      admin: {
        description: 'User ID who submitted this proposal',
      },
    },
    {
      name: 'reviewed_by',
      type: 'text',
      admin: {
        description: 'Admin ID who reviewed this proposal',
      },
    },
    {
      name: 'project_manager_id',
      type: 'text',
      admin: {
        description: 'User ID of assigned project manager',
      },
    },
    {
      name: 'total_tokens',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total voting tokens received',
      },
    },
    {
      name: 'image_urls',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
      admin: {
        description: 'Project images and media',
      },
    },
    {
      name: 'voice_url',
      type: 'text',
      admin: {
        description: 'Voice note URL',
      },
    },
    {
      name: 'review_notes',
      type: 'textarea',
      admin: {
        description: 'Admin review notes',
      },
    },
    {
      name: 'implementation_start_date',
      type: 'date',
      admin: {
        description: 'When implementation started',
      },
    },
    {
      name: 'expected_completion_date',
      type: 'date',
      admin: {
        description: 'Expected completion date',
      },
    },
    {
      name: 'actual_completion_date',
      type: 'date',
      admin: {
        description: 'Actual completion date',
      },
    },
    {
      name: 'contractor_info',
      type: 'json',
      admin: {
        description: 'Contractor and implementation details',
      },
    },
  ],
  timestamps: true,
};