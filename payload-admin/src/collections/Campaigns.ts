import { CollectionConfig } from 'payload/types';

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'creator', 'current_signatures', 'admin_approved'],
    description: 'Manage community campaigns and petitions',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Campaign Title',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Campaign Description',
    },
    {
      name: 'goals',
      type: 'richText',
      label: 'Campaign Goals',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Status',
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Campaign Creator',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Infrastructure', value: 'infrastructure' },
        { label: 'Environment', value: 'environment' },
        { label: 'Social Services', value: 'social_services' },
        { label: 'Transportation', value: 'transportation' },
        { label: 'Education', value: 'education' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Category',
    },
    {
      name: 'target_signatures',
      type: 'number',
      label: 'Target Signatures',
    },
    {
      name: 'current_signatures',
      type: 'number',
      defaultValue: 0,
      label: 'Current Signatures',
    },
    {
      name: 'target_amount',
      type: 'number',
      label: 'Target Amount (KSh)',
    },
    {
      name: 'current_amount',
      type: 'number',
      defaultValue: 0,
      label: 'Current Amount (KSh)',
    },
    {
      name: 'deadline',
      type: 'date',
      label: 'Campaign Deadline',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Campaign Images',
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
      name: 'petition_text',
      type: 'richText',
      label: 'Petition Text',
    },
    {
      name: 'required_documents',
      type: 'array',
      label: 'Required Documents',
      fields: [
        {
          name: 'document',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'admin_approved',
      type: 'checkbox',
      defaultValue: false,
      label: 'Admin Approved',
    },
    {
      name: 'approved_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Approved By',
    },
    {
      name: 'approval_date',
      type: 'date',
      label: 'Approval Date',
    },
    {
      name: 'is_public',
      type: 'checkbox',
      defaultValue: true,
      label: 'Public Campaign',
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
            data.creator = req.user.id;
          }
        }
        return data;
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { 
        or: [
          { is_public: { equals: true } },
          { creator: { equals: user?.id } },
        ]
      };
    },
    update: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { creator: { equals: user?.id } };
    },
    create: () => true,
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};