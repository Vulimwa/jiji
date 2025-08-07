import { CollectionConfig } from 'payload/types';

export const ProjectFeedback: CollectionConfig = {
  slug: 'project-feedback',
  admin: {
    useAsTitle: 'feedback_text',
    defaultColumns: ['proposal_id', 'user_id', 'rating', 'created_at'],
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
      name: 'user_id',
      type: 'text',
      required: true,
      admin: {
        description: 'User ID who submitted feedback',
      },
    },
    {
      name: 'feedback_text',
      type: 'textarea',
      admin: {
        description: 'Community feedback text',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Project rating (1-5 stars)',
      },
    },
    {
      name: 'before_photo_url',
      type: 'text',
      admin: {
        description: 'Before photo URL',
      },
    },
    {
      name: 'after_photo_url',
      type: 'text',
      admin: {
        description: 'After photo URL',
      },
    },
    {
      name: 'impact_story',
      type: 'textarea',
      admin: {
        description: 'Personal impact story',
      },
    },
  ],
  timestamps: true,
};