import { CollectionConfig } from 'payload/types';

export const GovernmentOfficials: CollectionConfig = {
  slug: 'government-officials',
  admin: {
    useAsTitle: 'position',
    defaultColumns: ['position', 'department', 'user', 'is_active'],
    description: 'Manage government officials and their assignments',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User Account',
    },
    {
      name: 'department',
      type: 'select',
      required: true,
      options: [
        { label: 'Environment', value: 'environment' },
        { label: 'Infrastructure', value: 'infrastructure' },
        { label: 'Health', value: 'health' },
        { label: 'Education', value: 'education' },
        { label: 'Transport', value: 'transport' },
        { label: 'Water & Sanitation', value: 'water_sanitation' },
        { label: 'Planning', value: 'planning' },
        { label: 'Security', value: 'security' },
        { label: 'Finance', value: 'finance' },
        { label: 'Administration', value: 'administration' },
      ],
      label: 'Department',
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      label: 'Position/Title',
    },
    {
      name: 'contact_email',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'contact_phone',
      type: 'text',
      label: 'Contact Phone',
    },
    {
      name: 'office_address',
      type: 'text',
      label: 'Office Address',
    },
    {
      name: 'specializations',
      type: 'array',
      label: 'Specializations',
      fields: [
        {
          name: 'specialization',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'jurisdiction_area',
      type: 'group',
      label: 'Jurisdiction Area',
      fields: [
        {
          name: 'area_name',
          type: 'text',
          label: 'Area Name',
        },
        {
          name: 'boundary_description',
          type: 'textarea',
          label: 'Boundary Description',
        },
      ],
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Active',
    },
    {
      name: 'assigned_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Assigned By',
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.assigned_by = req.user.id;
          }
        }
        return data;
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { is_active: { equals: true } };
    },
    update: ({ req: { user } }) => user?.user_type === 'admin',
    create: ({ req: { user } }) => user?.user_type === 'admin',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};