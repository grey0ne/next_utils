# Cursor Rules for Grey Store Project

## Frontend Guidelines
- Use Material UI components for all UI elements
- Use Material UI Dialog component for modal forms
- Use latest version of Material UI Grid components with size attribute: `<Grid size={{xs: 12, md: 12}}>`
- Use 4 spaces indentation in TypeScript files
- Do not use default exports for additional JS components and functions

## API and Data Fetching
- Use existing API endpoints
- API type definitions are in `spa/api/apiTypes.ts`
- For client Next.js components: use methods from `spa/next_utils/apiClient.ts`
- For server Next.js components: use methods from `spa/next_utils/apiServer.ts`
- Use `useApi` method from `spa/next_utils/apiClient.ts` for data fetching in client components

## Forms and Fields
- Use React Hook Form for form handling
- Use fields from `next_utils/fields`
- For related object selection, use `ControlledSelectField` from `spa/next_utils/fields`

## Backend Development
- Use decorators from dataorm module for backend endpoints
- Define endpoints in `api.py` files
- Define new schemas as dataclasses in `schema.py` files within corresponding modules

## Code Style
- Do not add comments to generated code
- Follow the project's existing patterns and conventions
- Use TypeScript for frontend development
- Maintain consistent code formatting

## Project Structure
- Keep frontend code in the `spa` directory
- Keep backend code in the `backend` directory
- Follow the established module organization