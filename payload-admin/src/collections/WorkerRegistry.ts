import { CollectionConfig } from 'payload/types';

export const WorkerRegistry: CollectionConfig = {
  slug: 'worker-registry',
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'services', 'verification_status', 'rating', 'is_available'],
    description: 'Manage informal worker registry',
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
      name: 'services',
      type: 'array',
      required: true,
      label: 'Services Offered',
      fields: [
        {
          name: 'service',
          type: 'select',
          options: [
            { label: 'Plumbing', value: 'plumbing' },
            { label: 'Electrical', value: 'electrical' },
            { label: 'Carpentry', value: 'carpentry' },
            { label: 'Masonry', value: 'masonry' },
            { label: 'Painting', value: 'painting' },
            { label: 'Cleaning', value: 'cleaning' },
            { label: 'Gardening', value: 'gardening' },
            { label: 'Waste Collection', value: 'waste_collection' },
            { label: 'Delivery', value: 'delivery' },
            { label: 'Construction', value: 'construction' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
      ],
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
      name: 'verification_status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Verified', value: 'verified' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Suspended', value: 'suspended' },
      ],
      label: 'Verification Status',
    },
    {
      name: 'hourly_rate',
      type: 'number',
      label: 'Hourly Rate (KSh)',
    },
    {
      name: 'daily_rate',
      type: 'number',
      label: 'Daily Rate (KSh)',
    },
    {
      name: 'service_radius',
      type: 'number',
      defaultValue: 5000,
      label: 'Service Radius (meters)',
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 0,
      label: 'Average Rating',
    },
    {
      name: 'total_reviews',
      type: 'number',
      defaultValue: 0,
      label: 'Total Reviews',
    },
    {
      name: 'total_jobs',
      type: 'number',
      defaultValue: 0,
      label: 'Total Jobs Completed',
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
      name: 'portfolio_images',
      type: 'array',
      label: 'Portfolio Images',
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
      name: 'certifications',
      type: 'array',
      label: 'Certifications',
      fields: [
        {
          name: 'certification',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      label: 'Languages Spoken',
      fields: [
        {
          name: 'language',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'tools_equipment',
      type: 'array',
      label: 'Tools & Equipment',
      fields: [
        {
          name: 'tool',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'availability_schedule',
      type: 'richText',
      label: 'Availability Schedule',
    },
    {
      name: 'is_available',
      type: 'checkbox',
      defaultValue: true,
      label: 'Currently Available',
    },
    {
      name: 'verified_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Verified By',
    },
    {
      name: 'verification_date',
      type: 'date',
      label: 'Verification Date',
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.user = req.user.id;
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
          { verification_status: { equals: 'verified' } },
          { user: { equals: user?.id } },
        ]
      };
    },
    update: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { user: { equals: user?.id } };
    },
    create: () => true,
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};