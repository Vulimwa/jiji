
import path from 'path'
import { buildConfig } from 'payload/config'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'

export default buildConfig({
  admin: { 
    user: Users.slug,
  },
  collections: [Users, Media],
  db: postgresAdapter({
    url: process.env.DATABASE_URL,
  }),
  editor: slateEditor(),
})
