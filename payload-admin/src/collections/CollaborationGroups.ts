import { CollectionConfig } from 'payload/types';

export const CollaborationGroups: CollectionConfig = {
  slug: 'collaboration-groups',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issue_focus', 'member_count', 'status', 'created_at'],
    description: 'Manage community collaboration groups and organizing initiatives',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Group Name',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Description',
    },
    {
      name: 'issue_focus',
      type: 'select',
      required: true,
      options: [
        { label: 'Infrastructure', value: 'infrastructure' },
        { label: 'Environment', value: 'environment' },
        { label: 'SME Empowerment', value: 'sme_empowerment' },
        { label: 'Security', value: 'security' },
        { label: 'Health', value: 'health' },
        { label: 'Education', value: 'education' },
        { label: 'Transport', value: 'transport' },
        { label: 'Housing', value: 'housing' },
        { label: 'Youth Development', value: 'youth_development' },
        { label: 'Senior Services', value: 'senior_services' },
      ],
      label: 'Issue Focus',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Location/Address',
    },
    {
      name: 'group_type',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      label: 'Group Type',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Disbanded', value: 'disbanded' },
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
      name: 'member_count',
      type: 'number',
      defaultValue: 0,
      label: 'Member Count',
    },
    {
      name: 'max_members',
      type: 'number',
      defaultValue: 100,
      label: 'Maximum Members',
    },
    {
      name: 'logo_url',
      type: 'text',
      label: 'Logo URL',
    },
    {
      name: 'banner_url',
      type: 'text',
      label: 'Banner URL',
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
      name: 'privacy_settings',
      type: 'group',
      label: 'Privacy Settings',
      fields: [
        {
          name: 'join_approval_required',
          type: 'checkbox',
          defaultValue: false,
          label: 'Require approval to join',
        },
        {
          name: 'public_activity',
          type: 'checkbox',
          defaultValue: true,
          label: 'Public activity feed',
        },
      ],
    },
    {
      name: 'contact_info',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Contact Phone',
        },
        {
          name: 'meeting_location',
          type: 'text',
          label: 'Regular Meeting Location',
        },
        {
          name: 'meeting_schedule',
          type: 'text',
          label: 'Meeting Schedule',
        },
      ],
    },
    {
      name: 'achievements',
      type: 'group',
      label: 'Achievements & Impact',
      fields: [
        {
          name: 'tasks_completed',
          type: 'number',
          defaultValue: 0,
          label: 'Tasks Completed',
        },
        {
          name: 'campaigns_supported',
          type: 'number',
          defaultValue: 0,
          label: 'Campaigns Supported',
        },
        {
          name: 'issues_addressed',
          type: 'number',
          defaultValue: 0,
          label: 'Issues Addressed',
        },
        {
          name: 'community_impact_score',
          type: 'number',
          defaultValue: 0,
          label: 'Community Impact Score',
        },
      ],
    },
    {
      name: 'is_verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Verified Group',
    },
    {
      name: 'verified_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Verified By',
    },
    {
      name: 'verification_notes',
      type: 'textarea',
      label: 'Verification Notes',
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
    read: () => true,
    update: ({ req: { user } }) => user?.user_type === 'admin',
    create: ({ req: { user } }) => user?.user_type === 'admin',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};