=== Participants Database Medal Tools ===
Requires at least: 4.4
Tested up to: 5.1.1
Stable tag: 5.1.1
Requires PHP: 5.2.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Participants Medal Tools is a simple plugin to quickly execute any type of SQL query into the WordPress's DB and export the results in a CSV format file.

== Description ==

This plugin will allow you to setup and reset the Medal Loyalty Database.

It also gives you the ability to export the results in a CSV format file.

In order to access this plugin's admin page (Tools -> participants-medal-tools), your account needs to have the `install_plugins` capability, that means a Super Admin in the multi-site installation or an Admin in a single site.

Feel free to contribute:
https://github.com/alecdewitz/participants-medal-tools

== Installation ==

1. Upload the plugin folder `participants-medal-tools` to the `/wp-content/plugins/` directory or by using the "Add Plugin" function of WordPress.
2. Activate the plugin `Participants Medal Tools` through the 'Plugins' menu in WordPress
3. The plugin page can be accessed via the 'Participants Medal Tools' link under 'Tools' menu in the administration area of a site (if your role is Admin for site administration role for single-site installs, or Super Admin for network installs).

== Frequently Asked Questions ==

= Where is the plugin page to run the queries? =

The plugin page can be accessed via the 'Participants Medal Tools' link under 'Tools' menu in the administration area of a site (if your role is Admin for site administration role for single-site installs, or Super Admin for network installs).

= Can a query make unrecoverable changes in the database? =
Yes, and this plugin doesn't provide and a way to undo the changes. Under no circumstances will the Author of this plugin assume responsibility or liability for any damages or destructive effects on the database resulting from the queries executed using this tool.

== Changelog ==

= 1.0.4 =
* Remove unnecessary files, fix issue with table

= 1.0.2 =
* Remove unnecessary files

= 1.0.1 =
* Added auto update capability

= 1.0.0 =
* Initial version

== Upgrade Notice ==

= 1.0.1 =
Adds auto update capability

= 1.0 =
Initial version