# Overview

TAPMOVE is a Korean fitness seminar and product sales website built as a full-stack web application. The platform facilitates seminar registration, review management with passcode protection, product purchases through Toss Payments, and bulk purchasing for qualified participants. The site features a comprehensive admin panel for managing applications, reviews, and orders, with a focus on Korean language UI and mobile-responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Design System**: Korean typography (Noto Sans KR) with white-based, high-contrast design using rounded corners and soft shadows

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with configurable storage
- **Security**: Rate limiting, password hashing with bcryptjs, CORS handling
- **Content Filtering**: Korean profanity and spam detection system
- **Authentication**: Session-based auth with role-based access control (admin/user)

## Data Storage
- **Database**: SQLite with Drizzle ORM for type-safe database operations
- **Schema**: Structured tables for users, seminar applications, reviews, products, orders, and settings
- **Migrations**: Drizzle-kit for database schema management and migrations
- **Data Validation**: Zod schemas shared between frontend and backend for consistent validation

## Payment Integration
- **Payment Processor**: Toss Payments integration for Korean market
- **Payment Flow**: Client-side payment widget with server-side verification
- **Order Management**: Complete order tracking from creation to completion
- **Bulk Purchase**: Special discount system for certified seminar participants

## Access Control Systems
- **Review Gate**: 4-digit passcode system for seminar attendees to write reviews
- **Bulk Purchase Gate**: Separate 4-digit passcode for certified participants to access wholesale pricing
- **Admin Panel**: Role-based access for managing applications, reviews, and orders
- **Content Moderation**: Automatic profanity filtering with manual review system

## Development Tools
- **Build System**: Vite with React plugin and development server
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Quality**: ESLint configuration and consistent formatting
- **Development Experience**: Hot module replacement and error overlays in development

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **Backend Framework**: Express.js with session management and rate limiting
- **Database**: SQLite with Drizzle ORM and better-sqlite3 driver
- **Build Tools**: Vite, esbuild, TypeScript compiler

## UI and Styling
- **Design System**: Tailwind CSS with shadcn/ui component library
- **Icons**: Lucide React for consistent iconography
- **Typography**: Google Fonts (Noto Sans KR) for Korean language support
- **Form Components**: Radix UI primitives for accessible form controls

## Payment and Security
- **Payment Gateway**: Toss Payments SDK for Korean payment processing
- **Security**: bcryptjs for password hashing, express-rate-limit for API protection
- **Validation**: Zod for runtime type checking and form validation

## Development and Deployment
- **Development Server**: Vite development server with HMR
- **Production Build**: esbuild for server bundling, Vite for client assets
- **Environment Configuration**: Environment variables for database and API keys
- **Session Storage**: Configurable session store (memory/database)