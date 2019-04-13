<?php

/**
 * Plugin Name:       Participants Medal Setup
 * Plugin URI:        https://github.com/alecdewitz/participants-medal-tools
 * Description:       Setup Lifetime, to operate use the plugin page under Tools &gt; <a href="tools.php?page=run-sql-query">Participants Medal Tools</a>.
 * Version:           1.0.67
 * Author:            Alec Dewitz
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       participants-medal-tools
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

require 'plugin-update-checker/plugin-update-checker.php';
$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
	'https://github.com/alecdewitz/participants-medal-tools/',
	__FILE__,
	'participants-medal-tools'
);
$myUpdateChecker->setAuthentication('3be42bd898d3cb1418f2614eb953be3a0114321e');
$myUpdateChecker->setBranch('master');
add_filter( 'auto_update_plugin', '__return_true' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-run-sql-query.php';

if ( class_exists( 'Participants_Db') ) {
	pdb_custom_templates_initialize ();
  } else {
	add_action( 'participants-database_activated', 'pdb_custom_templates_initialize');
  }
  function pdb_custom_templates_initialize () {
	global $PDb_Custom_Templates;
	if (!is_object(@$PDb_Custom_Templates) && version_compare(Participants_Db::$plugin_version, '1.7.5', '>')) {
	  require_once plugin_dir_path(__FILE__) . 'PDb_Custom_Templates.php';
	  $PDb_Custom_Templates = new PDb_Custom_Templates(__FILE__);
	}
  }








/**
 * Begins execution of the plugin.
 *
 * @since    1.0.0
 */
function run_sql_query() {

	$plugin = new Run_SQL_Query();
	$plugin->run();

}

// include dirname(__FILE__) . 'pdb-custom-templates.php';


run_sql_query();
