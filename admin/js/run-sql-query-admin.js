(function($) {
  'use strict';

  function cleanText(text) {
    text = text.replace(/"/g, '""');
    return '"' + text + '"';
  }

  function tableToCSV($table) {
    var header = [];
    var rows = [];

    $table.find('tr').each(function() {
      var data = [];
      $(this)
        .find('th')
        .each(function() {
          var text = cleanText($(this).text());
          header.push(text);
        });
      $(this)
        .find('td')
        .each(function() {
          var text = cleanText($(this).text());
          data.push(text);
        });
      data = data.join(',');
      rows.push(data);
    });
    header = header.join(',');
    rows = rows.join('\n');

    var csv = header + rows;
    var ts = new Date().getTime();
    saveFile(
      'query_results_' + ts + '.csv',
      csv,
      'application/csv;charset=utf-8'
    );
  }

  function saveFile(fileName, data, type) {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      try {
        var isFileSaverSupported = !!new Blob();
        if (isFileSaverSupported) {
          var dataBlob = new Blob([data], {
            type: type
          });
          window.navigator.msSaveBlob(dataBlob, fileName);
        }
      } catch (e) {
        console.log('No blobs supported!');
      }
    } else {
      var downloadLink = document.createElement('a');
      downloadLink.style.display = 'none';
      downloadLink.href = 'data:' + type + ',' + encodeURIComponent(data);
      downloadLink.download = fileName;
      downloadLink.onclick = function(e) {
        document.body.removeChild(e.target);
      };
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  }

  function check_sql_query() {
    if (
      $('#query')
        .val()
        .match(
          /\s*(alter|create|drop|rename|insert|delete|update|replace|truncate) /i
        )
    ) {
      return confirm(
        'No UNDO is available for data modification. Do you want to continue?'
      );
    } else {
      return true;
    }
  }

  function run_sql_query() {
    $('#error').hide();
    $('#results').hide();
    $('#export_button').hide();
    $('#status').show();
    $('#loading_gif').show();
    $('#status_detail').html('Running...');

    var query = $('#query')
      .val()
      .replace(/(\r\n|\n|\r)/gm, ' ');

    var data = {
      action: 'run_sql_query',
      security: $('#_wpnonce').val(),
      query: query
    };

    $.post(ajaxurl, data, function(response) {
      if (response.success) {
        $('#raw_query').html(query);
        if (typeof response.data.affected_rows !== 'undefined') {
          $('#results_detail').html(
            response.data.affected_rows + ' row(s) affected'
          );
          $('#results').show();
        } else {
          if (response.data.rows == 0) {
            $('#results_detail').html('No results');
          } else {
            $('#results_detail').html('');
            $.jsontotable(response.data.rows, {
              id: '#results_detail',
              header: true
            });
            $('#export_button').show();
          }
          $('#results').show();
        }
      } else {
        $('#error').show();
        $('#error_detail').html(response.data.error);
      }
    }).always(function() {
      $('#loading_gif').hide();
      $('#status_detail').html('Completed');
    });
  }

  function clearParticipants() {
    $('#query').val('DELETE FROM ' + $('#participants_database').val());
    var resetConfirm = confirm(
      'Are you sure you want to delete all participants from the database?'
    );
    if (resetConfirm && check_sql_query()) {
      run_sql_query();
    }
  }

  function resetDatabase() {
    var resetConfirm = confirm(
      'Are you sure you want to reset the participants database and go back to standard settings?'
    );

    if (
      resetConfirm &&
      $('#participants_database_fields').val() &&
      $('#participants_database').val() &&
      $('#options_db').val()
    ) {
      // drop table
      $('#query').val(
        'DROP TABLE IF EXISTS `' +
          $('#participants_database_fields').val() +
          '`'
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // create table
      $('#query').val(
        'CREATE TABLE `' +
          $('#participants_database_fields').val() +
          "` (`id` int(3) NOT NULL AUTO_INCREMENT,`order` int(3) NOT NULL DEFAULT '0',`name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,`title` tinytext COLLATE utf8_unicode_ci NOT NULL,`default` tinytext COLLATE utf8_unicode_ci,`group` varchar(64) COLLATE utf8_unicode_ci NOT NULL,`form_element` tinytext COLLATE utf8_unicode_ci,`options` longtext COLLATE utf8_unicode_ci,`attributes` text COLLATE utf8_unicode_ci,`validation` tinytext COLLATE utf8_unicode_ci,`validation_message` text COLLATE utf8_unicode_ci,`help_text` text COLLATE utf8_unicode_ci,`display_column` int(3) DEFAULT '0',`admin_column` int(3) DEFAULT '0',`sortable` tinyint(1) DEFAULT '0',`CSV` tinyint(1) DEFAULT '0',`persistent` tinyint(1) DEFAULT '0',`signup` tinyint(1) DEFAULT '0',`readonly` tinyint(1) DEFAULT '0', PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // insert into table
      $('#query').val(
        'INSERT INTO `' +
          $('#participants_database_fields').val() +
          "` (`id`, `order`, `name`, `title`, `default`, `group`, `form_element`, `options`, `attributes`, `validation`, `validation_message`, `help_text`, `display_column`, `admin_column`, `sortable`, `CSV`, `persistent`, `signup`, `readonly`) VALUES(1, 1005, 'FIRST_NAME', 'First Name', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'yes', '', '', 3, 1, 1, 1, 0, 0, 0),(2, 1006, 'LAST_NAME', 'Last Name', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'yes', '', '', 4, 2, 1, 1, 0, 0, 0),(4, 1009, 'CITY', 'City', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'no', '', '', 0, 0, 1, 1, 1, 0, 0),(5, 1010, 'REGION_NAME', 'Region', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'no', '', '', 0, 0, 1, 1, 1, 0, 0),(6, 1011, 'COUNTRY_NAME', 'Country', NULL, 'main', 'text-line', NULL, NULL, 'no', NULL, NULL, 0, 0, 1, 1, 1, 0, 0),(9, 1012, 'EMAIL', 'Email', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'email-regex', '', '', 0, 3, 0, 1, 0, 0, 0),(15, 14, 'id', 'Record ID', '', '', '', 'a:0:{}', 'a:0:{}', '', '', '', 0, 0, 0, 0, 0, 0, 0),(16, 15, 'private_id', 'Private ID', 'RPNE2', 'internal', 'text', NULL, NULL, 'no', NULL, NULL, 0, 4, 0, 0, 0, 1, 1),(17, 16, 'date_recorded', 'Date Recorded', NULL, 'internal', 'timestamp', NULL, NULL, 'no', NULL, NULL, 0, 5, 1, 0, 0, 0, 1),(18, 17, 'date_updated', 'Date Updated', NULL, 'internal', 'timestamp', NULL, NULL, 'no', NULL, NULL, 0, 0, 1, 0, 0, 0, 1),(19, 18, 'last_accessed', 'Last Accessed', NULL, 'internal', 'timestamp', NULL, NULL, 'no', NULL, NULL, 0, 0, 1, 0, 0, 0, 1),(20, 1000, 'RACE', 'Race', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'yes', '', '', 1, 0, 0, 1, 0, 0, 0),(21, 1003, 'REG_CHOICE', 'Registration Choice', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'yes', '', '', 2, 0, 0, 1, 0, 0, 0),(22, 1007, 'GENDER', 'Gender', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'no', '', '', 0, 0, 0, 1, 0, 0, 0),(23, 1008, 'DOB', 'Date of Birth', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'no', '', '', 5, 0, 0, 1, 0, 0, 0),(24, 1004, 'RACE_NAME', 'Race Name', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'yes', '', '', 0, 0, 0, 0, 0, 0, 0),(25, 1002, 'EXTERNAL_ID', 'External ID', NULL, 'main', 'text-line', NULL, NULL, 'no', NULL, NULL, 0, 0, 0, 0, 0, 0, 0),(26, 1001, 'CHRONO_ID', 'Chrono ID', '', 'main', 'text-line', 'a:0:{}', 'a:0:{}', 'yes', '', '', 0, 0, 0, 0, 0, 0, 0);"
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // alter table
      $('#query').val(
        'ALTER TABLE `' +
          $('#participants_database_fields').val() +
          '` ADD UNIQUE KEY `name` (`name`),ADD KEY `order` (`order`),ADD KEY `group` (`group`);'
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // create table
      $('#query').val(
        'DROP TABLE IF EXISTS ' + $('#participants_database').val() + ';'
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // create table
      $('#query').val(
        'CREATE TABLE ' +
          $('#participants_database').val() +
          ' (id int(6) NOT NULL AUTO_INCREMENT,private_id varchar(9) COLLATE utf8_unicode_ci DEFAULT NULL,FIRST_NAME tinytext COLLATE utf8_unicode_ci,LAST_NAME tinytext COLLATE utf8_unicode_ci,CITY tinytext COLLATE utf8_unicode_ci,REGION_NAME tinytext COLLATE utf8_unicode_ci,COUNTRY_NAME tinytext COLLATE utf8_unicode_ci,EMAIL tinytext COLLATE utf8_unicode_ci,date_recorded timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,date_updated timestamp NULL DEFAULT NULL,last_accessed timestamp NULL DEFAULT NULL,RACE tinytext COLLATE utf8_unicode_ci,REG_CHOICE tinytext COLLATE utf8_unicode_ci,GENDER tinytext COLLATE utf8_unicode_ci,DOB tinytext COLLATE utf8_unicode_ci,RACE_NAME tinytext COLLATE utf8_unicode_ci,EXTERNAL_ID tinytext COLLATE utf8_unicode_ci,          CHRONO_ID tinytext COLLATE utf8_unicode_ci, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;'
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // update options
      $('#query').val(
        'UPDATE ' +
          $('#options_db').val() +
          ' SET option_value=\'a:4:{s:19:"delimiter_character";s:4:"auto";s:19:"enclosure_character";s:4:"auto";s:11:"match_field";s:11:"EXTERNAL_ID";s:16:"match_preference";s:1:"1";}\' WHERE option_name="pdb-csv_import_params"'
      );
      if (check_sql_query()) {
        run_sql_query();
      }

      // update options
      $('#query').val(
        'UPDATE ' +
          $('#options_db').val() +
          ' SET option_value=\'a:22:{s:11:"filter_mode";s:1:"1";s:19:"restore_last_search";s:1:"0";s:16:"combo_field_list";s:0:"";s:18:"combo_search_label";s:0:"";s:11:"placeholder";s:9:"Search…";s:22:"combo_search_modifiers";s:1:"1";s:29:"default_combo_search_modifier";s:3:"any";s:12:"autocomplete";s:1:"0";s:31:"combo_field_autocomplete_fields";s:0:"";s:18:"alpha_autocomplete";s:1:"1";s:15:"search_on_click";s:1:"1";s:22:"combo_whole_word_match";s:1:"1";s:10:"field_list";s:20:"FIRST_NAME,LAST_NAME";s:10:"field_help";s:0:"";s:13:"use_db_values";s:1:"0";s:10:"alpha_sort";s:1:"1";s:10:"any_option";s:1:"0";s:16:"any_option_title";s:0:"";s:16:"text_as_dropdown";s:1:"0";s:22:"multi_whole_word_match";s:1:"1";s:18:"multi_all_required";s:1:"1";s:17:"use_ranged_search";s:1:"1";}\' WHERE option_name ="pdbcms_settings"'
      );
      if (check_sql_query()) {
        run_sql_query();
      }
    } else {
      alert('there was an error');
    }
  }

  $(function() {
    $('#query').val(
      'SELECT FIRST_NAME, LAST_NAME, EMAIL, Count(*) AS CNT FROM ' +
        $('#participants_database').val() +
        ' GROUP BY FIRST_NAME, LAST_NAME HAVING COUNT(*) > 1 '
    );
    run_sql_query();

    $('#quantity').on('change', function() {
      if (!$('#quantity').val()) {
        $('#query').val(
          'SELECT FIRST_NAME, LAST_NAME, EMAIL, Count(*) AS CNT FROM ' +
            $('#participants_database').val() +
            ' GROUP BY FIRST_NAME, LAST_NAME HAVING COUNT(*) > 1'
        );
      } else {
        $('#query').val(
          'SELECT FIRST_NAME, LAST_NAME, EMAIL, Count(*) AS CNT FROM ' +
            $('#participants_database').val() +
            ' GROUP BY FIRST_NAME, LAST_NAME HAVING COUNT(*) = ' +
            $('#quantity').val()
        );
      }
      run_sql_query();
    });

    $('#run_query_button').on('click', function() {
      if (check_sql_query()) {
        run_sql_query();
      }
    });

    $('#reset_participants_button').on('click', function() {
      clearParticipants();
      $('#query').val(
        'SELECT FIRST_NAME, LAST_NAME, EMAIL, Count(*) AS CNT FROM ' +
          $('#participants_database').val() +
          ' GROUP BY FIRST_NAME, LAST_NAME HAVING COUNT(*) > 1 '
      );
    });

    $('#reset_database_button').on('click', function() {
      clearParticipants();

      resetDatabase();

      $('#query').val(
        'SELECT FIRST_NAME, LAST_NAME, EMAIL, Count(*) AS CNT FROM ' +
          $('#participants_database').val() +
          ' GROUP BY FIRST_NAME, LAST_NAME HAVING COUNT(*) > 1 '
      );
    });

    $('#export_button').on('click', function(event) {
      tableToCSV($('#results_detail table'));
    });
  });
})(jQuery);
