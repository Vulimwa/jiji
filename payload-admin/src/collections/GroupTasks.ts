import { CollectionConfig } from 'payload/types';

export const GroupTasks: CollectionConfig = {
  slug: 'group-tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'group', 'task_type', 'priority', 'status', 'due_date'],
    description: 'Manage tasks and activities for collaboration groups',
  },
  fields: [
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'collaboration-groups',
      required: true,
      label: 'Group',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Task Title',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Task Description',
    },
    {
      name: 'task_type',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Petition', value: 'petition' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Cleanup', value: 'cleanup' },
        { label: 'Research', value: 'research' },
        { label: 'Advocacy', value: 'advocacy' },
        { label: 'Fundraising', value: 'fundraising' },
        { label: 'Outreach', value: 'outreach' },
      ],
      label: 'Task Type',
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      label: 'Priority',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Review', value: 'review' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Status',
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Created By',
    },
    {
      name: 'assigned_to',
      type: 'relationship',
      relationTo: 'users',
      label: 'Assigned To',
    },
    {
      name: 'due_date',
      type: 'date',
      label: 'Due Date',
    },
    {
      name: 'completed_at',
      type: 'date',
      label: 'Completed Date',
    },
    {
      name: 'estimated_hours',
      type: 'number',
      label: 'Estimated Hours',
    },
    {
      name: 'actual_hours',
      type: 'number',
      label: 'Actual Hours',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Attachments',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'File Description',
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Task Location',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: 'Address',
        },
        {
          name: 'latitude',
          type: 'number',
          label: 'Latitude',
        },
        {
          name: 'longitude',
          type: 'number',
          label: 'Longitude',
        },
      ],
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
        if (data.status === 'completed' && !data.completed_at) {
          data.completed_at = new Date();
        }
        return data;
      },
    ],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.user_type === 'admin' || user?.user_type === 'official',
    create: ({ req: { user } }) => user?.user_type === 'admin' || user?.user_type === 'official',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};