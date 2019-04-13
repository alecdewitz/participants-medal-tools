<?php
/*
 * Plugin Name: Participants Database Custom Templates
 * Version: 2.3
 * Description: provides an update-safe location for custom templates
 * Author: Roland Barker, xnau webdesign
 * Plugin URI: http://xnau.com/participants-database/
 * Text Domain: pdb_custom-templates
 */
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