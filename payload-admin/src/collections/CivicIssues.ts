import { CollectionConfig } from 'payload/types';

export const CivicIssues: CollectionConfig = {
  slug: 'civic-issues',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'reporter', 'created_at'],
    description: 'Manage civic issues reported by citizens',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Issue Title',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Issue Description',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Sewage & Drainage', value: 'sewage' },
        { label: 'Noise Pollution', value: 'noise' },
        { label: 'Illegal Construction', value: 'construction' },
        { label: 'Power Issues', value: 'power' },
        { label: 'Road Problems', value: 'roads' },
        { label: 'Waste Management', value: 'waste' },
        { label: 'Street Lighting', value: 'lighting' },
        { label: 'Drainage Issues', value: 'drainage' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Category',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'reported',
      options: [
        { label: 'Reported', value: 'reported' },
        { label: 'Acknowledged', value: 'acknowledged' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
      label: 'Status',
    },
    {
      name: 'priority_votes',
      type: 'number',
      defaultValue: 0,
      label: 'Priority Votes',
    },
    {
      name: 'urgency_level',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
      label: 'Urgency Level',
    },
    {
      name: 'reporter',
      type: 'relationship',
      relationTo: 'users',
      label: 'Reporter',
    },
    {
      name: 'assigned_officer',
      type: 'relationship',
      relationTo: 'government-officials',
      label: 'Assigned Officer',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Evidence Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location',
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
    {
      name: 'county_response',
      type: 'richText',
      label: 'County Response',
    },
    {
      name: 'resolution_notes',
      type: 'richText',
      label: 'Resolution Notes',
    },
    {
      name: 'resolution_date',
      type: 'date',
      label: 'Resolution Date',
    },
    {
      name: 'is_public',
      type: 'checkbox',
      defaultValue: true,
      label: 'Public Issue',
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
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.reporter = req.user.id;
          }
        }
        return data;
      },
    ],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.user_type === 'admin' || user?.user_type === 'official',
    create: () => true,
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};