import { CollectionConfig } from 'payload/types';

export const BudgetCycles: CollectionConfig = {
  slug: 'budget-cycles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'total_budget', 'voting_start', 'voting_end'],
    description: 'Manage participatory budget cycles',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Cycle Title',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Cycle Description',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Open for Submissions', value: 'open_submissions' },
        { label: 'Voting', value: 'voting' },
        { label: 'Completed', value: 'completed' },
      ],
      label: 'Status',
    },
    {
      name: 'total_budget',
      type: 'number',
      required: true,
      label: 'Total Budget (KSh)',
    },
    {
      name: 'tokens_per_user',
      type: 'number',
      defaultValue: 5,
      label: 'Tokens per User',
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      label: 'End Date',
    },
    {
      name: 'voting_start',
      type: 'date',
      required: true,
      label: 'Voting Start Date',
    },
    {
      name: 'voting_end',
      type: 'date',
      required: true,
      label: 'Voting End Date',
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Created By',
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.created_by = req.user.id;
          }
        }
        return data;
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { status: { in: ['open_submissions', 'voting', 'completed'] } };
    },
    update: ({ req: { user } }) => user?.user_type === 'admin',
    create: ({ req: { user } }) => user?.user_type === 'admin',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};