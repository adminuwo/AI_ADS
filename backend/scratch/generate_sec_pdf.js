const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Security_Access_Control.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Security_Access_Control.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Security & Access Control Document - AI Ads Enterprise Platform</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    /* Cover Page */
    .cover-page {
      height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12mm 8mm;
      border: 2px solid #0f172a;
      border-radius: 8px;
      position: relative;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
    }

    .cover-header {
      border-bottom: 3px solid #ef4444;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #7f1d1d;
      color: #fca5a5;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid #ef4444;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 18px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 13.5pt;
      font-weight: 400;
      color: #cbd5e1;
      margin: 0;
    }

    .cover-body {
      margin: 30px 0;
    }

    .cover-desc {
      font-size: 10pt;
      color: #e2e8f0;
      line-height: 1.6;
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #ef4444;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 25px;
    }

    .meta-card {
      background: rgba(255, 255, 255, 0.08);
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .meta-card .label {
      font-size: 7.5pt;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .meta-card .value {
      font-size: 9.5pt;
      font-weight: 600;
      color: #ffffff;
    }

    .cover-footer {
      border-top: 1px solid #334155;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #94a3b8;
    }

    /* Headings & Typography */
    h1 {
      font-size: 15pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 12pt;
      font-weight: 600;
      color: #1e3a8a;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 10pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
      color: #334155;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 20px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin-top: 8px;
      margin-bottom: 14px;
      line-height: 1.4;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      margin-bottom: 14px;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #334155;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Badges & Severity Labels */
    .badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .badge-critical { background: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
    .badge-high { background: #ffedd5; color: #9a3412; border: 1px solid #fb923c; }
    .badge-medium { background: #fef3c7; color: #92400e; border: 1px solid #facc15; }
    .badge-low { background: #e0f2fe; color: #075985; border: 1px solid #38bdf8; }
    .badge-green { background: #dcfce7; color: #166534; }

    .callout {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 12px 0;
      font-size: 9pt;
    }

    .callout-warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }

    .callout-title {
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 3px;
    }

    .callout-warning .callout-title {
      color: #b45309;
    }

    /* TOC */
    .toc-list {
      list-style: none;
      padding-left: 0;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dotted #cbd5e1;
      font-size: 9pt;
    }

    .toc-title {
      font-weight: 600;
      color: #0f172a;
    }

    .toc-num {
      font-weight: 600;
      color: #2563eb;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <span class="cover-badge">Verified Security Audit</span>
      <h1 class="cover-title">SECURITY & ACCESS CONTROL SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Security Architecture)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document provides a technical audit of the security controls, authentication mechanisms, Role-Based Access Control (RBAC), multi-tenant data isolation, secrets management, input sanitization, and third-party integration security implemented across the <strong>AI Ads™ Enterprise Platform</strong>. Derived directly from source code inspection of backend middleware, routes, Mongoose models, and frontend authentication services.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">SEC-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Token Protocol</div>
          <div class="value">JWT Bearer Auth + 6-Digit OTP</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Information Security Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Password Encryption</div>
          <div class="value">bcryptjs (10 Salt Rounds)</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Audit Verification</div>
          <div class="value"><span class="badge badge-green">AUDITED PRODUCTION IMPLEMENTATION</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Information Security Document</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Authentication & Session Management</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. User Roles, Permissions & RBAC Framework</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Multi-Tenant Workspace & Data Isolation</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. API Security & Authorization Middleware</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item"><span class="toc-title">5. Sensitive Data Storage & Cryptographic Controls</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. Environment Variables & Secrets Management</span><span class="toc-num">Section 6</span></div>
    <div class="toc-item"><span class="toc-title">7. Input Validation, Error Handling & Rate Limiting</span><span class="toc-num">Section 7</span></div>
    <div class="toc-item"><span class="toc-title">8. Database Access Security & Injection Prevention</span><span class="toc-num">Section 8</span></div>
    <div class="toc-item"><span class="toc-title">9. Third-Party AI Services & Cloud Storage Security</span><span class="toc-num">Section 9</span></div>
    <div class="toc-item"><span class="toc-title">10. Identified Security Risks, Mitigation Matrix & Recommendations</span><span class="toc-num">Section 10</span></div>
  </div>

  <div class="callout" style="margin-top: 20px;">
    <div class="callout-title">SECURITY AUDIT COMPLIANCE DIRECTIVE</div>
    This security specification evaluates actual implemented code controls vs recommendations. No API keys, passwords, JWT secrets, or cloud tokens are disclosed in this document.
  </div>

  <!-- SECTION 1 -->
  <h1>1. Authentication & Session Management</h1>

  <h2>1.1 JSON Web Token (JWT) Authentication</h2>
  <p>
    The platform implements stateless session authentication via JSON Web Tokens (JWT) using the <code>jsonwebtoken</code> npm library. Upon successful user authentication, a signed JWT containing <code>userId</code>, <code>email</code>, and <code>role</code> is returned to the client and stored in <code>localStorage</code> under key <code>aisa_token</code>.
  </p>

  <h2>1.2 Authentication Middleware (<code>backend/middleware/auth.js</code>)</h2>
  <table>
    <thead>
      <tr>
        <th>Middleware Name</th>
        <th>Implementation File</th>
        <th>Verification Logic</th>
        <th>Failure Response</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>requireAuth</code></td>
        <td><code>backend/middleware/auth.js</code></td>
        <td>Validates <code>Authorization: Bearer &lt;token&gt;</code> header. Decodes JWT using <code>JWT_SECRET</code>, queries User model, populates <code>req.user</code>.</td>
        <td>HTTP 401 <code>{ success: false, error: 'Authentication required.' }</code></td>
      </tr>
      <tr>
        <td><code>optionalAuth</code></td>
        <td><code>backend/middleware/auth.js</code></td>
        <td>Inspects Authorization header if present. Populates <code>req.user</code> if token is valid; proceeds with <code>req.user = null</code> if absent.</td>
        <td>None (Proceeds to route handler).</td>
      </tr>
    </tbody>
  </table>

  <h2>1.3 6-Digit Email OTP Verification Protocol</h2>
  <p>
    Sensitive account operations (e.g. permanent account deletion in <code>accountRoutes.js</code>) utilize a two-step 6-digit Email OTP protocol:
  </p>
  <ul>
    <li>Client calls <code>POST /api/account/send-delete-otp</code>.</li>
    <li>Server generates a 6-digit random code valid for 10 minutes stored in an in-memory <code>deleteOtpStore</code> map. Requests are rate-limited to 1 request per 30 seconds per email.</li>
    <li>OTP is dispatched via SMTP using Nodemailer. Client validates code via <code>POST /api/account/verify-delete-otp</code>.</li>
  </ul>

  <!-- SECTION 2 -->
  <h1>2. User Roles, Permissions & RBAC Framework</h1>
  <p>
    Role-Based Access Control (RBAC) is enforced at the router middleware level. Role values defined in <code>User.js</code> schema enum include:
  </p>

  <table>
    <thead>
      <tr>
        <th>Role Identifier</th>
        <th>System Classification</th>
        <th>Access Rights & Privileges</th>
        <th>Enforcement Mechanism</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>SuperAdmin</code> / <code>Admin</code></td>
        <td>Platform Administrator</td>
        <td>Full access to dashboard telemetry, user blocking, quota updates, support desk, legal policy editing, tool limits.</td>
        <td>Checked via <code>adminAuth</code> middleware in <code>adminRoutes.js</code>.</td>
      </tr>
      <tr>
        <td><code>AgencyAdmin</code></td>
        <td>Organization Admin</td>
        <td>Manage multi-brand workspaces, invite team members, adjust team visual credits.</td>
        <td>Checked via workspace ownership & role checks.</td>
      </tr>
      <tr>
        <td><code>Developer</code> / <code>developer</code></td>
        <td>Engineering Team</td>
        <td>Access API telemetry logs, route health monitoring, feature toggles.</td>
        <td>Checked via <code>adminAuth</code> middleware.</td>
      </tr>
      <tr>
        <td><code>User</code> / <code>user</code></td>
        <td>Standard Subscriber</td>
        <td>Create workspaces, run brand scraping, generate marketing roadmaps, SEO content, AI websites, ad creatives, manage calendar.</td>
        <td>Scoped to workspace ID and user quota limits.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h1>3. Multi-Tenant Workspace & Data Isolation</h1>
  <p>
    Multi-tenant data isolation is enforced across database collections using explicit tenant keys (<code>workspaceId</code> or <code>userEmail</code>):
  </p>
  <ul>
    <li><strong>Workspace Scoping:</strong> Models including <code>BrandProfile</code>, <code>Campaign</code>, <code>CampaignPost</code>, <code>Content</code>, and <code>WebsiteProject</code> store indexed <code>workspaceId</code> keys.</li>
    <li><strong>Query Filtering:</strong> API route handlers filter database queries using <code>req.user.email</code> or validated <code>workspaceId</code> parameters, ensuring users cannot access documents belonging to unauthorized workspaces.</li>
  </ul>

  <!-- SECTION 4 -->
  <h1>4. API Security & Authorization Middleware</h1>

  <h2>4.1 CORS Security Policy</h2>
  <p>
    CORS middleware in <code>backend/server.js</code> restricts API access to explicit whitelisted origins:
  </p>
  <ul>
    <li>Production Domains: <code>https://aiads.aisa24.com</code>, <code>https://aisa24.com</code>, <code>https://uwo24.com</code>, <code>https://aimall24.com</code>, and GCP Cloud Run <code>*.run.app</code> subdomains.</li>
    <li>Local Development: <code>http://localhost:5173</code>, <code>http://localhost:3000</code>, <code>http://localhost:5000</code>, <code>http://localhost:8080</code>.</li>
  </ul>

  <h2>4.2 Request Body Payload Limits</h2>
  <p>
    Express JSON and URL-encoded parsers in <code>server.js</code> enforce a <code>50mb</code> payload limit (<code>express.json({ limit: '50mb' })</code>) to allow inline visual banner uploads for AI image editing agents while preventing unbounded buffer allocation.
  </p>

  <!-- SECTION 5 -->
  <h1>5. Sensitive Data Storage & Cryptographic Controls</h1>

  <h2>5.1 Password Hashing</h2>
  <p>
    Passwords are encrypted using <code>bcryptjs</code> with 10 salt rounds inside a Mongoose <code>pre('save')</code> hook in <code>backend/models/User.js</code>:
  </p>
  <pre>
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
  </pre>

  <h2>5.2 Schema Sensitive Field Stripping</h2>
  <p>
    Sensitive identity fields are excluded from database query projections using Mongoose <code>select: false</code> and stripped from JSON outputs via a <code>toJSON</code> schema transformer:
  </p>
  <pre>
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.verificationCode;
    delete ret.resetPasswordToken;
    delete ret.providerId;
    return ret;
  },
});
  </pre>

  <!-- SECTION 6 -->
  <h1>6. Environment Variables & Secrets Management</h1>
  <p>
    System environment variables are loaded securely via <code>dotenv</code> in local environments and injected via GCP Secret Manager in production.
  </p>

  <table>
    <thead>
      <tr>
        <th>Variable Name</th>
        <th>Classification</th>
        <th>Architectural Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>MONGO_URI</code></td>
        <td>Critical Secret</td>
        <td>MongoDB Atlas cluster connection string with encrypted credentials.</td>
      </tr>
      <tr>
        <td><code>JWT_SECRET</code></td>
        <td>Critical Secret</td>
        <td>Cryptographic secret key used to sign and verify JSON Web Tokens.</td>
      </tr>
      <tr>
        <td><code>OPENAI_API_KEY</code></td>
        <td>API Secret Key</td>
        <td>OpenAI API key used for failover text execution.</td>
      </tr>
      <tr>
        <td><code>GOOGLE_APPLICATION_CREDENTIALS</code></td>
        <td>Credential Path</td>
        <td>GCP Service Account ADC key file path for Vertex AI and Cloud Storage.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 7 -->
  <h1>7. Input Validation, Error Handling & Rate Limiting</h1>
  <ul>
    <li><strong>Input Validation:</strong> API controllers check required request body parameters (e.g. <code>!email</code>, <code>!prompt</code>, <code>!primaryKeyword</code>), returning HTTP 400 on missing parameters.</li>
    <li><strong>Rate Limiting:</strong> Account deletion OTP generation enforces a 30-second cooldown per email address. API endpoints hit count is logged globally.</li>
    <li><strong>Production Error Masking:</strong> Database errors and exceptions are caught in try/catch blocks, returning sanitized JSON error messages without exposing backend stack traces.</li>
  </ul>

  <!-- SECTION 8 -->
  <h1>8. Database Access Security & Injection Prevention</h1>
  <ul>
    <li><strong>NoSQL Injection Prevention:</strong> Database queries utilize Mongoose ODM structured schema objects rather than raw string concatenation, preventing NoSQL query injection attacks.</li>
    <li><strong>Encryption at Rest & Transit:</strong> MongoDB Atlas enforces mandatory TLS 1.3 wire encryption and AES-256 volume encryption at rest.</li>
  </ul>

  <!-- SECTION 9 -->
  <h1>9. Third-Party AI Services & Cloud Storage Security</h1>
  <ul>
    <li><strong>Vertex AI ADC Security:</strong> Google Cloud Vertex AI calls use GCP Application Default Credentials (ADC) attached to the Compute Engine default service account, eliminating hardcoded service account keys.</li>
    <li><strong>Signed Storage URLs:</strong> Google Cloud Storage service (<code>gcsStorageService.js</code>) generates time-bounded signed URLs for secure access to media assets stored in bucket <code>ai-ads-creatives</code>.</li>
  </ul>

  <!-- SECTION 10 -->
  <h1>10. Security Risk Matrix & Recommendations</h1>

  <table>
    <thead>
      <tr>
        <th>Risk ID</th>
        <th>Identified Risk Condition</th>
        <th>Severity</th>
        <th>Mitigation / Recommended Control</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>SEC-01</code></td>
        <td>In-Memory Delete OTP Store resets on container restarts.</td>
        <td><span class="badge badge-medium">MEDIUM</span></td>
        <td>Migrate <code>deleteOtpStore</code> to Redis with automatic TTL expiration.</td>
      </tr>
      <tr>
        <td><code>SEC-02</code></td>
        <td>Lack of explicit JWT token revocation / blacklist endpoint.</td>
        <td><span class="badge badge-medium">MEDIUM</span></td>
        <td>Implement a Redis-backed token blacklist for instant logout invalidation.</td>
      </tr>
      <tr>
        <td><code>SEC-03</code></td>
        <td>50MB request payload limit allows high memory allocation per request.</td>
        <td><span class="badge badge-low">LOW</span></td>
        <td>Restructure image editing uploads to stream directly to GCS via signed upload URLs.</td>
      </tr>
      <tr>
        <td><code>SEC-04</code></td>
        <td>Missing explicit rate-limiting on heavy AI generation endpoints.</td>
        <td><span class="badge badge-high">HIGH</span></td>
        <td>Attach <code>express-rate-limit</code> (e.g. 20 requests/min per IP) to AI text and image generation routes.</td>
      </tr>
    </tbody>
  </table>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting Security & Access Control PDF Generation via Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: pdfOutputPath1,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
        <span>AI Ads™ Enterprise Platform (v2.0) — Security &amp; Access Control Document</span>
        <span>SEC-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Information Security Document</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm'
    }
  });

  // Also copy/generate to secondary docs path to guarantee deliverable location
  fs.copyFileSync(pdfOutputPath1, pdfOutputPath2);

  await browser.close();
  console.log(`✅ Security & Access Control PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generatePDF().catch((err) => {
  console.error('❌ Error generating Security PDF:', err);
  process.exit(1);
});
