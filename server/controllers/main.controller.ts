// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { pageView } from '../shared/utility';

const privacyPolicy = `
Your privacy is important to us.   CSG Professional Services, Inc., hereinafter referred as "CSG Pro" endorses this Privacy Policy as a vital part of the agreement between you and us regarding the use of this Site.  Our privacy policy describes how we collect, use and disclose information that we may obtain through this Site or as a part of our internal Processes.

**The information we collect comprise:**

**Voluntarily Shared "Personal Information"**

We collect information when users browse this Site or in which users Provide information directly, including personally identifiable information including but not limited to your name, telephone number, e-mail address, job and related information as part of the online job application Process, resource downloads or in the Process of registering for a CSG Pro sponsored training, event, webinar, or conference.

**Automated "Non-Personal Information"**

When you visit our site, we collect the IP address of the device you use to connect to the Internet, the type of operating system you have, and which site you came from. The information may not be Personally Identifiable Information but may disclose other aspects of your browsing such as patterns through the use of variety of technologies and tools. This information helps us Provide an online experience that matches your device and may include (a) your response to one of our emails; (b) time and duration of your visit to our site(s) and (c) pages you viewed while on our site(s). If you are a customer or supplier of CSG Pro, we may only use your Personal Information to respond to your emails or online requests, to deliver and Process surveys, to fulfill and/or deliver CSG Pro's solutions and services, including sharing with our business partners to offer you Products and Services that may be of interest to you, and/or we may also share with third parties for other legitimate business purposes, as permitted by applicable laws. Any personal information that we have collected or stored about you or that you have Provided to us, may be transferred to a future purchaser of our company and/or its assets.

**Cookies**

CSG Pro may collect certain information by automated means, such as cookies and web beacons, when a user visits our site. A "cookie" is a small piece of data that a website can send to your browser, which may then be stored on your system. We sometimes collect anonymous information from visits to our site to help us Provide better customer service. However, you have complete freedom to set your browser to notify you when you receive a cookie, giving you the chance to decide whether or not to accept it. In the case you do not wish to receive any cookies, you can change your browser settings in the Preferences or Options menu to completely block the usage of cookies but doing so may prevent you from accessing certain functionalities on the Site.

**Links**

This site contains links to other websites. CSG Pro is not responsible for the privacy practices or the contents of such websites, nor do we take any responsibility for the opinions of third parties expressed on or through our site. To ensure your privacy is Protected, we recommend that you review the privacy statements of these other linked sites, applications or other digital Properties.

**How We Use the Collected Information / Information we share**

CSG Pro does not sell, rent or lease personal identifiable data, or disclose it to third parties unless it is required to do so by law or in the good-faith belief that such action is necessary. To fulfil its valid obligation towards Personal Information Providers, CSG Pro may share the Personal Information with third-party business partners including service Providers, pay-roll Processors, auditors, and legal advisors ("Third-Party Partners"); Provided that an acknowledgement receipt has been issued stating that recipient shall also retain confidentiality and safeguard the Personal Information. CSG Pro will observe a strict adherence to all applicable laws and expects our Third-Party Partners to do the same.

**Security Measures**

CSG Pro takes reasonable measures and follow industry accepted standards to Protect the Personal Information from loss, misuse, or unauthorized access, disclosure, alteration or destruction. However, no method of transmission over the Internet or via mobile device, or method of electronic storage, is 100% secure. Hence, CSG Pro destroys all Personal Information that is no longer needed for the purposes for which it was collected, unless its retention is required to satisfy legal, regulatory or accounting requirements or to Protect our interests. Records which may contain Personally Identifiable Information are retained and destroyed by CSG Pro in accordance with the company's Record Retention Policy. CSG Pro stores personal data, regardless of its form, with security Procedures appropriate to the sensitivity of the data. The data collected via our site is stored in a secure server with our ISP who will take periodic backups of such data but will not give or sell it to anyone else. We Protect CSG Pro and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. In particular, (a) this site has security measures in place to Protect the loss, misuse, and/or alteration of information under our control. The data resides behind a firewall, with access restricted to authorized CSG Pro personnel; (b) we restrict access to personal information to CSG Pro employees, contractors and agents who need to know that information in order to Process it for us, and who are subject to strict contractual confidentiality obligations and may be disciplined or terminated if they fail to meet these obligations.

**Enforcement**

We regularly review our compliance with our Privacy Policy and also adhere to several self-regulatory frameworks.

**Changes to this Policy**

CSG Pro reserve the right to amend the Privacy Policy at any time, for any reason and without notice.  We encourage you to review this policy from time to time.

**Grievances and Queries**

If you have any queries, questions or concerns about this Privacy Policy or our privacy practices or wish to request a copy of the personal information we hold about you, please contact <a href="mailto:info@csgpro.com">info@csgpro.com</a>.


`;

@controller('/')
class MainController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        reply.view('home', { title: 'Custom Software, Business Analytics, and Cloud Services', description: `Headquartered in Portland Oregon's urban, tech savvy Pearl District, CSG Pro is committed to delighting its clients through the innovative application of modern technology solutions. We hope to have the opportunity to build something amazing for you today, as we have for many since 1993.` }, { layout: 'hero-layout' });
    }

    @get('/privacy-policy')
    @config({ plugins: { sitemap: { include: true } } })
    privacyPolicy(request: hapi.Request, reply: hapi.IReply) {
        reply.view(pageView('privacy-policy'), { title: 'Privacy Policy', description: ``, pageContent: privacyPolicy });
    }
}

export default new MainController();