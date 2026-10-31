# next_utils

Shared Next.js (App Router) components and helpers for personal projects. Used as a git submodule at `<project>/spa/next_utils` in several projects — keep it project-agnostic.

@instructions.md

`instructions.md` above is the coding guide shared by host projects. Clarifications: "dataorm" means the `django_utils` backend submodule; localization uses **next-intl** (`useTranslations`), not react-intl.

## Coupling with the host project

Imports use the `@/` alias rooted at the host `spa/` directory. The library expects these host files to exist:
- `@/api/apiTypes` — OpenAPI types generated from the Django backend (`paths`, `components`)
- `spa/constants.ts` — `ENABLED_LOCALES`
- `spa/messages/<locale>.json` — project translations, merged with `next_utils/messages/<locale>.json` in `i18n/request.ts`

Server-side requests go to `http://${PROJECT_NAME}-django:8000` (the docker-compose service name).

## Contents

- `apiHelpers.ts` — type machinery over `paths` (`Path`, `RequestParams`, `ResponseType`, `generateUrl`)
- `apiClient.ts` — client-side typed API (`useApi` via SWR, infinite lists, requests with CSRF cookie)
- `apiServer.ts` — server-side typed API (`apiGet`, `apiRequest`; forwards cookies)
  - `anonymousApiGet` / `anonymousApiRequest` — no cookies, with a cache tag; use for statically generated / cached pages
- `userDataClient.ts` / `userDataServer.ts` — current-user data from cookie
- `i18n/` — next-intl routing (`localePrefix: 'as-needed'`, default `en`), request config, navigation
- `components/` — layout, header, `InfiniteList`, modals, buttons
- `fields/` — react-hook-form `Controlled*` field components (MUI)
- `forms/` — `GenericForm` / `GenericModalForm` driven by a field schema
- `login/`, `notifications/`, `modal/` — auth UI, notification context, styled modal
- `messages/` — library translations (en, es, pt, ru)

## Notes

- Built against MUI 7 (`Grid` with `size` prop). MUI 9 removed system props (`p`, `alignItems`, `textAlign`, … directly on components) — many components here still use them and will need moving into `sx` before upgrading.
- Type-check and build through a host project (inside its nextjs container), not standalone.
