import { CollectionConfig } from 'payload/types';

export const ProjectUpdates: CollectionConfig = {
  slug: 'project-updates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'proposal_id', 'update_type', 'progress_percent', 'created_at'],
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
      name: 'proposal_id',
      type: 'text',
      required: true,
      admin: {
        description: 'Budget proposal ID from Supabase',
      },
    },
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
      name: 'update_type',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General Update', value: 'general' },
        { label: 'Milestone', value: 'milestone' },
        { label: 'Progress Report', value: 'progress' },
        { label: 'Issue/Delay', value: 'issue' },
        { label: 'Completion', value: 'completion' },
      ],
    },
    {
      name: 'progress_percent',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Project progress percentage (0-100)',
      },
    },
    {
      name: 'photo_urls',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
      admin: {
        description: 'Progress photos and documentation',
      },
    },
    {
      name: 'posted_by',
      type: 'text',
      admin: {
        description: 'User ID who posted this update',
      },
    },
  ],
  timestamps: true,
};