import { CollectionConfig } from 'payload/types';

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'user', 'type', 'is_read', 'created_at'],
    description: 'Manage system notifications',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'message',
      type: 'richText',
      required: true,
      label: 'Message',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Success', value: 'success' },
        { label: 'Error', value: 'error' },
        { label: 'Update', value: 'update' },
      ],
      label: 'Type',
    },
    {
      name: 'related_id',
      type: 'text',
      label: 'Related ID',
    },
    {
      name: 'related_type',
      type: 'select',
      options: [
        { label: 'Civic Issue', value: 'civic_issue' },
        { label: 'Campaign', value: 'campaign' },
        { label: 'Event', value: 'event' },
        { label: 'Budget Proposal', value: 'budget_proposal' },
        { label: 'Job Posting', value: 'job_posting' },
        { label: 'Worker Review', value: 'worker_review' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Related Type',
    },
    {
      name: 'is_read',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Read',
    },
    {
      name: 'action_url',
      type: 'text',
      label: 'Action URL',
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { user: { equals: user?.id } };
    },
    update: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { user: { equals: user?.id } };
    },
    create: ({ req: { user } }) => user?.user_type === 'admin',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};