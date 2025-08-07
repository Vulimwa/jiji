import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    cookies: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    useAsTitle: 'full_name',
    defaultColumns: ['full_name', 'email', 'user_type', 'is_verified'],
    description: 'Manage platform users and their profiles',
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
    },
    {
      name: 'user_type',
      type: 'select',
      required: true,
      defaultValue: 'resident',
      options: [
        { label: 'Resident', value: 'resident' },
        { label: 'Informal Worker', value: 'informal_worker' },
        { label: 'Government Official', value: 'official' },
        { label: 'Admin', value: 'admin' },
      ],
      label: 'User Type',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
    },
    {
      name: 'civic_credits',
      type: 'number',
      defaultValue: 0,
      label: 'Civic Credits',
    },
    {
      name: 'is_verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Verified',
    },
    {
      name: 'profile_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
    },
    {
      name: 'date_of_birth',
      type: 'date',
      label: 'Date of Birth',
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'prefer_not_to_say' },
      ],
      label: 'Gender',
    },
    {
      name: 'occupation',
      type: 'text',
      label: 'Occupation',
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
    read: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { id: { equals: user?.id } };
    },
    update: ({ req: { user } }) => {
      if (user?.user_type === 'admin') return true;
      return { id: { equals: user?.id } };
    },
    create: ({ req: { user } }) => user?.user_type === 'admin',
    delete: ({ req: { user } }) => user?.user_type === 'admin',
  },
};