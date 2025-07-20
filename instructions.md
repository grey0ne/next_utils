For frontend Material UI components should be used
For modal form use Material UI Dialog component
Use latest version of Material UI for Grid components. Grid component require size attribute like in this example <Grid size={{xs: 12, md: 12}}> use other project pages as an example
Use 4 spaces indents in typescript files

## API Endpoints and usage
Always use exisiting API endpoints
API type definitions located in spa/api/apiTypes.ts
For client nextjs components use methods from spa/next_utils/apiClient.ts
For server nextjs components use methods from spa/next_utils/apiServer.ts


## Forms and modals
For forms use React hook form and fields from next_utils/fields

For backend endpoints use decorators from dataorm module. Backend endpoints is defined in api.py file.
For single item endpoints use single_item decorator from dataorm
For data altering requests use action decorator from dataorm
If new schema is needed for endpoint define it as dataclass in schema.py file in corressponding module

If you need to fetch data in client component use useApi method from spa/next_utils/apiClient.ts

For form fields that require to choose from related objects use ControlledSelectField from spa/next_utils/fields folder

Do not add comments to generated code

When export additional js components and functions do not use default export