import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    description: 'Manage media files for the platform',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Profile Pictures', value: 'profile_pictures' },
        { label: 'Issue Evidence', value: 'issue_evidence' },
        { label: 'Campaign Images', value: 'campaign_images' },
        { label: 'Event Images', value: 'event_images' },
        { label: 'Proposal Images', value: 'proposal_images' },
        { label: 'Documents', value: 'documents' },
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
      ],
      label: 'Category',
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
      name: 'uploaded_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Uploaded By',
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.uploaded_by = req.user.id;
          }
        }
        return data;
      },
    ],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => user?.user_type === 'admin',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};