import { CollectionConfig } from 'payload/types';

export const JobPostings: CollectionConfig = {
  slug: 'job-postings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'urgency', 'status', 'budget_min', 'budget_max', 'created_at'],
    group: 'Worker Hub',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Plumbing', value: 'plumbing' },
        { label: 'Electrical', value: 'electrical' },
        { label: 'Construction', value: 'construction' },
        { label: 'Painting', value: 'painting' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Landscaping', value: 'landscaping' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Security', value: 'security' },
        { label: 'Delivery', value: 'delivery' },
        { label: 'Creative', value: 'creative' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'latitude',
      type: 'number',
      admin: {
        description: 'GPS latitude coordinate',
      },
    },
    {
      name: 'longitude',
      type: 'number',
      admin: {
        description: 'GPS longitude coordinate',
      },
    },
    {
      name: 'budget_min',
      type: 'number',
      min: 0,
      admin: {
        description: 'Minimum budget in KES',
      },
    },
    {
      name: 'budget_max',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum budget in KES',
      },
    },
    {
      name: 'required_skills',
      type: 'array',
      fields: [
        {
          name: 'skill',
          type: 'text',
        },
      ],
      admin: {
        description: 'Skills required for this job',
      },
    },
    {
      name: 'urgency',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: [
        { label: 'Low Priority', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High Priority', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'civic_credits_reward',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Civic credits awarded upon completion',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'created_by',
      type: 'text',
      admin: {
        description: 'ID of the user who created this job',
      },
    },
    {
      name: 'assigned_worker_id',
      type: 'text',
      admin: {
        description: 'ID of the worker assigned to this job',
      },
    },
    {
      name: 'deadline',
      type: 'date',
      admin: {
        description: 'Application deadline',
      },
    },
    {
      name: 'duration_estimate',
      type: 'text',
      admin: {
        description: 'Estimated time to complete (e.g., "2 hours", "1 day")',
      },
    },
    {
      name: 'image_urls',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
      admin: {
        description: 'Job-related images or site photos',
      },
    },
    {
      name: 'contact_info',
      type: 'group',
      fields: [
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'preferred_contact',
          type: 'select',
          options: [
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
      ],
    },
    {
      name: 'applications_count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of applications received',
        readOnly: true,
      },
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show this job prominently on the platform',
      },
    },
    {
      name: 'completion_rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Rating given after job completion (1-5 stars)',
      },
    },
    {
      name: 'completion_feedback',
      type: 'textarea',
      admin: {
        description: 'Feedback about job completion',
      },
    },
  ],
  timestamps: true,
};