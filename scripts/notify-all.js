// Dry-run recipient selector for the /notify-all workflow.
// No email is actually sent yet — this only prints who *would* receive the
// enquiry-form link, so the filtering logic can be reviewed before any real
// send credentials are wired in.

const fs = require('fs');
const path = require('path');

const segment = process.env.SEGMENT || 'all';
const since = process.env.SINCE || '';
const siteUrl = 'https://ongkianhan.github.io/claude-code-jul-25-2026/#contact';

const subscribers = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'subscribers.json'), 'utf8')
);

const matches = subscribers.filter(function (s) {
  if (segment !== 'all' && s.segment !== segment) return false;
  if (since && s.subscribedAt < since) return false;
  return true;
});

console.log('DRY RUN — no email is actually sent (no send credentials configured).');
console.log('Filters: segment=' + segment + (since ? ', since=' + since : ''));
console.log('Link that would be shared: ' + siteUrl);
console.log('Matched ' + matches.length + ' of ' + subscribers.length + ' subscriber(s):');
matches.forEach(function (s) {
  console.log('  - ' + s.name + ' <' + s.email + '> [' + s.segment + ', subscribed ' + s.subscribedAt + ']');
});
