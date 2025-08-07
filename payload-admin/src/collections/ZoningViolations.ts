import { CollectionConfig } from 'payload/types';

export const ZoningViolations: CollectionConfig = {
  slug: 'zoning-violations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'violation_type', 'status', 'severity', 'created_at'],
    group: 'Civic Management',
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
      type: 'textarea',
      required: true,
    },
    {
      name: 'violation_type',
      type: 'select',
      required: true,
      options: [
        { label: 'Height Limit Exceeded', value: 'height_limit_exceeded' },
        { label: 'Zoning Misuse', value: 'zoning_misuse' },
        { label: 'Inadequate Parking', value: 'inadequate_parking' },
        { label: 'Building Without Permit', value: 'building_without_permit' },
        { label: 'Environmental Violation', value: 'environmental_violation' },
        { label: 'Safety Code Violation', value: 'safety_code_violation' },
      ],
    },
    {
      name: 'address',
      type: 'text',
      admin: {
        description: 'Physical address or location description',
      },
    },
    {
      name: 'plot_number',
      type: 'text',
      admin: {
        description: 'Official plot number if known',
      },
    },
    {
      name: 'developer_name',
      type: 'text',
      admin: {
        description: 'Name of developer or property owner',
      },
    },
    {
      name: 'evidence_description',
      type: 'textarea',
      admin: {
        description: 'Description of evidence provided',
      },
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Investigation', value: 'pending' },
        { label: 'Under Investigation', value: 'investigating' },
        { label: 'Confirmed Violation', value: 'confirmed' },
        { label: 'Resolved', value: 'resolved' },
      ],
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
        description: 'Evidence photos and documentation',
      },
    },
    {
      name: 'reporter_id',
      type: 'text',
      admin: {
        description: 'ID of the user who reported this violation',
      },
    },
    {
      name: 'is_anonymous',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this was reported anonymously',
      },
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
      name: 'assigned_investigator_id',
      type: 'text',
      admin: {
        description: 'ID of assigned government official',
      },
    },
    {
      name: 'investigation_notes',
      type: 'richText',
      admin: {
        description: 'Internal investigation notes and updates',
      },
    },
    {
      name: 'resolution_date',
      type: 'date',
      admin: {
        description: 'Date when violation was resolved',
      },
    },
    {
      name: 'resolution_notes',
      type: 'richText',
      admin: {
        description: 'Details about how the violation was resolved',
      },
    },
  ],
  timestamps: true,
};