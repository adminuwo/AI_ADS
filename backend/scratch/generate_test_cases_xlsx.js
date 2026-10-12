const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const xlsxOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Test_Cases.xlsx';
const xlsxOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Test_Cases.xlsx';

async function createTestCasesExcel() {
  console.log('🚀 Starting Test Cases Excel Generation via ExcelJS...');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'AI Ads QA & Test Engineering Team';
  workbook.lastModifiedBy = 'AI Ads Automated QA Engine';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet('Test Cases Repository', {
    pageSetup: { paperSize: 9, orientation: 'landscape' }
  });

  // Define Columns
  sheet.columns = [
    { header: 'Test Case ID', key: 'id', width: 16 },
    { header: 'Module', key: 'module', width: 22 },
    { header: 'Feature / Component', key: 'feature', width: 24 },
    { header: 'Test Scenario / Objective', key: 'scenario', width: 35 },
    { header: 'Preconditions', key: 'preconditions', width: 28 },
    { header: 'Test Steps', key: 'steps', width: 40 },
    { header: 'Test Data', key: 'data', width: 28 },
    { header: 'Expected Result', key: 'expected', width: 35 },
    { header: 'Execution Status', key: 'status', width: 16 },
    { header: 'Severity', key: 'severity', width: 14 },
    { header: 'Priority', key: 'priority', width: 12 }
  ];

  // Header Styling (Navy #0F172A, Bold White Text)
  const headerRow = sheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' }
    };
    cell.font = {
      name: 'Arial',
      size: 10,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF334155' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      bottom: { style: 'medium', color: { argb: 'FF2563EB' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  // Test Case Rows Data
  const testCasesData = [
    // Authentication
    {
      id: 'TC-AUTH-001',
      module: 'Authentication',
      feature: 'User Login',
      scenario: 'User login with valid registered credentials',
      preconditions: 'User registered in MongoDB Atlas users collection',
      steps: '1. Navigate to /login\n2. Input email and password\n3. Click Sign In button',
      data: 'email: user@example.com, pass: Password123!',
      expected: 'JWT Bearer token returned, saved in localStorage.aisa_token. User redirected to dashboard.',
      status: 'Not Run',
      severity: 'CRITICAL',
      priority: 'P1'
    },
    {
      id: 'TC-AUTH-002',
      module: 'Authentication',
      feature: '6-Digit Email OTP',
      scenario: 'Generate 6-digit OTP code for account deletion',
      preconditions: 'User logged in',
      steps: '1. POST /api/account/send-delete-otp\n2. Body: { "email": "user@example.com" }',
      data: 'email: user@example.com',
      expected: '6-digit OTP code saved in memory deleteOtpStore, email sent via Nodemailer. HTTP 200 returned.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    {
      id: 'TC-AUTH-003',
      module: 'Authentication',
      feature: 'Rate Limiting',
      scenario: 'Enforce 30-second rate limit on OTP generation',
      preconditions: 'OTP requested <30s ago',
      steps: '1. POST /api/account/send-delete-otp again within 10 seconds',
      data: 'email: user@example.com',
      expected: 'HTTP 429 returned with error message "Please wait X seconds before requesting another code."',
      status: 'Not Run',
      severity: 'MEDIUM',
      priority: 'P2'
    },
    // Workspaces
    {
      id: 'TC-WS-001',
      module: 'Workspace Management',
      feature: 'Workspace Creation',
      scenario: 'Create a new multi-tenant brand workspace',
      preconditions: 'User authenticated',
      steps: '1. POST /api/workspace/create\n2. Body: { brandName: "TechCorp", domainUrl: "techcorp.com" }',
      data: 'brandName: TechCorp, domainUrl: https://techcorp.com',
      expected: 'New Workspace document created in MongoDB Atlas, workspaceId returned.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    {
      id: 'TC-WS-002',
      module: 'Workspace Management',
      feature: 'Workspace Switcher',
      scenario: 'Switch active workspace state in React frontend',
      preconditions: 'Multiple workspaces exist',
      steps: '1. Click Workspace Switcher dropdown in Header.jsx\n2. Select target workspace',
      data: 'Target workspaceId: ws_002',
      expected: 'WorkspaceContext updates activeWorkspace and triggers brand profile reload for target workspace.',
      status: 'Not Run',
      severity: 'MEDIUM',
      priority: 'P2'
    },
    // Brand DNA
    {
      id: 'TC-BRAND-001',
      module: 'Brand DNA Engine',
      feature: 'Web Scraper & Extraction',
      scenario: 'Scrape domain and extract structured Brand DNA',
      preconditions: 'Target website accessible',
      steps: '1. POST /api/brand/analyze\n2. Body: { domainUrl: "https://example.com" }',
      data: 'domainUrl: https://example.com',
      expected: 'Puppeteer scrapes DOM, node-vibrant extracts colors, Gemini 3.5 structures brand voice & tone.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    {
      id: 'TC-BRAND-002',
      module: 'Brand DNA Engine',
      feature: 'Confidence Audit',
      scenario: 'Verify AI confidence score calculation on extracted brand profile',
      preconditions: 'Brand scraping completed',
      steps: '1. GET /api/brand/:workspaceId',
      data: 'workspaceId: ws_001',
      expected: 'Returns BrandProfile document with aiConfidence score (default 85%+).',
      status: 'Not Run',
      severity: 'MEDIUM',
      priority: 'P3'
    },
    // Strategy Hub
    {
      id: 'TC-STRAT-001',
      module: 'Strategy Hub',
      feature: '30-Day Roadmap',
      scenario: 'Generate 30-day multi-channel marketing roadmap',
      preconditions: 'Brand DNA established',
      steps: '1. POST /api/workspace/:id/generate-strategy',
      data: 'workspaceId: ws_001',
      expected: 'Generates structured 30-day marketing plan grouped by weekly themes and funnel stages.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    {
      id: 'TC-STRAT-002',
      module: 'Strategy Hub',
      feature: 'Single-Card Regeneration',
      scenario: 'Regenerate individual strategy card using AI',
      preconditions: 'Strategy roadmap exists',
      steps: '1. POST /api/workspace/:id/regenerate-strategy-card\n2. Pass target card ID',
      data: 'cardId: card_w2_d3',
      expected: 'Single card updated with new AI recommendations without overwriting full roadmap.',
      status: 'Not Run',
      severity: 'MEDIUM',
      priority: 'P2'
    },
    // SEO Intelligence
    {
      id: 'TC-SEO-001',
      module: 'SEO Intelligence',
      feature: 'Keyword Intent Clustering',
      scenario: 'Cluster keywords by search intent and SERP opportunity',
      preconditions: 'Seed keyword provided',
      steps: '1. POST /api/seo/keywords/cluster\n2. Body: { seedKeyword: "AI Marketing" }',
      data: 'seedKeyword: AI Marketing',
      expected: 'Returns 12+ keyword intent clusters with volume and difficulty metrics.',
      status: 'Not Run',
      severity: 'MEDIUM',
      priority: 'P2'
    },
    {
      id: 'TC-SEO-002',
      module: 'SEO Intelligence',
      feature: 'SEO Brief Builder',
      scenario: 'Generate structured SEO content brief and outline',
      preconditions: 'Keyword selected',
      steps: '1. POST /api/seo/brief/generate\n2. Body: { primaryKeyword: "AI Ads" }',
      data: 'primaryKeyword: AI Ads',
      expected: 'Generates SEO brief with heading structures (H1-H3), LSI keywords, and target word count.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    // Content Studio
    {
      id: 'TC-CONT-001',
      module: 'Content Studio',
      feature: 'Social Copy Generator',
      scenario: 'Generate platform-tailored social copy for LinkedIn',
      preconditions: 'Workspace active',
      steps: '1. POST /api/content/social/generate\n2. Body: { platform: "LinkedIn", topic: "Product Launch" }',
      data: 'platform: LinkedIn, topic: Launch',
      expected: 'Generates professional copy with hooks, emojis, and hashtags.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    {
      id: 'TC-CONT-002',
      module: 'Content Studio',
      feature: 'Long-Form Blog Generator',
      scenario: 'Generate 1,500+ word structured blog article',
      preconditions: 'SEO Brief ready',
      steps: '1. POST /api/content/blog/draft\n2. Body: { topic: "Enterprise AI Growth" }',
      data: 'topic: Enterprise AI Growth',
      expected: 'Generates full structured blog post matching brand voice tone.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P2'
    },
    // Creative Studio
    {
      id: 'TC-CREAT-001',
      module: 'Creative Studio',
      feature: 'AI Ad Visual Generation',
      scenario: 'Generate AI ad banner image via Gemini 3.1 Flash Image',
      preconditions: 'User credits > 0',
      steps: '1. Trigger visual generation\n2. Aspect ratio 1:1',
      data: 'model: gemini-3.1-flash-image, ratio: 1:1',
      expected: 'Generates visual URL ($0.03 unit cost), deducts 1 credit, logs transaction in CreditLog.',
      status: 'Not Run',
      severity: 'CRITICAL',
      priority: 'P1'
    },
    {
      id: 'TC-CREAT-002',
      module: 'Creative Studio',
      feature: 'Visual Credit Check',
      scenario: 'Block generation when credit balance is zero',
      preconditions: 'User credit balance = 0',
      steps: '1. Trigger visual generation',
      data: 'credits: 0',
      expected: 'Action blocked with error: "Insufficient visual credits. Please top up."',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    // AI Website Builder
    {
      id: 'TC-WEB-001',
      module: 'AI Web Builder',
      feature: 'Full Page HTML Code Gen',
      scenario: 'Compile full page HTML5 & Tailwind CSS website blueprint',
      preconditions: 'Requirement analyzed',
      steps: '1. POST /api/website-builder/generate\n2. Body: { blueprint: {...} }',
      data: 'blueprint object',
      expected: 'Compiles full responsive HTML5 & CSS3 layout code.',
      status: 'Not Run',
      severity: 'CRITICAL',
      priority: 'P1'
    },
    {
      id: 'TC-WEB-002',
      module: 'AI Web Builder',
      feature: 'Live Chat Edit per Turn',
      scenario: 'Modify website element via natural language chat edit',
      preconditions: 'Website generated',
      steps: '1. POST /api/website-builder/chat-edit\n2. Message: "Change hero text to dark blue"',
      data: 'message: Change hero text',
      expected: 'Modifies target HTML element, increments version in WebsiteVersion (v1 -> v2).',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P2'
    },
    // Mobile Responsiveness
    {
      id: 'TC-MOB-001',
      module: 'Mobile Navigation',
      feature: 'Mobile Drawer Toggle',
      scenario: 'Toggle mobile navigation drawer on mobile viewports',
      preconditions: 'Viewport width <768px',
      steps: '1. Click hamburger icon in Header.jsx',
      data: 'viewport: mobile',
      expected: 'isMobileMenuOpen toggles to true; navigation drawer slides into view.',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    },
    {
      id: 'TC-MOB-002',
      module: 'Mobile Viewport',
      feature: 'Preview Device Simulator',
      scenario: 'Switch preview device emulator to mobile in Website Builder',
      preconditions: 'Website Builder active',
      steps: '1. Select Mobile device icon in WebsitePreviewEngine.jsx',
      data: 'deviceViewport: mobile',
      expected: 'Preview container resizes to 375px mobile viewport dimensions.',
      status: 'Not Run',
      severity: 'MEDIUM',
      priority: 'P2'
    },
    // Security & RBAC
    {
      id: 'TC-SEC-001',
      module: 'Security & RBAC',
      feature: 'Invalid Token Rejection',
      scenario: 'Reject API requests with invalid or expired Bearer token',
      preconditions: 'Invalid token supplied',
      steps: '1. GET /api/admin/dashboard-summary\n2. Authorization: Bearer invalid_token',
      data: 'token: invalid_token',
      expected: 'HTTP 401 returned: "Invalid or expired authentication token."',
      status: 'Not Run',
      severity: 'CRITICAL',
      priority: 'P1'
    },
    {
      id: 'TC-SEC-002',
      module: 'Security & RBAC',
      feature: 'Super Admin Access Control',
      scenario: 'Restrict non-admin users from accessing admin routes',
      preconditions: 'User role = "User"',
      steps: '1. GET /api/admin/dashboard-summary with standard user JWT',
      data: 'role: User',
      expected: 'HTTP 403 returned: "Admin access required."',
      status: 'Not Run',
      severity: 'HIGH',
      priority: 'P1'
    }
  ];

  // Populate Sheet Rows
  testCasesData.forEach((tc) => {
    const row = sheet.addRow({
      id: tc.id,
      module: tc.module,
      feature: tc.feature,
      scenario: tc.scenario,
      preconditions: tc.preconditions,
      steps: tc.steps,
      data: tc.data,
      expected: tc.expected,
      status: tc.status,
      severity: tc.severity,
      priority: tc.priority
    });

    row.height = 36;
    row.alignment = { vertical: 'top', wrapText: true };

    // Format Execution Status Cell (Gray background for 'Not Run')
    const statusCell = row.getCell('status');
    statusCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF1F5F9' }
    };
    statusCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF475569' } };
    statusCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Format Severity Cell Colors
    const sevCell = row.getCell('severity');
    sevCell.alignment = { vertical: 'middle', horizontal: 'center' };
    if (tc.severity === 'CRITICAL') {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      sevCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF991B1B' } };
    } else if (tc.severity === 'HIGH') {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEDD5' } };
      sevCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF9A3412' } };
    } else if (tc.severity === 'MEDIUM') {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE3C7' } };
      sevCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF92400E' } };
    } else {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
      sevCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF075985' } };
    }

    // Format Priority Cell
    const priCell = row.getCell('priority');
    priCell.alignment = { vertical: 'middle', horizontal: 'center' };
    priCell.font = { name: 'Arial', size: 9, bold: true };

    // Cell Borders
    row.eachCell((c) => {
      c.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    });
  });

  // Write Excel Files
  await workbook.xlsx.writeFile(xlsxOutputPath1);
  fs.copyFileSync(xlsxOutputPath1, xlsxOutputPath2);

  console.log(`✅ Test Cases Excel generated successfully at:\n 1: ${xlsxOutputPath1}\n 2: ${xlsxOutputPath2}`);
}

createTestCasesExcel().catch((err) => {
  console.error('❌ Error generating Test Cases Excel:', err);
  process.exit(1);
});
