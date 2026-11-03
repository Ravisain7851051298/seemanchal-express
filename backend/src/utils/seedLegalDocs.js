const LegalDocument = require('../models/LegalDocument');
const LegalDocumentVersion = require('../models/LegalDocumentVersion');

const legalDocumentsData = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    category: 'compliance',
    summary: 'How Seemanchal Express collects, protects, stores, and handles personal data and reader information.',
    isMandatoryFor: [],
    content: `# Privacy Policy | गोपनीयता नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  
**Organization:** Seemanchal Express (Digital News & Community Network)

---

## 1. Introduction & Overview
Seemanchal Express ("we", "our", or "us") is dedicated to upholding the highest standards of journalistic integrity and data privacy for our readers, subscribers, members, and press correspondents. This Privacy Policy outlines our procedures concerning the collection, storage, use, and disclosure of personal data when you use our website [seemanchalexpress.in](https://seemanchalexpress.in) and associated digital services.

## 2. Information We Collect
We collect information to provide better news reporting, member coordination, and digital integrity:
- **Personal Identification Data:** Full name, email address, telephone contact, residential district/ward, blood group, and government identity numbers (for accredited reporters and registered members).
- **Technical & Usage Data:** IP address, browser type, device information, operating system, and pages visited.
- **Reporting & Contribution Records:** Stories submitted by journalists, grievance reports, community inquiries, and digital document acceptance logs.

## 3. How We Use Your Information
We use collected data solely for legitimate organizational and journalistic operations:
1. Publishing public news reports with proper byline attribution.
2. Managing reporter accreditation and digital ID card verification.
3. Facilitating membership applications across national, state, district, block, and panchayat tiers.
4. Responding to public complaints and legal grievance submissions.
5. Complying with statutory laws under the Information Technology Act, 2000 and the Digital Media Ethics Code.

## 4. Cookies and Analytical Tracking
We use standard HTTP cookies and session tokens to maintain authorized user sessions, security tokens, and user interface preferences. You may configure your browser to decline non-essential cookies.

## 5. Information Sharing and Disclosure
We do **not** sell, rent, or trade reader or contributor information. Information is only disclosed:
- When required by court order, law enforcement summons, or government regulation.
- To protect the legal rights, safety, and property of Seemanchal Express.

## 6. Grievance Officer Contact
In accordance with Rule 11(2)(a) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:

| Designation | Contact Detail |
| :--- | :--- |
| **Grievance Officer** | Editor-in-Chief / Grievance Redressal Cell |
| **Email** | mail@seemanchalexpress.in |
| **Postal Address** | F 65, Shaheen Bagh, Okhla, New Delhi - 110025, India |
| **Helpline** | +91 9871023184 |
`,
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-and-conditions',
    category: 'compliance',
    summary: 'General terms and legal conditions governing the access and usage of Seemanchal Express portal.',
    isMandatoryFor: [],
    content: `# Terms & Conditions | नियम एवं शर्तें

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Acceptance of Terms
By accessing, browsing, or subscribing to Seemanchal Express, you agree to comply with and be bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms, you must refrain from using the platform.

## 2. User Roles and Account Responsibilities
- **Readers & Visitors:** Must use the portal only for lawful informational and community purposes.
- **Press Correspondents:** Must submit only verified, authentic, and non-defamatory news stories.
- **Registered Members:** Must uphold the organizational decorum and objectives of public welfare.
- **Account Security:** Users are responsible for safeguarding login credentials and session tokens.

## 3. Prohibited Conduct
Users are strictly prohibited from:
- Posting defamatory, obscene, hate-inducing, or communally sensitive materials.
- Scraping, automated harvesting, or launching denial-of-service attempts against our servers.
- Impersonating Seemanchal Express press personnel without valid digital ID card credentials.

## 4. Limitation of Liability
Seemanchal Express endeavors to ensure all published reports are accurate. However, we shall not be held liable for indirect, incidental, or consequential damages resulting from portal downtime or reliance on third-party syndicated feeds.

## 5. Governing Law and Jurisdiction
These Terms are governed by and construed under the laws of the Republic of India. Any legal dispute shall be subject to the exclusive jurisdiction of the competent courts in Delhi / Patna, Bihar.
`,
  },
  {
    title: 'Disclaimer',
    slug: 'disclaimer',
    category: 'general',
    summary: 'Public legal disclaimer regarding journalistic reporting, opinion pieces, and external hyperlinks.',
    isMandatoryFor: [],
    content: `# Legal Disclaimer | अस्वीकरण

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. General News & Reporting Disclaimer
The information published on Seemanchal Express is compiled from on-ground field correspondents, official press statements, news agencies, and investigative reporting. While we make every effort to verify facts before publication:
- News is published in good faith for general informational and public-interest awareness.
- Statements made by political leaders, interviewees, or public figures reflect their personal views and do not represent the editorial endorsement of Seemanchal Express.

## 2. Opinion Columns and Editorial Views
Signed editorial articles, reader comments, and special guest columns represent the independent perspectives of their respective authors.

## 3. External Links Disclaimer
Our reports may contain links to external third-party portals, government gazettes, and video platforms. Seemanchal Express does not control or endorse the content or safety of external websites.

## 4. Errors and Omissions
If any error, inadvertent omission, or factual mistake is identified, readers are encouraged to file a formal request through our [Correction Policy](/legal/correction-policy) or our [Grievance Redressal Desk](/complaint).
`,
  },
  {
    title: 'Editorial Policy',
    slug: 'editorial-policy',
    category: 'editorial',
    summary: 'Ethical standards, fact-checking rules, and independence principles guiding our newsroom.',
    isMandatoryFor: ['reporter'],
    content: `# Editorial Policy | संपादकीय नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Mission and Core Values
Seemanchal Express operates on the philosophy of *"Voice of the People | सच की निर्भीक आवाज"*. Our newsroom adheres to the following foundational pillars:
- **Truth & Accuracy:** Exhaustive verification before dissemination.
- **Fairness & Impartiality:** Presenting multiple perspectives in controversial matters.
- **Public Interest:** Prioritizing rural welfare, education, healthcare, and honest governance.
- **Independence:** Total editorial freedom free from political, corporate, or sectarian interference.

## 2. Multi-Tier Verification Process
Every story submitted by a field reporter undergoes a structured editorial workflow:
1. **Primary Field Check:** Verification of source documents, witness statements, and visual proofs.
2. **Desk Review:** Fact-checking against government records and legal provisions.
3. **Admin Editorial Clearance:** Final sign-off by the Chief Editor before live release.

## 3. Coverage of Sensitive Matters
- **Minors & Victims:** Identities of sexual offense victims, juvenile offenders, and vulnerable witnesses are strictly concealed in compliance with POCSO and Section 228A of the Indian Penal Code.
- **Communal Harmony:** Extreme caution is exercised when reporting community disputes to prevent unrest.
- **Elections & Politics:** Equal and balanced coverage across all democratic stakeholders.
`,
  },
  {
    title: 'Copyright Policy',
    slug: 'copyright-policy',
    category: 'compliance',
    summary: 'Intellectual property ownership, republication rules, and DMCA/Copyright infringement notices.',
    isMandatoryFor: [],
    content: `# Copyright Policy | सर्वाधिकार नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Ownership of Content
All content published on Seemanchal Express—including text, investigatory dossiers, photographs, videography, graphics, logos, and digital ID card designs—is the proprietary property of Seemanchal Express and protected under the Indian Copyright Act, 1957.

## 2. Permitted Fair Use
Readers and educational institutions may quote brief excerpts (up to 150 words) provided:
- Direct credit is given to "Seemanchal Express".
- A clickable do-follow hyperlink to the original article URL is embedded.

## 3. Commercial Republication Prohibited
Reproduction, syndication, rebroadcasting, or distribution of full news stories, raw footage, or data without prior written authorization from the Chief Editor is strictly forbidden.

## 4. Takedown & Copyright Complaints
If you believe your copyrighted work has been reproduced on our website without authorization, please submit a formal notice to our Grievance Officer with:
1. Proof of intellectual property ownership.
2. URL of the infringing article.
3. Formal declaration of good faith belief.
`,
  },
  {
    title: 'Correction Policy',
    slug: 'correction-policy',
    category: 'editorial',
    summary: 'Our transparent protocol for promptly rectifying errors, updating reports, and publishing clarifications.',
    isMandatoryFor: ['reporter'],
    content: `# Correction Policy | संशोधन एवं स्पष्टीकरण नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Commitment to Truth and Transparency
Seemanchal Express takes pride in accuracy. When genuine factual errors occur, we acknowledge and rectify them promptly and transparently without attempting to quietly rewrite historical records.

## 2. Types of Corrections
- **Minor Factual Updates (Typo / Date / Designation):** Corrected directly in the article body with an editorial footnote.
- **Substantive Corrections:** When a central fact, allegation, or figure is revised, a prominent bold clarification banner is placed at the top or bottom of the article detailing the date, nature of change, and revised fact.
- **Formal Apology / Retraction:** If a published piece is found to be defamatory or materially false, an unconditional retraction is published with equal editorial prominence.

## 3. How to Request a Correction
To flag an error, readers can click on the Report issue button or email \`mail@seemanchalexpress.in\` with the article URL, specific sentence, and verifiable supporting documents.
`,
  },
  {
    title: 'Membership Policy',
    slug: 'membership-policy',
    category: 'agreements',
    summary: 'Rules governing registration, committee tiers, tenure, renewals, and rights of registered members.',
    isMandatoryFor: ['member'],
    content: `# Membership Policy | सदस्यता नियमावली

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Eligibility & Structure
Membership of Seemanchal Express is open to Indian citizens dedicated to community welfare, digital literacy, and democratic accountability:
- **National Committee:** Highest advisory and strategic body.
- **State Committee (Bihar):** Regional governance and policy direction.
- **District Committees:** Grassroots operations across Kishanganj, Araria, Purnea, Katihar, and other districts.
- **Block, Panchayat & Ward Units:** Community welfare, grievance collection, and civic coordination.

## 2. Validity and Renewal
- Standard membership is issued for an initial term of 2 (two) years from approval.
- Expiration occurs automatically upon reaching the validity date unless renewed by the Central Administration.
- Members must keep their personal contact details and residential address updated.

## 3. Rights and Entitlements
Registered and active members in good standing are entitled to:
- Digital verified Membership ID Card with QR authentication.
- Formal appointment letter issued by the Nation Correspondence / General Secretary.
- Participation in regional delegations, civic meetings, and welfare drives.

## 4. Disciplinary Suspension and Cancellation
Membership may be suspended or revoked if a member:
- Engages in anti-social, illegal, or communally divisive activities.
- Uses the organization’s name or insignia for personal financial extortions.
- Violates the Member Code of Conduct.
`,
  },
  {
    title: 'Reporter Agreement',
    slug: 'reporter-agreement',
    category: 'agreements',
    summary: 'Formal contractual agreement between Seemanchal Express and accredited press correspondents.',
    isMandatoryFor: ['reporter'],
    content: `# Press Reporter Agreement | पत्रकार अनुबंध

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Engagement & Editorial Relationship
This Press Reporter Agreement ("Agreement") governs the terms of engagement between Seemanchal Express and the accredited Journalist/Reporter. The Reporter agrees to function as a field correspondent in their assigned location and beat.

## 2. Obligations of the Reporter
The Reporter undertakes to:
1. Conduct fact-checked, honest, and courageous ground reporting.
2. Verify all claims, police FIR details, and administrative quotes before submission.
3. Submit audio/visual evidence and primary documents alongside every major exposé.
4. Refrain from accepting bribes, gifts, or financial favors in exchange for positive or suppressed news coverage.

## 3. Editorial Authority & Publishing Rights
- Submission of a story does not guarantee immediate publication. All stories must pass editorial review.
- The Chief Editor reserves the absolute right to edit, modify headlines, demand further verification, or reject submissions.

## 4. Legal Responsibility
The Reporter assumes full personal responsibility for verifying factual statements. Seemanchal Express shall not defend willful fabrication, paid news, or personal vendettas carried out under the guise of reporting.

## 5. Termination & Suspension
Violation of editorial integrity, criminal charges, or misrepresentation results in immediate suspension and invalidation of the press accreditation ID card.
`,
  },
  {
    title: 'Reporter Code of Conduct',
    slug: 'reporter-code-of-conduct',
    category: 'conduct',
    summary: 'Professional and ethical guidelines mandatory for all field correspondents and photojournalists.',
    isMandatoryFor: ['reporter'],
    content: `# Reporter Code of Conduct | पत्रकारों की आचार संहिता

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Professional Conduct on the Field
Every journalist representing Seemanchal Express must carry themselves with dignity, neutrality, and civility:
- Always wear and display your official Digital Press ID Card when on assignment.
- Identify yourself clearly to public officials, police personnel, and citizens.
- Respect accident victims, bereaved families, and individuals in distress. Never intrude on personal grief.

## 2. Zero-Tolerance for Paid News & Corruption
- "Paid News", extortion, or blackmail is strictly prohibited and constitutes grounds for criminal prosecution.
- Reporters may not act as public relations agents or liaisons for political parties or commercial contractors.

## 3. Safety and Security in the Field
Journalists must avoid taking reckless physical risks in riot situations or natural calamities. The news organization values the life and physical safety of its personnel above any scoop.

## 4. Conflict of Interest
If a reporter has a personal, financial, or familial stake in an issue, they must disclose it and recuse themselves from reporting on that story.
`,
  },
  {
    title: 'Member Code of Conduct',
    slug: 'member-code-of-conduct',
    category: 'conduct',
    summary: 'Ethical behavior, decorum, and community responsibility expected from every registered member.',
    isMandatoryFor: ['member'],
    content: `# Member Code of Conduct | सदस्यों की आचार संहिता

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Commitment to Public Good
Members of Seemanchal Express serve as civic catalysts. They must foster harmony, educational enthusiasm, and community problem-solving.

## 2. Respect for the Law and Constitution
Every member must uphold the Constitution of India and obey all civil and penal laws. Any conduct bringing disrepute to the organization will result in immediate termination of membership.

## 3. Use of Organization Name
- Members may not issue press releases, call press conferences, or sign legal affidavits on behalf of Seemanchal Express without written sanction from the Central Committee.
- Membership ID cards must never be used to claim police privileges, bypass toll gates, or claim administrative favors.
`,
  },
  {
    title: 'Grievance Redressal Policy',
    slug: 'grievance-redressal',
    category: 'compliance',
    summary: 'Statutory grievance handling mechanism as per the Information Technology Digital Media Rules, 2021.',
    isMandatoryFor: [],
    content: `# Grievance Redressal Policy | शिकायत निवारण नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Statutory Compliance
In adherence to the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, Seemanchal Express has instituted an open, accountable, three-tier Grievance Redressal Mechanism.

## 2. Grievance Redressal Officer
- **Officer in Charge:** Chief Executive & Legal Ombudsman
- **Email:** \`mail@seemanchalexpress.in\`
- **Address:** F 65, Shaheen Bagh, Okhla, New Delhi - 110025, India
- **Contact:** +91 9871023184

## 3. Resolution Timeline
| Stage | Action & Timeframe |
| :--- | :--- |
| **Receipt & Acknowledgment** | Auto-generation of unique tracking reference (GRV-2026-XXXX) within **24 hours**. |
| **Internal Investigation** | Examination of facts, journalist dossier, and corroborating proofs within **7 days**. |
| **Final Resolution / Order** | Written resolution, retraction, or clarification issued within **15 days**. |

## 4. How to Submit a Complaint
Citizens, complainants, and public authorities may log formal grievances online via our [Online Grievance Submission Desk](/complaint) and monitor real-time status with their unique reference number and email.
`,
  },
  {
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    category: 'compliance',
    summary: 'Information about how we use cookies, local storage, and tracking technologies.',
    isMandatoryFor: [],
    content: `# Cookie Policy | कुकी नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. What Are Cookies?
Cookies are small text files placed on your device by websites that you visit. They are widely used to make websites work efficiently, provide analytics, and protect user sessions.

## 2. How We Use Cookies
- **Essential Cookies:** Required for secure authentication, token refresh, and admin session management.
- **Preference Cookies:** Remember your chosen language, reading mode, and display font scaling.
- **Analytical Cookies:** Track overall readership trends to help optimize reporting beats.

## 3. Managing Cookies
You can control and delete cookies through your browser settings. However, disabling essential cookies may hinder your ability to log in to the Member, Reporter, or Admin panels.
`,
  },
  {
    title: 'Content Submission Guidelines',
    slug: 'content-submission-guidelines',
    category: 'editorial',
    summary: 'Technical and journalistic formatting standards for submitting text, images, and video files.',
    isMandatoryFor: ['reporter'],
    content: `# Content Submission Guidelines | समाचार प्रविष्टि निर्देशिका

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Article Structure & Headings
When submitting a story through the Reporter Portal:
- **Headline (शीर्षक):** Clear, factual, and crisp. Avoid clickbait.
- **Lead Paragraph:** Must answer the fundamental journalistic questions: *Who, What, Where, When, and Why*.
- **Body & Quotes:** Attribute all claims to specific named sources, administrative officers, or legal FIR numbers.

## 2. Media Requirements
- **Photographs:** High-resolution JPG/PNG format. Watermarked or stolen internet photos are rejected immediately.
- **Videos:** Direct upload or verified YouTube/Vimeo links showing genuine on-ground recordings.
- **Sensitive Media:** Blur faces of minors, victims of abuse, and graphic injuries.

## 3. Plagiarism & Originality
Direct copying from other news portals or news wire feeds without credit is strictly forbidden and triggers editorial rejection.
`,
  },
  {
    title: 'ID Card Usage Policy',
    slug: 'id-card-usage-policy',
    category: 'conduct',
    summary: 'Strict regulations regarding the custody, verification, and non-misuse of digital press and member ID cards.',
    isMandatoryFor: ['reporter', 'member'],
    content: `# ID Card Usage Policy | पहचान पत्र उपयोग नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Digital Identity & QR Verification
Every approved Member and Reporter is issued a unique Digital ID Card featuring:
- Official identification number (e.g., \`SE-REP-2026-XXXX\` or \`SE-MEM-2026-XXXX\`).
- Machine-scannable QR code directing to the live online verification database at \`https://seemanchalexpress.in/verify/:id\`.
- Expiry date and authorized designation.

## 2. Rules of Custody
1. The ID Card is non-transferable and remains the property of Seemanchal Express.
2. It must be surrendered immediately upon cessation, suspension, or expulsion from the organization.
3. Loaning or subletting your ID card to any third party is a criminal offense and will be reported to the police.

## 3. Prohibited Misuse
ID cards must **never** be used for:
- Evading lawful police questioning, vehicle checks, or traffic penalties.
- Demanding free transport, cinema tickets, or commercial discounts.
- Seeking government contracts, illegal mediation, or threatening public servants.
`,
  },
  {
    title: 'Advertisement & Sponsorship Policy',
    slug: 'advertisement-and-sponsorship-policy',
    category: 'commercial',
    summary: 'Rules for commercial promotions, sponsored articles, and clear separation of news from advertising.',
    isMandatoryFor: [],
    content: `# Advertisement & Sponsorship Policy | विज्ञापन नीति

**Effective Date:** January 1, 2026  
**Last Updated:** October 31, 2026  

---

## 1. Clear Separation of News and Advertising
Seemanchal Express maintains an uncompromising wall between its editorial newsroom and commercial advertising:
- All paid promotions, advertorials, and sponsored articles are prominently labeled as **"Sponsored Content"** or **"Advertisement"**.
- Advertisers have zero influence over news coverage, editorial topics, or investigatory reporting.

## 2. Prohibited Advertisements
We reject advertisements that:
- Promote hate speech, discriminatory ideologies, or illegal betting/gambling.
- Make fraudulent healthcare claims, magical remedies, or get-rich-quick scams.
- Mimic genuine breaking news alerts to mislead readers.

## 3. Editorial Discretion
Seemanchal Express reserves the right to reject, suspend, or cancel any advertisement that violates public decency, truthfulness, or legal standards.
`,
  },
];

const seedLegalDocuments = async (adminUserId = null) => {
  try {
    for (const doc of legalDocumentsData) {
      const existing = await LegalDocument.findOne({ slug: doc.slug });
      if (!existing) {
        const created = await LegalDocument.create({
          ...doc,
          status: 'published',
          version: 1,
          effectiveDate: new Date('2026-01-01'),
          lastUpdated: new Date(),
          publishedAt: new Date(),
          createdBy: adminUserId,
          updatedBy: adminUserId,
        });

        // Create initial version record
        await LegalDocumentVersion.create({
          documentId: created._id,
          versionNumber: 1,
          title: created.title,
          content: created.content,
          changeSummary: 'Initial policy creation and baseline publication',
          changedBy: adminUserId,
          createdAt: new Date(),
        });
      }
    }
    console.log(`[Legal Seed] Verified all 15 Legal Documents in database.`);
  } catch (err) {
    console.error('[Legal Seed] Error seeding legal documents:', err.message);
  }
};

module.exports = { seedLegalDocuments, legalDocumentsData };

