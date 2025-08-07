# JijiSauti Admin Panel

A comprehensive admin panel for the JijiSauti Civic Intelligence Platform, built with Payload CMS.

## Features

- **User Management**: Manage platform users, roles, and permissions
- **Content Management**: Manage civic issues, campaigns, events, and budget proposals
- **Media Management**: Upload and organize media files
- **Analytics Dashboard**: View platform statistics and insights
- **Government Official Management**: Assign and manage government officials
- **Worker Registry**: Manage informal worker registrations and verifications
- **Notification System**: Send and manage notifications to users

## Technology Stack

- **Backend**: Payload CMS (Node.js/Express)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Built-in Payload Auth
- **File Storage**: Local storage with cloud storage options
- **API**: Auto-generated REST and GraphQL APIs

## Quick Start

### Prerequisites

- Node.js 16+ 
- PostgreSQL database (or Supabase connection)
- npm or yarn

### Installation

1. Navigate to the admin directory:
```bash
cd payload-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```bash
# Required variables
PAYLOAD_SECRET=your-secret-key-here
DATABASE_URL=your-postgresql-connection-string
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

6. Visit `http://localhost:3001/admin` to access the admin panel

### Production Setup

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Configuration

### Database Setup

The admin panel uses the same PostgreSQL database as the main application. Make sure to:

1. Use the same database connection string
2. Ensure all required tables exist (run the main schema first)
3. Configure proper user permissions

### CORS Configuration

To avoid SAML errors and ensure proper integration with the frontend:

```javascript
// In src/payload.config.ts
cors: {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
},
csrf: [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
],
```

### Authentication

The admin panel uses Payload's built-in authentication system. Initial admin user can be created through the setup wizard on first run.

## API Integration

The admin panel provides REST and GraphQL APIs that can be consumed by the frontend application:

### REST API
- Base URL: `http://localhost:3001/api`
- Collections: `/users`, `/civic-issues`, `/campaigns`, etc.
- Authentication: Session-based or API keys

### GraphQL API
- Endpoint: `http://localhost:3001/api/graphql`
- Schema: Auto-generated from collections
- Playground: Available in development

## Collections

### Users
- User profiles and authentication
- Role-based access control
- User type management (resident, official, admin)

### Civic Issues
- Issue reporting and tracking
- Status management
- Official assignments

### Campaigns
- Campaign creation and approval
- Signature tracking
- Status management

### Events
- Event planning and management
- Attendance tracking
- Approval workflow

### Budget Proposals
- Participatory budgeting
- Proposal review and approval
- Token-based voting integration

### Media
- File upload and management
- Image optimization
- Categorization and tagging

## Security Features

- **Authentication**: Session-based authentication with secure cookies
- **Authorization**: Role-based access control for all collections
- **CORS Protection**: Configured to prevent cross-origin attacks
- **Input Validation**: Automatic validation of all inputs
- **Rate Limiting**: Built-in rate limiting for API endpoints

## Deployment

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Using PM2

```json
{
  "apps": [{
    "name": "jiji-sauti-admin",
    "script": "dist/server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production",
      "PORT": 3001
    }
  }]
}
```

### Environment Variables for Production

```bash
NODE_ENV=production
PAYLOAD_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
FRONTEND_URL=https://your-domain.com
PAYLOAD_PUBLIC_SERVER_URL=https://admin.your-domain.com
```

## Customization

### Adding New Collections

1. Create a new collection file in `src/collections/`
2. Define the collection schema
3. Add to `payload.config.ts`
4. Restart the server

### Custom Components

Add custom React components in `src/components/` and reference them in the admin configuration.

### Styling

Customize the admin panel appearance by modifying `src/styles/admin.css`.

## Monitoring and Logging

The admin panel includes:

- **Error Logging**: Comprehensive error tracking
- **Access Logs**: API request logging
- **Performance Metrics**: Response time monitoring
- **User Activity**: Admin action tracking

## Support

For issues and questions:

1. Check the [Payload CMS documentation](https://payloadcms.com/docs)
2. Review the configuration files
3. Check the application logs
4. Contact the development team

## License

This admin panel is part of the JijiSauti platform and follows the same licensing terms.