// Enable strict mode
"use strict";

// NOTE: This file is runned in the main frame's global context, so it can
//       access any ressource that has been declared in that context.

// NOTE: It's useless to wrap the bootloader's code inside an IIFE to avoid
//       polluating the global environment because ressources are defined using
//       the `let` statement, which makes them defined only in this file's
//       scope.

// Boot message
bootLine('Bootloader started.');
bootLine('Press any key to display the boot options...');

// Prepare the key listener
let bootkeyListener = () => {
  // Cancel the normal boot timer
  clearTimeout(normalBootTimer);

  // Remove the key listener
  document.body.removeEventListener('keydown', bootkeyListener);

  // Display the boot options
  // TODO: Make the boot options and the mode that are associated
  //       (e.g. repair mode)

  /** ======= PATH WHILE THE BOOT OPTIONS ARE NOT MADE ======= **/
  bootLine('WARNING: Sorry, but the boot options are not available for now.');
  bootLine('WARNING: System will now boot.');

  // Make a timer to boot normally in 3 seconds.
  setTimeout(boot, 3000);
};

// Give the focus to the boot screen
bootArea.focus();

// Attach the key listener
document.body.addEventListener('keydown', bootkeyListener);

/**
 * Boot normally
 * @returns {void}
 */
function boot () {
  // Remove the key listener
  document.body.removeEventListener('keydown', bootkeyListener);

  // Boot message
  bootLine('System is now booting...');

  // Determine which file to load
  // => If the system is not hosted, call the "Linux loader"
  //    (a script that manages Linux encryption...)
  // => Else, ignore it
  // NOTE: If the Linux loader is called, it will load the system loader after
  //       a few interactions with Linux, in all cases. It is only needed to
  //       access the system's encrypted partition and a few other things,
  //       like securing the GUI (its role is not strictly fixed for now).
  let sysloaderFile = (! hosted ? 'lxloader.js' /* Linux loader */ : 'sysloader.js');

  // Boot message
  bootLine(`Reading loader "${sysloaderFile}"...`);

  // Load the right loader's file.
  // NOTE: The loading code below is copied from the main frame's inline
  //       script.
  let loader;

  // Try to...
  try {
    // ...read the system loader's script
    loader = fs.readFileSync(path.join(__dirname /* main frame's __dirname */, 'boot', sysloaderFile), 'utf8');
  } catch (e) {
    // An error occured ; treat it
    error(`Failed to read loader's script.`, e);
  }

  // Boot message
  bootLine(`Starting the system loader...`);

  // Evaluate the script as a JavaScript code
  // The script could be runned here with eval(), but its variables,
  // functions and constants wouldn't be global.
  window.eval(loader);
}

// If the "--autoboot" flag was provided...
if (argv.includes('--autoboot'))
  // Boot message
  bootLine(`Flag "--autoboot" was specified. You won't be able to access the boot options.`);

// Make a timer to boot normally if no key has been pressed in 3 seconds.
// NOTE: The system will boot instantly if the "--autoboot" flag is enabled
// NOTE: The timer is saved in a variable to be canceled if a key is pressed
//       during the short delay.
let normalBootTimer = setTimeout(
  // No key was pressed ; boot normally
  boot,
  // No wait with "--autoboot" flag, 3 seconds else
  argv.includes('--autoboot') ? 0 : 3000
);
