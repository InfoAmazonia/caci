<?php

/*
 * VINDIG Case
 */

class Vindig_Case {

  function __construct() {
    add_action('init', array($this, 'register_post_type'));
    // add_action('init', array($this, 'geocode'));
    add_filter('json_prepare_post', array($this, 'json_prepare_post'), 10, 3);
  }

  function register_post_type() {

    $labels = array(
      'name' => __('Casos', 'vindig'),
      'singular_name' => __('Caso', 'vindig'),
      'add_new' => __('Adicionar caso', 'vindig'),
      'add_new_item' => __('Adicionar novo caso', 'vindig'),
      'edit_item' => __('Editar caso', 'vindig'),
      'new_item' => __('Novo caso', 'vindig'),
      'view_item' => __('Ver caso', 'vindig'),
      'search_items' => __('Buscar caso', 'vindig'),
      'not_found' => __('Nenhum caso encontrado', 'vindig'),
      'not_found_in_trash' => __('Nenhum caso encontrado no lixo', 'vindig'),
      'menu_name' => __('Casos', 'vindig')
    );

    $args = array(
      'labels' => $labels,
      'hierarchical' => false,
      'description' => __('Casos', 'vindig'),
      'supports' => array('title', 'revisions', 'custom-fields'),
      'public' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => true,
      'menu_position' => 4,
      'rewrite' => false,
    );

    register_post_type('case', $args);

  }

  function json_prepare_post($_post, $post, $context) {
    if($post['post_type'] == 'case') {

      $_post['nome'] = get_post_meta($post['ID'], 'nome', true);
      $_post['apelido'] = get_post_meta($post['ID'], 'apelido', true);
      $_post['idade'] = get_post_meta($post['ID'], 'idade', true);
      $_post['descricao'] = get_post_meta($post['ID'], 'descricao', true);
      $_post['povo'] = get_post_meta($post['ID'], 'povo', true);
      $_post['aldeia'] = get_post_meta($post['ID'], 'aldeia', true);
      $_post['dia'] = get_post_meta($post['ID'], 'dia', true);
      $_post['mes'] = get_post_meta($post['ID'], 'mes', true);
      $_post['ano'] = get_post_meta($post['ID'], 'ano', true);
      $_post['cod_ibge'] = get_post_meta($post['ID'], 'cod_ibge', true);
      $_post['municipio'] = get_post_meta($post['ID'], 'municipio', true);
      $_post['uf'] = get_post_meta($post['ID'], 'uf', true);
      $_post['relatorio'] = get_post_meta($post['ID'], 'relatorio', true);
      $_post['cod_funai'] = get_post_meta($post['ID'], 'cod_funai', true);
      $_post['terra_indigena'] = get_post_meta($post['ID'], 'terra_indigena', true);
      $_post['fonte_cimi'] = get_post_meta($post['ID'], 'fonte_cimi', true);

    }
    return $_post;
  }


  function geocode() {

    global $post;

    if(isset($_GET['geocode_cases'])) {

      $tis = json_decode(file_get_contents(STYLESHEETPATH . '/data/tis.json'), true);
      $municipios = json_decode(file_get_contents(STYLESHEETPATH . '/data/municipios.json'), true);

      $query = new WP_Query(array(
        'post_type' => 'case',
        'posts_per_page' => -1
      ));

      if($query->have_posts()) {
        while($query->have_posts()) {
          $geocoded = false;
          $method = 'none';
          $query->the_post();
          $funai = get_post_meta($post->ID, 'cod_funai', true);
          $ibge = get_post_meta($post->ID, 'cod_ibge', true);
          if($funai) {
              $method = 'ti';
            foreach($tis['rows'] as $ti) {
              if($ti['terrai_cod'] == $funai) {
                update_post_meta($post->ID, 'geocode_latitude', $ti['lat']);
                update_post_meta($post->ID, 'geocode_longitude', $ti['lon']);
                $geocoded = true;
              }
            }
          } elseif($ibge) {
            $method = 'mun';
            foreach($municipios['rows'] as $mun) {
              if(intval($mun['co_ibge3']) == intval(substr($ibge, 0, -1))) {
                update_post_meta($post->ID, 'geocode_latitude', $mun['lat']);
                update_post_meta($post->ID, 'geocode_longitude', $mun['lon']);
                $geocoded = true;
              }
            }
          }
          if(!$geocoded)
            error_log('Could not geocode ' . $post->ID . ' through method "' . $method . '"');
          wp_reset_postdata();
        }
      }

      error_log('done');

    }

  }

}

new Vindig_Case();
