import { CollectionConfig } from 'payload/types';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'event_date', 'organizer', 'status', 'admin_approved'],
    description: 'Manage community events and gatherings',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Title',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Event Description',
    },
    {
      name: 'event_date',
      type: 'date',
      required: true,
      label: 'Event Date',
    },
    {
      name: 'end_date',
      type: 'date',
      label: 'End Date',
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Event Organizer',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Community Meeting', value: 'community_meeting' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Town Hall', value: 'town_hall' },
        { label: 'Social Event', value: 'social_event' },
        { label: 'Educational', value: 'educational' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Sports', value: 'sports' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Category',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planned',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Status',
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location',
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
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
      name: 'max_attendees',
      type: 'number',
      label: 'Maximum Attendees',
    },
    {
      name: 'current_attendees',
      type: 'number',
      defaultValue: 0,
      label: 'Current Attendees',
    },
    {
      name: 'registration_required',
      type: 'checkbox',
      defaultValue: false,
      label: 'Registration Required',
    },
    {
      name: 'registration_fee',
      type: 'number',
      defaultValue: 0,
      label: 'Registration Fee (KSh)',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Event Images',
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
      name: 'agenda',
      type: 'richText',
      label: 'Event Agenda',
    },
    {
      name: 'requirements',
      type: 'array',
      label: 'Requirements',
      fields: [
        {
          name: 'requirement',
          type: 'text',
          required: true,
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
          name: 'website',
          type: 'text',
          label: 'Website',
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
      label: 'Public Event',
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
            data.organizer = req.user.id;
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
          { organizer: { equals: user?.id } },
        ]
      };
    },
    update: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { organizer: { equals: user?.id } };
    },
    create: () => true,
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};