import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import { seoPlugin } from '@payloadcms/plugin-seo';
import path from 'path';

// Collections
import { Users } from './collections/Users';
import { CivicIssues } from './collections/CivicIssues';
import { Campaigns } from './collections/Campaigns';
import { Events } from './collections/Events';
import { BudgetProposals } from './collections/BudgetProposals';
import { BudgetCycles } from './collections/BudgetCycles';
import { Media } from './collections/Media';
import { GovernmentOfficials } from './collections/GovernmentOfficials';
import { WorkerRegistry } from './collections/WorkerRegistry';
import { Notifications } from './collections/Notifications';
import { CollaborationGroups } from './collections/CollaborationGroups';
import { GroupTasks } from './collections/GroupTasks';
import { ProjectUpdates } from './collections/ProjectUpdates';
import { ProjectFeedback } from './collections/ProjectFeedback';
import { ZoningViolations } from './collections/ZoningViolations';
import { JobPostings } from './collections/JobPostings';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- JijiSauti Admin',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
    css: path.resolve(__dirname, 'styles/admin.css'),
    components: {
      // Custom components
      graphics: {
        Logo: path.resolve(__dirname, 'components/Logo'),
        Icon: path.resolve(__dirname, 'components/Icon'),
      },
    },
  },
  editor: slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.SUPABASE_CONNECTION_STRING,
    },
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  collections: [
    Users,
    CivicIssues,
    Campaigns,
    Events,
    BudgetProposals,
    BudgetCycles,
    ProjectUpdates,
    ProjectFeedback,
    Media,
    GovernmentOfficials,
    WorkerRegistry,
    Notifications,
    CollaborationGroups,
    GroupTasks,
    ZoningViolations,
    JobPostings,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    seoPlugin({
      collections: ['civic-issues', 'campaigns', 'events'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title} | JijiSauti`,
      generateDescription: ({ doc }) => doc.description || 'JijiSauti Civic Platform',
    }),
  ],
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],
});