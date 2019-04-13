<?php
/**
 * combo multisearch list template
 * 
 * @version 2.2
 * 
 * @global \pdbcms\Plugin $PDb_Combo_Multi_Search
 *
 */
global $PDb_Combo_Multi_Search;
$PDb_Combo_Multi_Search->enable();
$combo_search = $PDb_Combo_Multi_Search->get_text_search_value();
$combo_search_label = empty( $PDb_Combo_Multi_Search->plugin_options['combo_search_label'] ) ? false : $PDb_Combo_Multi_Search->plugin_options['combo_search_label'];
$placeholder = $PDb_Combo_Multi_Search->plugin_options['placeholder'];
$search_term = $PDb_Combo_Multi_Search->current_search_term();
?>
<div class="wrap <?php echo $this->wrap_class ?> pdb-combo-multisearch" id="<?php echo $this->list_anchor ?>">
  <?php if ( $PDb_Combo_Multi_Search->combo_multi_search_is_active() ): ?>
    <?php echo $this->search_error_style ?>
    <div class="pdb-searchform">
      <div class="pdb-error pdb-search-error"  style="display:none">
        <p class="value_error"><?php echo $PDb_Combo_Multi_Search->incomplete_search_error_message(); ?></p>
      </div>
      <?php
      $this->search_sort_form_top();
      $PDb_Combo_Multi_Search->print_hidden_fields( array('subsource' => \pdbcms\Plugin::subsource) );
      ?>
      <div class="combo-multi-search-controls">
        <?php if ( $PDb_Combo_Multi_Search->combo_search_is_active() ) : ?>
          <div class="combo-search-controls search-control-group">
            <span class="search-control pdb-combo_search combo-search">
              <?php if ( $combo_search_label ) : ?>
                <label for="pdb-combo_search-control"><?php echo $combo_search_label ?></label>
              <?php endif ?>
              <input name="combo_search" id="pdb-combo_search-control" placeholder="<?php echo $placeholder ?>" value="<?php echo $combo_search ?>" type="text">
            </span>
            <?php if ( $PDb_Combo_Multi_Search->combo_search_modifiers_enabled() ) : ?>
              <span class="search-control pdb-combo_search combo-search">
                <?php $PDb_Combo_Multi_Search->print_search_options(); ?>
              </span>
            <?php endif ?>
          </div>
        <?php endif ?>
        <?php if ( $PDb_Combo_Multi_Search->multi_search_is_active() ) : ?>
          <div class="multi-search-controls search-control-group">
            <?php foreach ( $PDb_Combo_Multi_Search->search_controls as $control ) : if ( $control ) : ?>
                <span class="search-control pdb-combo_search combo-search pdb-<?php echo $control->name . ' ' . $control->wrap_class ?>">
                  <label for="<?php echo $control->id ?>"><?php echo $control->title ?></label>
                  <span class="search-control-input">
                    <?php echo $control->control ?>
                    <?php if ( !empty( $control->help_text ) ) : ?>
                      <span class="helptext"><?php echo $control->help_text ?></span>
                    <?php endif ?>
                  </span>
                </span>
              <?php endif;
            endforeach; ?>
          </div>
  <?php endif ?>
        <div class="submit-controls search-control-group">
          <span class="search-control">
            <input type="submit" class="button-primary" name="multisearch-submit" data-submit="search" value="<?php echo $PDb_Combo_Multi_Search->i18n['search'] ?>" />
            <input type="submit" class="button-secondary" name="multisearch-submit" data-submit="clear" value="<?php echo $PDb_Combo_Multi_Search->i18n['clear'] ?>" />
          </span>
        </div>
      </div>
  <?php if ( $filter_mode == 'sort' || $filter_mode == 'both' ) : ?>

        <fieldset class="widefat">
          <legend><?php _e( 'Sort by', 'participants-database' ) ?>:</legend>

          <?php
          /*
           * this function sets the fields in the sorting dropdown. It has two options:
           *    1. columns: an array of field names to show in the sorting dropdown. If 
           *       'false' shows default list of sortable fields as defined
           *    2. sorting: you can choose to sort the list by 'column' (the order they 
           *       appear in the table), 'alpha' (alphabetical order), or 'order' which 
           *       uses the defined group/field order
           */
          $this->set_sortables( false, 'column' );
          ?>

    <?php $this->sort_form() ?>

        </fieldset>
  <?php endif ?>
      </form>
    </div>
    <?php endif ?>
  <table class="wp-list-table widefat fixed pages list-container" cellspacing="0" >
    <?php if ( empty( $search_term ) && $PDb_Combo_Multi_Search->is_search_result() ) : ?>
      <caption><?php printf( __( 'Found %d records', 'pdb-combo-multisearch' ), $record_count ) ?></caption>
    <?php elseif ( !empty( $search_term ) ) : ?>
      <caption><?php printf( _n( 'Found %d result while searching for %s.', 'Found %d results while searching for %s.', $record_count, 'pdb-combo-multisearch' ), $record_count, '<strong>' . $search_term . '</strong>' ) ?></caption>
    <?php else: ?>
      <?php $this->print_list_count( '<caption class="%s" ><span class="list-display-count">' ) ?>
    <?php endif ?>
<?php if ( $record_count > 0 ) : // print only if there are records to show  ?>

      <thead>
        <tr>
          <?php
          /*
           * this function prints headers for all the fields
           * replacement codes:
           * %2$s is the form element type identifier
           * %1$s is the title of the field
           */
          $this->print_header_row( '<th class="%2$s" scope="col">%1$s</th>' );
          ?>
        </tr>
      </thead>

      <tbody>
          <?php while ( $this->have_records() ) : $this->the_record(); // each record is one row ?>
<?php $record = new PDb_Template($this); ?>
		  <tr>
              <?php while ( $this->have_fields() ) : $this->the_field(); // each field is one cell  ?>

              <td class="<?php echo $this->field->name ?>-field">
              <?php
	                $this->field->link = $record->get_edit_link();
					$this->field->print_value(); ?> 
              </td>

          <?php endwhile; // each field ?>
          </tr>
      <?php endwhile; // each record  ?>
      </tbody>

<?php else : // if there are no records  ?>

      <tbody>
        <tr>
          <td><?php if ( $PDb_Combo_Multi_Search->is_multisearch === true ) echo Participants_Db::$plugin_options['no_records_message'] ?></td>
        </tr>
      </tbody>

  <?php endif; // $record_count > 0  ?>

  </table>
  <?php
  /*
   * this shortcut function presents a pagination control with default layout
   */
  $this->show_pagination_control();
  ?>
</div>