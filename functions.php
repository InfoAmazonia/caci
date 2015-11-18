<?php

/*
 * Theme WP features
 */
add_theme_support('post-thumbnails');

/*
 * Scripts and styles
 */

// remove jeo frontend
function vindig_init() {
  global $jeo, $jeo_markers;
  remove_action('wp_head', array($jeo, 'scripts'), 2);
  remove_action('wp_footer', array($jeo_markers, 'enqueue_scripts'));
  remove_action('wp_enqueue_scripts', 'jeo_theme_scripts', 5);
  remove_action('wp_enqueue_scripts', 'jeo_enqueue_theme_scripts', 12);
}
add_action('jeo_init', 'vindig_init');

function vindig_scripts() {

  wp_register_script('angular', get_stylesheet_directory_uri() . '/static/angular/angular.min.js');
  wp_register_script('angular-ui-router', get_stylesheet_directory_uri() . '/static/ui-router/release/angular-ui-router.js', array('angular'));

  wp_register_script('leaflet', get_stylesheet_directory_uri() . '/static/leaflet/dist/leaflet.js');
  wp_register_style('leaflet', get_stylesheet_directory_uri() . '/static/leaflet/dist/leaflet.css');

  wp_register_script('leaflet.markerclusterer', get_stylesheet_directory_uri() . '/static/leaflet.markerclusterer/dist/leaflet.markercluster.js');
  wp_register_style('leaflet.markerclusterer', get_stylesheet_directory_uri() . '/static/leaflet.markerclusterer/dist/MarkerCluster.Default.css');

  wp_register_script('mapbox.standalone', get_stylesheet_directory_uri() . '/static/mapbox.js/mapbox.standalone.js');
  wp_register_style('mapbox.standalone', get_stylesheet_directory_uri() . '/static/mapbox.js/mapbox.standalone.css');

  wp_register_style('normalize', get_stylesheet_directory_uri() . '/static/normalize.css/normalize.css');

  wp_enqueue_script('app', get_stylesheet_directory_uri() . '/js/app.js', array('underscore', 'angular', 'angular-ui-router', 'leaflet', 'mapbox.standalone', 'leaflet.markerclusterer'));

  wp_enqueue_style('app', get_stylesheet_directory_uri() . '/css/app.css', array('normalize', 'leaflet', 'mapbox.standalone', 'leaflet.markerclusterer'));

  wp_localize_script('app', 'vindig', array(
    'base' => str_replace(site_url(), '', get_stylesheet_directory_uri()),
    'api' => get_option('permalink_structure') ? esc_url(get_json_url()) . '/' : esc_url(get_json_url())
  ));

}
add_action('wp_enqueue_scripts', 'vindig_scripts');

/*
 * Required plugins
 */
require_once(STYLESHEETPATH . '/inc/class-tgm-plugin-activation.php');

function vindig_register_required_plugins() {

  $plugins = array(
    array(
      'name' => 'JSON REST API (WP API)',
      'slug' => 'json-rest-api',
      'required' => true,
      'force_activation' => true
    )
  );

  $options = array(
    'default_path'  => '',
    'menu'      => 'vindig-install-plugins',
    'has_notices'  => true,
    'dismissable'  => true,
    'dismiss_msg'  => '',
    'is_automatic'  => false,
    'message'    => ''
  );

  tgmpa($plugins, $options);
}
add_action('tgmpa_register', 'vindig_register_required_plugins');

/*
 * Set API route
 */
function vindig_json_url_prefix() {
	return 'api';
}
add_filter('json_url_prefix', 'vindig_json_url_prefix');

add_filter('show_admin_bar', '__return_false');

require_once(STYLESHEETPATH . '/inc/dossier.php');
require_once(STYLESHEETPATH . '/inc/case.php');
