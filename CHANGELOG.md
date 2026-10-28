# [2.0.0](https://github.com/sevalla/cli/compare/v1.11.0...v2.0.0) (2026-10-28)


### Features

* require --confirm on irreversible actions and keep secrets out of output ([#13](https://github.com/sevalla/cli/issues/13)) ([33eb4a1](https://github.com/sevalla/cli/commit/33eb4a1aba7b17eeea28a1927780c6ed89bb72f4))


### BREAKING CHANGES

* apps suspend, databases suspend, databases reset-password, databases backups restore, api-keys rotate, object-storage rotate-credentials, webhooks roll-secret, apps deployment-hook regenerate and apps deployment-hook disable fail without --confirm. env-vars list hides values unless --show-values is passed, and env-vars create and update no longer return the value. sevalla schema options report mandatory and takesValue instead of required.

# [1.11.0](https://github.com/sevalla-hosting/cli/compare/v1.10.1...v1.11.0) (2026-10-27)


### Bug Fixes

* honor --json and --api-url after subcommands, and report the real version ([#10](https://github.com/sevalla-hosting/cli/issues/10)) ([7c54c89](https://github.com/sevalla-hosting/cli/commit/7c54c89173774635a7072d4bd8d2b8f0bbcf972d))


### Features

* create preview apps, set preview app settings and manage process disks ([#11](https://github.com/sevalla-hosting/cli/issues/11)) ([b6a54b4](https://github.com/sevalla-hosting/cli/commit/b6a54b43749cbdcfcfca0a8b87a2edc48c070037))

## [1.10.2](https://github.com/sevalla-hosting/cli/compare/v1.10.1...v1.10.2) (2026-10-18)


### Bug Fixes

* honor --json and --api-url after subcommands, and report the real version ([#10](https://github.com/sevalla-hosting/cli/issues/10)) ([7c54c89](https://github.com/sevalla-hosting/cli/commit/7c54c89173774635a7072d4bd8d2b8f0bbcf972d))

## [1.10.1](https://github.com/sevalla-hosting/cli/compare/v1.10.0...v1.10.1) (2026-10-18)


### Bug Fixes

* align CLI requests with the v3 OpenAPI spec ([#9](https://github.com/sevalla-hosting/cli/issues/9)) ([32b8290](https://github.com/sevalla-hosting/cli/commit/32b82906b0e25497c8160802b2df5684402f2cf4)), closes [#8](https://github.com/sevalla-hosting/cli/issues/8)

# [1.10.0](https://github.com/sevalla-hosting/cli/compare/v1.9.0...v1.10.0) (2026-05-28)


### Features

* add git lfs support with new flag for applications and static sites ([#5](https://github.com/sevalla-hosting/cli/issues/5)) ([c2b8b42](https://github.com/sevalla-hosting/cli/commit/c2b8b425615f9afbc8743fbf253236767eac7da9))

# [1.9.0](https://github.com/sevalla-hosting/cli/compare/v1.8.0...v1.9.0) (2026-05-22)


### Features

* add databases restart command ([#4](https://github.com/sevalla-hosting/cli/issues/4)) ([80bb1c6](https://github.com/sevalla-hosting/cli/commit/80bb1c6f4f2dfd31ef4c12059cf478429f75de53))
* add exit codes command and usage alerts management functionality ([#3](https://github.com/sevalla-hosting/cli/issues/3)) ([08a27f8](https://github.com/sevalla-hosting/cli/commit/08a27f88782c46d75872f533984d951bc6a3d67a))

# [1.8.0](https://github.com/sevalla-hosting/cli/compare/v1.7.2...v1.8.0) (2026-03-25)


### Features

* add options for allow and ignore deploy paths in static site co… ([#2](https://github.com/sevalla-hosting/cli/issues/2)) ([cde0930](https://github.com/sevalla-hosting/cli/commit/cde0930a26622bece97ab9633d96231cc9474cba))

## [1.7.2](https://github.com/sevalla-hosting/cli/compare/v1.7.1...v1.7.2) (2026-03-24)


### Bug Fixes

* update pagination handling to use limit/offset instead of page/per_page ([#1](https://github.com/sevalla-hosting/cli/issues/1)) ([33dc5cd](https://github.com/sevalla-hosting/cli/commit/33dc5cd1c9b3cd4eb854860026dc97a2eefd65d9))

## [1.7.1](https://github.com/sevalla-hosting/cli/compare/v1.7.0...v1.7.1) (2026-03-05)


### Bug Fixes

* rename timestamp to time in metrics query and formatter ([5106a68](https://github.com/sevalla-hosting/cli/commit/5106a68e946f7123a738d73f5cd786457ece6941))
* rename timestamp to time in metrics query and formatter ([ab9b1b9](https://github.com/sevalla-hosting/cli/commit/ab9b1b93493c5825cb26c2a4a9bb6bb9a1890ddb))

# [1.7.0](https://github.com/sevalla-hosting/cli/compare/v1.6.0...v1.7.0) (2026-03-05)


### Features

* update metrics query options with default values and improve command usage documentation ([6c624c4](https://github.com/sevalla-hosting/cli/commit/6c624c41639cbfe2e10668c66b3516a92b4d380a))

# [1.6.0](https://github.com/sevalla-hosting/cli/compare/v1.5.0...v1.6.0) (2026-03-05)


### Features

* enhance CI workflow for automated binary releases and Homebrew updates ([c909b2d](https://github.com/sevalla-hosting/cli/commit/c909b2dd7f0c7fd9b59e35007f974670e2245636))

# [1.5.0](https://github.com/sevalla-hosting/cli/compare/v1.4.0...v1.5.0) (2026-03-05)


### Features

* bump version to 1.5.0 ([bc60ee1](https://github.com/sevalla-hosting/cli/commit/bc60ee1690b5a9c59b0d345409feb9a774273a44))

# 1.0.0 (2026-03-05)


### Features

* Init Sevalla CLI ([89eaa27](https://github.com/sevalla-hosting/cli/commit/89eaa278e1b3355aa537acf2d11bd3885ab7ae73))
