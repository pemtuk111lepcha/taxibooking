const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs.txt');
const REPORT_FILE = path.join(__dirname, 'log_report_last_7_days.txt');

function getLast7DaysLogs(logs) {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.getTime() >= sevenDaysAgo;
    });
}

function generateReport(logs) {
    let report = `Log Report (Last 7 Days)\nGenerated: ${new Date().toISOString()}\n\n`;
    report += `Total log entries: ${logs.length}\n\n`;
    logs.forEach(log => {
        report += `[${log.timestamp}] ${log.level}: ${log.message}\n`;
    });
    return report;
}

function main() {
    if (!fs.existsSync(LOG_FILE)) {
        console.error('Log file not found.');
        return;
    }
    const rawLogs = fs.readFileSync(LOG_FILE, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    const recentLogs = getLast7DaysLogs(rawLogs);
    const report = generateReport(recentLogs);
    fs.writeFileSync(REPORT_FILE, report, 'utf-8');
    console.log(`Report generated: ${REPORT_FILE}`);
}

main();
