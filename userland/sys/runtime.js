// Enable strict mode
"use strict";

// Boot message
bootLine('Launching desktop environment...');

/* Open the registry to get the desktop environment's (DE's) application name */

// Save the registry's path in the memory
let regPath = path.join(__dirname /* Main frame's CWD */, '..', 'etc', 'registry');

// Check if the registry is available
if (! fs.existsSync(regPath) || ! fs.lstatSync(regPath).isFile())
  // Throw an error
  error('Registry file is missing');

// Load the registry
let registry;

// Try to...
try {
  // Read the registry
  registry = fs.readFileSync(regPath, 'utf8');
} catch (e) {
  // An error occured ; treat it
  error('Failed to read registry file', e);
}

// Try to...
try {
  // Parse the registry
  registry = JSON.parse(registry);
} catch (e) {
  // An error occured ; treat it
  error('Registry is not a valid JSON string', e);
}

// Get the DE's name in the registry
// NOTE: The registry's path (launcher/target) won't change (frozen).
let denv = (registry['launcher<folder>'] || {})['target<app>'];

// If no DE was found...
if (! denv)
  // Throw an error
  error('No desktop environment specified. Please rewrite /etc/registry to choose one.');
