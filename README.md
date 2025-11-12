# Next.js Prisma Blog Application

A full-stack blog application built with Next.js, Prisma, and NextAuth.js. Users can create accounts, write posts, and engage with content through comments and replies.

## Features

- 🔐 **Authentication**: Secure email/password authentication using NextAuth.js
- 📝 **Posts Management**: Create, edit, and delete your own posts
- 💬 **Comments System**: Comment on posts and reply to comments
- 👤 **User Profiles**: User profiles with username, email, and optional name
- 🎨 **Modern UI**: Responsive design with dark mode support
- 🚀 **Serverless Ready**: Optimized for Vercel deployment with Prisma Client engine

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Database Driver**: [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/database-drivers#driver-adapters) (for serverless deployment)

## Prerequisites

- Node.js 20+
- Docker and Docker Compose (for local development)
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <repo-url>
cd next-prisma
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=next_prisma
POSTGRES_PORT=5432

# Database URL (required for production)
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/next_prisma

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# PgAdmin (optional, for database management)
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin

# Environment
NODE_ENV=development
```

**Important**: Generate a secure `NEXTAUTH_SECRET` using:

```bash
openssl rand -base64 32
```

### 4. Start Docker Services

Start PostgreSQL and PgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on port `5432`
- PgAdmin on port `8080` (optional database management UI)

### 5. Generate Prisma Client

Generate the Prisma Client with the updated schema:

```bash
npm run db:generate
```

Or it will automatically run after `npm install` due to the `postinstall` script.

### 6. Run Database Migrations

Apply database migrations to set up the schema:

```bash
npm run db:migrate
```

This will:

- Create all database tables (users, posts, comments, replies, likes, accounts, sessions)
- Apply all migrations from the `prisma/migrations` folder

### 7. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the Application

### 1. Create an Account

1. Navigate to the home page or click "Signup"
2. Fill in the registration form:
   - **Email**: Your email address (required)
   - **Password**: Minimum 6 characters (required)
   - **Name**: Your display name (optional)
3. Click "Create Account"
4. Your username will be automatically generated from your email (part before @)

### 2. Login

1. Click "Login" from the home page
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your dashboard

### 3. Dashboard

The dashboard shows:

- Your session information (email, username, user ID)
- Links to manage your posts
- Link to view all posts

### 4. Create Posts

1. From the dashboard, click "Manage Posts →"
2. Click "+ New Post"
3. Fill in the form:
   - **Title**: Post title (required)
   - **Content**: Post content (required)
4. Click "Create"
5. Your post will appear in the posts list

### 5. Edit Posts

1. Go to "Manage Posts"
2. Click "Edit" on any of your posts
3. Modify the title or content
4. Click "Update" to save changes

### 6. Delete Posts

1. Go to "Manage Posts"
2. Click "Delete" on any of your posts
3. Confirm the deletion

### 7. View All Posts

1. Click "View All Posts →" from the dashboard, or navigate to `/posts`
2. Browse all posts from all users
3. Posts are displayed in reverse chronological order (newest first)

### 8. Comment on Posts

1. Navigate to the "All Posts" page
2. Click "Show Comments" on any post
3. Write your comment in the textarea
4. Click "Post Comment"
5. Your comment will appear below the post

### 9. Reply to Comments

1. On any post with comments, click "Reply" on a comment
2. Write your reply in the textarea
3. Click "Post Reply"
4. Your reply will appear nested under the comment

### 10. Edit Comments/Replies

1. Find your comment or reply
2. Click "Edit"
3. Modify the content
4. Click outside the textarea or press `Ctrl+Enter` to save
5. Press `Escape` to cancel

### 11. Delete Comments/Replies

1. Find your comment or reply
2. Click "Delete"
3. Confirm the deletion

**Note**: You can only edit or delete your own posts, comments, and replies.

### 12. Logout

1. Click the "Logout" button in the dashboard
2. You'll be redirected to the login page

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (generates Prisma Client and builds Next.js)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations (development)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:migrate:reset` - Reset database (development only)
- `npm run db:push` - Push schema changes to database without migrations

## Project Structure

```
next-prisma/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── posts/        # Post endpoints
│   │   ├── comments/     # Comment endpoints
│   │   └── my-posts/     # User's posts endpoints
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── posts/            # All posts page
│   └── manage-posts/     # Manage posts page
├── components/           # React components
├── config/               # Configuration files
├── generated/            # Generated Prisma Client
│   └── prisma/
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma Client instance
├── prisma/               # Prisma schema and migrations
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with email, password, username, name, and profile information
- **Post**: Blog posts with title, content, and author relationship
- **Comment**: Comments on posts with author relationship
- **Reply**: Replies to comments with author relationship
- **Like**: Likes on posts (future feature)
- **Account**: OAuth accounts (for future OAuth integration)
- **Session**: User sessions managed by NextAuth

## Deployment

### Vercel Deployment

This application is optimized for Vercel deployment with:

- **Prisma Client Engine**: Configured with `engineType = "client"` for serverless environments
- **Driver Adapter**: Uses `@prisma/adapter-pg` for PostgreSQL connections
- **Environment Variables**: Set the following in Vercel:
  - `POSTGRES_URL` - Your PostgreSQL connection string
  - `NEXTAUTH_SECRET` - Your NextAuth secret
  - `NEXTAUTH_URL` - Your production URL
  - `NODE_ENV` - Set to `production`

### Build Process

1. Prisma Client is automatically generated during build (`postinstall` script)
2. Database migrations should be run separately before deployment:
   ```bash
   npm run db:migrate:deploy
   ```

### Environment Variables in Production

Make sure to set all required environment variables in your Vercel project settings.

## Troubleshooting

### Database Connection Issues

- Ensure Docker containers are running: `docker-compose ps`
- Check PostgreSQL is accessible: `docker-compose logs db`
- Verify `POSTGRES_URL` in `.env` matches Docker configuration

### Prisma Client Issues

- Regenerate Prisma Client: `npm run db:generate`
- Check Prisma schema is valid: `npx prisma validate`

### Migration Issues

- Reset database (development only): `npm run db:migrate:reset`
- Check migration status: `npx prisma migrate status`
