import path from 'path'
import { buildConfig } from 'payload/config'
import { Users } from './collections/Users'
import { Media } from './collections/Media'

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  db: {
    url: process.env.DATABASE_URL || '',
    adapter: 'postgres',
  },
  editor: {
    enabled: false,
  },
})
