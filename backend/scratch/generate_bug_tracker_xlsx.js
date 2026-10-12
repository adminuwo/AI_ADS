const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const xlsxOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Bug_Tracker.xlsx';
const xlsxOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Bug_Tracker.xlsx';

async function createBugTrackerExcel() {
  console.log('🚀 Starting Bug Tracker Excel Generation via ExcelJS...');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'AI Ads QA & Security Engineering';
  workbook.lastModifiedBy = 'AI Ads Defect Management System';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet('Defect & Risk Repository', {
    pageSetup: { paperSize: 9, orientation: 'landscape' }
  });

  // Define Columns
  sheet.columns = [
    { header: 'Bug ID', key: 'id', width: 14 },
    { header: 'Module', key: 'module', width: 22 },
    { header: 'Issue Description', key: 'description', width: 35 },
    { header: 'Severity', key: 'severity', width: 14 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Reproduction Steps', key: 'steps', width: 35 },
    { header: 'Expected Behavior', key: 'expected', width: 30 },
    { header: 'Actual Behavior', key: 'actual', width: 30 },
    { header: 'Root Cause', key: 'cause', width: 30 },
    { header: 'Fix Status', key: 'fixStatus', width: 18 },
    { header: 'Retesting Status', key: 'retestStatus', width: 18 }
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
      bottom: { style: 'medium', color: { argb: 'FFF59E0B' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  // Bug & Issue Repository Rows
  const bugData = [
    {
      id: 'BUG-001',
      module: 'Chat Engine',
      description: 'Historical chat user IDs stored as string instead of Mongoose ObjectId ref',
      severity: 'HIGH',
      priority: 'P1',
      steps: '1. Fetch legacy chat sessions created before v2.0\n2. Call GET /api/admin/chat-sessions',
      expected: 'Populated User document references returned for all chat sessions.',
      actual: 'Mongoose populate returns null for legacy string user IDs.',
      cause: 'Early schema migration gap storing plain email strings instead of User._id.',
      fixStatus: 'Resolved',
      retestStatus: 'Verified Passed'
    },
    {
      id: 'BUG-002',
      module: 'Security / CORS',
      description: 'CORS preflight failure on unlisted subdomains and Cloud Run URLs',
      severity: 'HIGH',
      priority: 'P1',
      steps: '1. Send request from https://app.aisa24.com to /api/chat',
      expected: 'CORS preflight OPTIONS request returns 200 with Access-Control-Allow-Origin.',
      actual: 'Browser blocks response with CORS header error.',
      cause: 'Static array origin lookup without dynamic regex hostname suffix matching.',
      fixStatus: 'Resolved',
      retestStatus: 'Verified Passed'
    },
    {
      id: 'BUG-003',
      module: 'Strategy Hub',
      feature: 'Strategy Card Regen',
      description: 'Regenerating 1 strategy card resets state of other 29 roadmap cards in React context',
      severity: 'MEDIUM',
      priority: 'P2',
      steps: '1. Open Strategy Hub\n2. Regenerate card #3',
      expected: 'Card #3 updates while other 29 strategy cards retain current state.',
      actual: 'Other 29 strategy cards reset to blank default values.',
      cause: 'Direct array state mutation in state reducer instead of immutable cloning.',
      fixStatus: 'Resolved',
      retestStatus: 'Verified Passed'
    },
    {
      id: 'BUG-004',
      module: 'Account Security',
      description: 'In-Memory Delete OTP Store volatile on container restarts',
      severity: 'MEDIUM',
      priority: 'P2',
      steps: '1. POST /api/account/send-delete-otp\n2. Restart server process\n3. POST /api/account/verify-delete-otp',
      expected: 'OTP verification succeeds within 10-minute window.',
      actual: 'Server returns "Expired or invalid OTP code" due to lost in-memory Map.',
      cause: 'In-memory deleteOtpStore Map() used instead of persistent Redis cache.',
      fixStatus: 'Confirmed Open',
      retestStatus: 'Pending Fix'
    },
    {
      id: 'BUG-005',
      module: 'Backend Parser',
      description: '50MB request body limit allows high memory allocation per request',
      severity: 'MEDIUM',
      priority: 'P3',
      steps: '1. Submit large 45MB base64 JSON payload to API endpoint',
      expected: 'Payloads buffered efficiently without memory spike.',
      actual: 'Node process memory spikes temporarily by ~50MB per concurrent request.',
      cause: '50MB limit enabled globally in express.json() to support base64 images.',
      fixStatus: 'Confirmed Open',
      retestStatus: 'Pending Fix'
    },
    {
      id: 'RISK-001',
      module: 'AI Orchestrator',
      description: 'Missing rate-limiting on heavy AI generation routes',
      severity: 'HIGH',
      priority: 'P2',
      steps: '1. Send 100 concurrent POST requests to /api/content/social/generate',
      expected: 'Rate limiter caps requests per IP to prevent quota exhaustion.',
      actual: 'Requests proceed until Google Vertex AI 300 RPM quota is exceeded.',
      cause: 'express-rate-limit attached to OTP routes but not to AI generation routes.',
      fixStatus: 'Potential Risk',
      retestStatus: 'Not Retested'
    },
    {
      id: 'RISK-002',
      module: 'Mobile Client',
      description: 'Standalone native React Native codebase repository unverified/absent',
      severity: 'LOW',
      priority: 'P3',
      steps: '1. Inspect workspace repository for native iOS/Android code folders',
      expected: 'Native React Native app project directory exists.',
      actual: 'Project relies on responsive React PWA mobile layout & mobile REST API headers.',
      cause: 'Native codebase managed in external repo or unintegrated in workspace.',
      fixStatus: 'Potential Risk',
      retestStatus: 'Not Retested'
    }
  ];

  // Populate Sheet Rows
  bugData.forEach((bug) => {
    const row = sheet.addRow({
      id: bug.id,
      module: bug.module,
      description: bug.description,
      severity: bug.severity,
      priority: bug.priority,
      steps: bug.steps,
      expected: bug.expected,
      actual: bug.actual,
      cause: bug.cause,
      fixStatus: bug.fixStatus,
      retestStatus: bug.retestStatus
    });

    row.height = 42;
    row.alignment = { vertical: 'top', wrapText: true };

    // Format Fix Status Cell
    const fixCell = row.getCell('fixStatus');
    fixCell.alignment = { vertical: 'middle', horizontal: 'center' };
    if (bug.fixStatus === 'Resolved') {
      fixCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
      fixCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF166534' } };
    } else if (bug.fixStatus === 'Confirmed Open') {
      fixCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      fixCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF991B1B' } };
    } else {
      fixCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE3C7' } };
      fixCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF92400E' } };
    }

    // Format Retest Status Cell
    const retestCell = row.getCell('retestStatus');
    retestCell.alignment = { vertical: 'middle', horizontal: 'center' };
    retestCell.font = { name: 'Arial', size: 9, bold: true };

    // Format Severity Cell
    const sevCell = row.getCell('severity');
    sevCell.alignment = { vertical: 'middle', horizontal: 'center' };
    if (bug.severity === 'HIGH') {
      sevCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEDD5' } };
      sevCell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF9A3412' } };
    } else if (bug.severity === 'MEDIUM') {
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

  console.log(`✅ Bug Tracker Excel generated successfully at:\n 1: ${xlsxOutputPath1}\n 2: ${xlsxOutputPath2}`);
}

createBugTrackerExcel().catch((err) => {
  console.error('❌ Error generating Bug Tracker Excel:', err);
  process.exit(1);
});
