<?php

/**
 * Provides a admin area view for the plugin
 *
 * @since      1.0.0
 *
 * @package    Run_SQL_Query
 * @subpackage Run_SQL_Query/admin/partials
 */

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}
?>

<div class="wrap">
	<h1>Run SQL Query</h1>
	<?php wp_nonce_field( 'run_sql_query' ); ?>
	<?php
		$output ="";
		foreach ( $this->tables as $table ) {
			if (endsWith($table, 'participants_database')) {
			$output .= "<input type='hidden' id='participants_database' name='participants_database' value='".esc_attr( $table )."'>";
			} 
			if (endsWith($table, 'participants_database_fields')) {
			$output .= "<input type='hidden' id='participants_database_fields' name='participants_database_fields' value='".esc_attr( $table )."'>";
			}
			if (endsWith($table, 'options')) {
			$output .= "<input type='hidden' id='options_db' name='options_db' value='".esc_attr( $table )."'>";
			}
		}
		print $output;
	?>
	<p>
	<label># of Races: </label>
	<select name="quantity" id="quantity">
	<?php
		$output = '<option></option>';
		for ($x = 1; $x <= 7; $x++) {
			$output .= '<option value="'.esc_attr( $x ).'">'.esc_attr($x).'</option>';
		}
		print $output;
	?>
	</select>

	</p>
	<label>Query</label>
	<div class="form-field">
		<textarea readonly id="query" rows="3" cols="60"></textarea>
	</div>
	<p>
		<input type="button" id="run_query_button" class="button button-primary" value="Run Query" />
		<input type="button" id="reset_participants_button" class="button button-danger button-link-delete" value="Delete All Participants" />
		<input type="button" id="reset_database_button" class="button button-danger button-link-delete" value="Reset Database" />
	</p>
	
	<div id="status" style="display:none">
		<h3>Status</h3>
		<span id="status_detail"></span>
		<img id="loading_gif" src="./images/loading.gif">
	</div>

	<div id="error" style="display:none">
		<h3>Error</h3>
		<div id="error_detail"></div>
	</div>

	<div id="results" style="display:none">
		<h3>Results</h3>
		<strong>Query: </strong><em id="raw_query"></em>
		<p>
			<input type="button" id="export_button" class="button button-primary" value="Export to CSV" style="display:none" />
		</p>
		<div id="results_detail"></div>
	</div>
	
</div>
