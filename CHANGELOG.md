<a name="3.0.2"></a>
## [3.0.2](https://github.com/csgpro/csgpro.com/compare/v3.0.1...v3.0.2) (2016-10-28)


### Bug Fixes

* **Topics:** return promise from getTopic call ([a5383f4](https://github.com/csgpro/csgpro.com/commit/a5383f4)), closes [#166](https://github.com/csgpro/csgpro.com/issues/166)



<a name="3.0.1"></a>
## [3.0.1](https://github.com/csgpro/csgpro.com/compare/v3.0.0...v3.0.1) (2016-10-23)


### Bug Fixes

* **Side Nav:** Restore links in side nav ([876319b](https://github.com/csgpro/csgpro.com/commit/876319b))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/csgpro/csgpro.com/compare/v2.1.2...v3.0.0) (2016-10-14)



<a name="2.1.2"></a>
## [2.1.2](https://github.com/csgpro/csgpro.com/compare/v2.1.1...v2.1.2) (2016-10-07)



<a name="2.1.1"></a>
## [2.1.1](https://github.com/csgpro/csgpro.com/compare/v2.1.0...v2.1.1) (2016-09-03)


### Features

* **About:** Added seasonal header images ([024e6de](https://github.com/csgpro/csgpro.com/commit/024e6de))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/csgpro/csgpro.com/compare/v2.0.0...v2.1.0) (2016-09-01)


### Bug Fixes

* View routes + deployment ([40b0674](https://github.com/csgpro/csgpro.com/commit/40b0674))
* **About:** Hide images in the sticky block. They force the sticky block width. ([2588958](https://github.com/csgpro/csgpro.com/commit/2588958)), closes [#149](https://github.com/csgpro/csgpro.com/issues/149)
* **Admin:** Fix missing authentication on post and put ([b1e859e](https://github.com/csgpro/csgpro.com/commit/b1e859e))
* **Admin:** Update login page to use Router Directives. ([39cd705](https://github.com/csgpro/csgpro.com/commit/39cd705))
* **Authorization:** Expire tokens after 30 days. Auto-renew token in admin app. ([871524d](https://github.com/csgpro/csgpro.com/commit/871524d))
* **build:** Fix migration, seeder paths. Fix copy-files to handle extensions. ([c4f3012](https://github.com/csgpro/csgpro.com/commit/c4f3012))
* **careers:** Fix link ([9611c9c](https://github.com/csgpro/csgpro.com/commit/9611c9c))
* **Code Highlighting:** Fix unkown code blocks from appearing blank. ([ab4cf80](https://github.com/csgpro/csgpro.com/commit/ab4cf80)), closes [#103](https://github.com/csgpro/csgpro.com/issues/103)
* **commitizen:** Restore cz-conventional-changelog for commitizen ([3694e74](https://github.com/csgpro/csgpro.com/commit/3694e74))
* **Contact Form:** Fix input type for company. Set to 'text'. ([9d9b5da](https://github.com/csgpro/csgpro.com/commit/9d9b5da)), closes [#97](https://github.com/csgpro/csgpro.com/issues/97)
* **Contact Form:** Fix phone number validation. Fix reset. Fix modal state. ([82f717a](https://github.com/csgpro/csgpro.com/commit/82f717a)), closes [#98](https://github.com/csgpro/csgpro.com/issues/98) [#100](https://github.com/csgpro/csgpro.com/issues/100)
* **Contact us:** Hide map on small and medium breakpoints ([bced782](https://github.com/csgpro/csgpro.com/commit/bced782)), closes [#115](https://github.com/csgpro/csgpro.com/issues/115)
* **deploy:** Removed deploy script ([a3bd90b](https://github.com/csgpro/csgpro.com/commit/a3bd90b))
* **deploy:** tests are broking. trying to fix. ([1e6b309](https://github.com/csgpro/csgpro.com/commit/1e6b309))
* **Error Pages:** cast number to a string for a happy view engine. ([c5bd4af](https://github.com/csgpro/csgpro.com/commit/c5bd4af))
* **File Downloads:** adjust file paths to be platform independent. ([cd693b8](https://github.com/csgpro/csgpro.com/commit/cd693b8))
* **Foundation:** Sometimes foundation initializes too early. Delaying by half a second. ([faef6aa](https://github.com/csgpro/csgpro.com/commit/faef6aa))
* **HERO:** Adjust hero reveal more of the backgroun image on larger screens ([8d9c72c](https://github.com/csgpro/csgpro.com/commit/8d9c72c))
* **Layout:** Fix medium breakpoint so sidebar is visible. ([e71ab53](https://github.com/csgpro/csgpro.com/commit/e71ab53)), closes [#113](https://github.com/csgpro/csgpro.com/issues/113)
* **Login/Reset Password Forms:** Update form directives to work with ng2 RC3 ([b8261c0](https://github.com/csgpro/csgpro.com/commit/b8261c0))
* **mailer:** reject errors rather than throw them. :tada: ([9246867](https://github.com/csgpro/csgpro.com/commit/9246867))
* **markdown:** Prevent markdown from throwing an error when input is undefined ([728696f](https://github.com/csgpro/csgpro.com/commit/728696f))
* **migration:** Changed topics unique format ([544d4b6](https://github.com/csgpro/csgpro.com/commit/544d4b6))
* **migration:** Created postTopics table ([0a84d97](https://github.com/csgpro/csgpro.com/commit/0a84d97))
* **migration:** Fix defaultValue for date columns on mssql ([e2b66b9](https://github.com/csgpro/csgpro.com/commit/e2b66b9))
* **migration:** Fix insert of postTopics ([292617b](https://github.com/csgpro/csgpro.com/commit/292617b))
* **migration:** Migrate users table to ready for sequelize. ([a81cf64](https://github.com/csgpro/csgpro.com/commit/a81cf64))
* **migration:** Support mssql 'NO ACTION' in constraints. ([5e042a4](https://github.com/csgpro/csgpro.com/commit/5e042a4))
* **migration:** Update topics to be ready for sequelize ([1a05efd](https://github.com/csgpro/csgpro.com/commit/1a05efd))
* **migration:** Updated posts to be sequelize compliant ([3020083](https://github.com/csgpro/csgpro.com/commit/3020083))
* **migrations:** Move migrations to occur before sync ([e7abf98](https://github.com/csgpro/csgpro.com/commit/e7abf98))
* **migrations:** ugh! ([c79463b](https://github.com/csgpro/csgpro.com/commit/c79463b))
* **Mobile:** Fix issue where sidebar content would temporarily cover main content ([803264e](https://github.com/csgpro/csgpro.com/commit/803264e)), closes [#92](https://github.com/csgpro/csgpro.com/issues/92)
* **Nav:** Fix link to careers ([56ead1d](https://github.com/csgpro/csgpro.com/commit/56ead1d))
* **orbit slider:** Set slide position and display on load to prevent slides from stacking on page lo ([b1b40d8](https://github.com/csgpro/csgpro.com/commit/b1b40d8))
* **paths:** Fix paths for public resources ([1ddc2fd](https://github.com/csgpro/csgpro.com/commit/1ddc2fd))
* **post:** Removed authorId and postTypeId from model. ([32c1ed6](https://github.com/csgpro/csgpro.com/commit/32c1ed6))
* **Post Redirects:** protect against 'undefined' string value. ([d149c56](https://github.com/csgpro/csgpro.com/commit/d149c56))
* **posts:** send JSON to the view. Markdown was chocking on the Sequelize data. ([c9b90b4](https://github.com/csgpro/csgpro.com/commit/c9b90b4))
* **Posts:** Bypass security and trust the html content in the blog posts. ([d82428d](https://github.com/csgpro/csgpro.com/commit/d82428d)), closes [#140](https://github.com/csgpro/csgpro.com/issues/140)
* **Posts:** When editing a post the excerpt was getting the post content ([c583918](https://github.com/csgpro/csgpro.com/commit/c583918)), closes [#139](https://github.com/csgpro/csgpro.com/issues/139)
* **Redirect Blog Posts:** Old posts without a permalink were not getting redirected properly. ([2062422](https://github.com/csgpro/csgpro.com/commit/2062422))
* **require:** TypeScript caused a failure on deploy ([b2831fa](https://github.com/csgpro/csgpro.com/commit/b2831fa))
* **Robots:** Block robots from crawling azurewebsites.net ([1c7e561](https://github.com/csgpro/csgpro.com/commit/1c7e561))
* **Robots:** Block robots from crawling azurewebsites.net ([9084a15](https://github.com/csgpro/csgpro.com/commit/9084a15))
* **Sidebar/Slider:** Set sidebar position to relative. Rearranged Orbit slider styles. ([573c492](https://github.com/csgpro/csgpro.com/commit/573c492))
* **Stories:** added featured scope. displaying only featured images in slider. ([2f045dc](https://github.com/csgpro/csgpro.com/commit/2f045dc)), closes [#111](https://github.com/csgpro/csgpro.com/issues/111)
* **Stories:** Fix api to default to active scope ([7698f23](https://github.com/csgpro/csgpro.com/commit/7698f23))
* **Stories:** Fix story heading position on mobile ([d614e7a](https://github.com/csgpro/csgpro.com/commit/d614e7a)), closes [#94](https://github.com/csgpro/csgpro.com/issues/94) [#96](https://github.com/csgpro/csgpro.com/issues/96)
* **Stories:** GetStories returns active stories ([7e87dc0](https://github.com/csgpro/csgpro.com/commit/7e87dc0)), closes [#111](https://github.com/csgpro/csgpro.com/issues/111)
* **Stories:** Relabel button to read "Get the story" ([ffc9252](https://github.com/csgpro/csgpro.com/commit/ffc9252)), closes [#112](https://github.com/csgpro/csgpro.com/issues/112)
* **tsconfig:** Add missing config file ([97283c1](https://github.com/csgpro/csgpro.com/commit/97283c1))
* **views:** Adjust view paths for azure. ([081d1ce](https://github.com/csgpro/csgpro.com/commit/081d1ce))
* **views:** Another attempt to fix azure view paths. ([5ad7daf](https://github.com/csgpro/csgpro.com/commit/5ad7daf))
* **Web Config:** Removed redirect to www ([a39a06d](https://github.com/csgpro/csgpro.com/commit/a39a06d))
* **webpack:** Fix polyfills.ts filename ([21d257a](https://github.com/csgpro/csgpro.com/commit/21d257a))
* **WWW:** Redirect to WWW ([5f3d361](https://github.com/csgpro/csgpro.com/commit/5f3d361))


### Features

* Added main controller for the base route ([834a769](https://github.com/csgpro/csgpro.com/commit/834a769))
* Added markdown support ([c69af52](https://github.com/csgpro/csgpro.com/commit/c69af52))
* Syntax Highlighting Styles ([90291b6](https://github.com/csgpro/csgpro.com/commit/90291b6))
* **Add navbar:** Improve CSS. ([82b4fce](https://github.com/csgpro/csgpro.com/commit/82b4fce))
* **Admin:** initialize admin portal (angular2, webpack) ([3b30340](https://github.com/csgpro/csgpro.com/commit/3b30340))
* **admin posts:** Retrieve posts from API and display them ([68ac7f6](https://github.com/csgpro/csgpro.com/commit/68ac7f6))
* **auth:** Adds Authentication + Password Reset ([12ee4ae](https://github.com/csgpro/csgpro.com/commit/12ee4ae))
* **authentication:** Authentication Works! ([6dc4dc1](https://github.com/csgpro/csgpro.com/commit/6dc4dc1))
* **Authentication:** Delay route change when the authentication service isn't ready. ([921515a](https://github.com/csgpro/csgpro.com/commit/921515a))
* **Authentication:** Setup ApiService, Add Authentication ([8f4b751](https://github.com/csgpro/csgpro.com/commit/8f4b751))
* **blog:** post layout adjustments ([05d7f15](https://github.com/csgpro/csgpro.com/commit/05d7f15))
* **contact:** Added contact controller + added sendgrid support ([7a5b254](https://github.com/csgpro/csgpro.com/commit/7a5b254))
* **contact form:** Add contact form modal ([a64cbdb](https://github.com/csgpro/csgpro.com/commit/a64cbdb))
* **Contacts:** Added api and page in admin to look at contacts ([7ee05fa](https://github.com/csgpro/csgpro.com/commit/7ee05fa))
* **Contacts:** Get a single contact by email via contact api ([6e84267](https://github.com/csgpro/csgpro.com/commit/6e84267))
* **content:** Added "Custom Software" content. ([eb24a76](https://github.com/csgpro/csgpro.com/commit/eb24a76))
* **Create/Edit Posts:** :tada: ([6e7711f](https://github.com/csgpro/csgpro.com/commit/6e7711f))
* **css:** Added foundation sass ([125d27f](https://github.com/csgpro/csgpro.com/commit/125d27f))
* **db:** Added database connection via sequelize. ([3892a2c](https://github.com/csgpro/csgpro.com/commit/3892a2c))
* **disqus:** Added comments to blog posts ([5d331c1](https://github.com/csgpro/csgpro.com/commit/5d331c1))
* **downloads:** Add download request form modal ([3700a3d](https://github.com/csgpro/csgpro.com/commit/3700a3d))
* **Edit Post:** WIP - Initialized page template. Added models. ([53a2e49](https://github.com/csgpro/csgpro.com/commit/53a2e49))
* **File Upload:** Added Angular Service to upload files ([690269f](https://github.com/csgpro/csgpro.com/commit/690269f))
* **File Upload:** Added image upload button/modal to the post view. ([e097b24](https://github.com/csgpro/csgpro.com/commit/e097b24))
* **File Upload:** Adds file upload functionality to the API ([a72061b](https://github.com/csgpro/csgpro.com/commit/a72061b))
* **foundation:** Added Motion-UI library ([96080f4](https://github.com/csgpro/csgpro.com/commit/96080f4))
* **hero:** Add hero to homepage ([c799be3](https://github.com/csgpro/csgpro.com/commit/c799be3))
* **hero:** Resize hero to fill viewport ([d3d9127](https://github.com/csgpro/csgpro.com/commit/d3d9127))
* **home:** Add nodejs logo ([fd70e7e](https://github.com/csgpro/csgpro.com/commit/fd70e7e))
* **homepage:** Add technology logos ([bf0fe4f](https://github.com/csgpro/csgpro.com/commit/bf0fe4f))
* **icons:** Added foundation icons ([5bea60a](https://github.com/csgpro/csgpro.com/commit/5bea60a))
* **layout:** Add hero layout ([cccd02b](https://github.com/csgpro/csgpro.com/commit/cccd02b))
* **Loading Indicator:** Setup BehaviorSubject and "AsyncPipe" ([23b87be](https://github.com/csgpro/csgpro.com/commit/23b87be))
* **Modal:** Added modal component ([4b18f11](https://github.com/csgpro/csgpro.com/commit/4b18f11))
* **models:** Added post model, posts + topics GET API routes ([84f9afd](https://github.com/csgpro/csgpro.com/commit/84f9afd))
* **Page Header:** Added pageHeader method to make header graphics easy to use ([c47590f](https://github.com/csgpro/csgpro.com/commit/c47590f))
* **pages:** Added controllers for all the pages ([d840e69](https://github.com/csgpro/csgpro.com/commit/d840e69))
* **pagination:** Adjust layout. Add conditional logic. ([966938a](https://github.com/csgpro/csgpro.com/commit/966938a))
* **pagination:** Pagination on blog pages ([e5cdf76](https://github.com/csgpro/csgpro.com/commit/e5cdf76))
* **post layout:** Update posts layout. Add tweet button. ([e5865de](https://github.com/csgpro/csgpro.com/commit/e5865de))
* **Post Slug:** Added slugify to normalize slug creation. ([7828a44](https://github.com/csgpro/csgpro.com/commit/7828a44))
* **postCategory:** Added postCategory association. ([3dbeb16](https://github.com/csgpro/csgpro.com/commit/3dbeb16))
* **posts:** Added post.controller + views ([bdb481c](https://github.com/csgpro/csgpro.com/commit/bdb481c))
* **Publish Posts:** Publish/Un-Publish buttons added to Create/Edit Post form. ([584698e](https://github.com/csgpro/csgpro.com/commit/584698e))
* **RSS:** Add author. Adjust description to protect XML from HTML. ([5e89929](https://github.com/csgpro/csgpro.com/commit/5e89929))
* **RSS:** Add build date & pub date ([4c6e5cf](https://github.com/csgpro/csgpro.com/commit/4c6e5cf))
* **RSS:** Add RSS feeds for Blog ([f48e239](https://github.com/csgpro/csgpro.com/commit/f48e239))
* **scripts:** Added webpack + jquery + foundation ([5453499](https://github.com/csgpro/csgpro.com/commit/5453499))
* **sitemap:** Move sitemap to view context ([9947e5e](https://github.com/csgpro/csgpro.com/commit/9947e5e))
* **Sitemap:** Improve sitemap.xml ([c4fadd5](https://github.com/csgpro/csgpro.com/commit/c4fadd5))
* **Social Links:** Added social links. Default all external links to new window. ([ed6e168](https://github.com/csgpro/csgpro.com/commit/ed6e168))
* **Sticky:** Add .sticky css Class to stick container to top on scroll ([23bcb37](https://github.com/csgpro/csgpro.com/commit/23bcb37))
* **SUBSCRIBE:** Added mailchimp form to blog ([83cf87e](https://github.com/csgpro/csgpro.com/commit/83cf87e))
* **SUBSCRIPTION:** Added confirmed page. Updated Thank you copy. ([8234252](https://github.com/csgpro/csgpro.com/commit/8234252))
* **topics:** Added topic model ([2cbf7e0](https://github.com/csgpro/csgpro.com/commit/2cbf7e0))
* **topnav:** Style top nav, add logo ([418a614](https://github.com/csgpro/csgpro.com/commit/418a614))
* **users:** Added user model. ([b465b32](https://github.com/csgpro/csgpro.com/commit/b465b32))
* **Webhooks:** Add PublishPost event ([bba9eb5](https://github.com/csgpro/csgpro.com/commit/bba9eb5))
* **Webhooks:** Added support for webhooks ([ffe9133](https://github.com/csgpro/csgpro.com/commit/ffe9133))
* **Webhooks:** Work around transactions. ([04d6f30](https://github.com/csgpro/csgpro.com/commit/04d6f30))


### Performance Improvements

* **posts:** Remove hooks to reduce confusion, improve speed ([3aab6d1](https://github.com/csgpro/csgpro.com/commit/3aab6d1))



<a name="2.0.0-alpha.1"></a>
# [2.0.0-alpha.1](https://github.com/csgpro/csgpro.com/compare/v1.2.1...v2.0.0-alpha.1) (2016-02-06)


### Bug Fixes

* **startup:** Fix paths. ([3c55e21](https://github.com/csgpro/csgpro.com/commit/3c55e21))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/csgpro/csgpro.com/compare/v1.1.0...v1.2.0) (2014-12-20)



