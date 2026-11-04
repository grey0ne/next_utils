# next_utils

Shared Next.js (App Router) components and helpers for personal projects. Used as a git submodule at `<project>/nextjs_frontend/next_utils` in several projects — keep it project-agnostic.

@instructions.md

`instructions.md` above is the coding guide shared by host projects. Clarifications: "dataorm" means the `django_utils` backend submodule; localization uses **next-intl** (`useTranslations`), not react-intl.

## Coupling with the host project

Imports use the `@/` alias rooted at the host frontend directory (`nextjs_frontend/`). The library expects these host files to exist:
- `@/api/apiTypes` — OpenAPI types generated from the backend (`paths`, `components`)
- `nextjs_frontend/constants.ts` — `ENABLED_LOCALES`
- `nextjs_frontend/messages/<locale>.json` — project translations, merged with `next_utils/messages/<locale>.json` in `i18n/request.ts`

Server-side requests go to `BACKEND_INTERNAL_URL` (required; set by the deployment — deploy (github.com/grey0ne/deploy) provides it for every stack). The library is backend-agnostic: it depends only on the backend's HTTP API contract (OpenAPI types, `csrftoken` cookie + `X-CSRFToken` header, `access_token` / `user_data` cookies, auth endpoints such as `/api/auth/telegram`, `/api/auth/csrf` + POST to `/login/<backend>/` for social auth), never on which framework implements it.

## Contents

- `apiHelpers.ts` — type machinery over `paths` (`Path`, `RequestParams`, `ResponseType`, `generateUrl`)
- `apiClient.ts` — client-side typed API (`useApi` via SWR, infinite lists, requests with CSRF cookie)
- `apiErrors.ts` — `useFormatApiError()`: translated message for an API error. Errors with a `code` (django_utils `ApiError`, body `{code, detail, params}`) are translated from the project's `ApiErrors.<code>` messages with `params`; otherwise a common message by status from `ApiErrorsCommon` (library messages), otherwise the backend `detail`. `formatApiError` in `apiClient.ts` is the untranslated variant for code outside components
- `apiServer.ts` — server-side typed API (`apiGet`, `apiRequest`; forwards cookies)
  - `anonymousApiGet` / `anonymousApiRequest` — no cookies, with a cache tag; use for statically generated / cached pages
- `userDataClient.ts` / `userDataServer.ts` — current-user data from cookie
- `i18n/` — next-intl routing (`localePrefix: 'as-needed'`, default `en`), request config, navigation
- `components/` — layout, header, `InfiniteList`, modals, buttons
- `modal/ConfirmDialog.tsx` — confirmation dialog, use instead of `window.confirm`; `components/ConfirmButton.tsx` — button that confirms before an arbitrary action; `ServerActionButton` takes `confirmText` / `confirmTitle` to confirm before the request
- `fields/` — react-hook-form `Controlled*` field components (MUI)
- `forms/` — `GenericForm` / `GenericModalForm` driven by a field schema
- `login/`, `notifications/`, `modal/` — auth UI (`socialAuthLogin(backend)` — POST login for social auth), notification context, styled modal
- `messages/` — library translations (en, es, kk, pt, ru). The project's own messages must not reuse a library namespace: the files are merged at the top level, so the library namespace would replace the project one

## Notes

- Built against MUI 9 (`Grid` with `size` prop). MUI 9 removed system props (`p`, `alignItems`, `textAlign`, … directly on components) and `Grid` `direction='column'` — put them into `sx`.
- Type-check and build through a host project (inside its nextjs container), not standalone.
