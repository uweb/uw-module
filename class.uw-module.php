<?php
/**!
 * Plugin Name: UW Modules
 * Plugin URI: http://uw.edu/brand/web/
 * Description: Put a module template on your page. 
 * Version: 1.0
 * Author: UW Web Team
 */

class UW_Module
{

  const POST_TYPE        = 'module';
  const POST_TYPE_NAME   = 'Module';
  const POST_TYPE_PLURAL = 'Modules';
  const META_BOX_TITLE   = 'Modules';
  const MODULE_WHITE     = '<div class="module white-module module-%s"><div class="mod-text">%s</div></div>';
  const MODULE_FULL      = '<div class="module full-module module-%s" style="background-image: url(%s);"><img src="%s" style="visibility:hidden"/><div id="full-module-head" class="container"><h1 class="uw-site-title">%s</h1><span class="udub-slant"><span></span></span><div id="full-module-blurb">%s</div></div></div>';
  const MODULE_BASIC     = '<div class="module basic-module module-%s" style="background-image: url(%s);"><div id="basic-mod-container" class="container"><div class="mod-text"><h2>%s</h2><p>%s</p></div></div></div>';
  const MODULE_THIN      = '<div class="module thin-module module-%s"><div class="mod-text">%s</div></div>';
  const MODULE_GIVE      = '<div class="module give-module module-%s"><div class="giving-frame">[iframe src="https://online.gifts.washington.edu/secure/?%sframe_buster=false" height="743"]</div><div class="giving-mod-how-to"><h3>How to use</h3><p><ul><li class="p1"><span class="s2">Not sure where to give? Check out the <b>Greatest Needs </b>tab and support the areas that need you most.</span></li><li class="p1"><span class="s2">Looking for a particular fund in a college, school, or department? In the <b>Search</b> bar, type in any key word and click <b>Go!</b></span></li><li class="p1"><span class="s2">Renewing your gift? Amazing! Log in to see your <b>Gift History </b>and support your favorites.</span></li><li class="p1"><span class="s2">Having trouble? Contact us at <a href="mailto:give2uw@uw.edu"><span class="s3">give2uw@uw.edu</span></a> or at 1-800-326-7566 or 206-685-1980. We are here to help!</span></li></ul></p></div></div>';

  function __construct()
  {
    add_action( 'init', array( $this, 'register_module_post_type' ) );
    add_action( 'admin_enqueue_scripts', array( $this, 'register_module_assets' ) );
    add_action( 'wp_ajax_get_current_uw_module', array( $this, 'get_current_uw_module') );
    add_action( 'save_post_' . self::POST_TYPE , array( $this, 'save_module') );

    add_filter( 'manage_'. self::POST_TYPE .'_posts_columns', array( $this, 'add_shortcode_column' ) );
    add_action( 'manage_posts_custom_column' , array( $this, 'add_shortcode_column_content' ) , 10, 2 );

    add_shortcode( 'module', array( $this, 'shortcode') );
  }

  function register_module_post_type()
  {

    $labels = array(
      'name' => self::POST_TYPE_PLURAL,
      'singular_name' => self::POST_TYPE_NAME,
      'add_new_item' => 'Add New '. self::POST_TYPE_NAME
    );

    register_post_type( self::POST_TYPE,
      array(
        'labels' => $labels,
        'public' => false,
        'show_ui' => true,
        'has_archive' => false,
        'menu_position' => 5,
        'show_in_nav_menus' => true,
        'register_meta_box_cb' => array( $this, 'add_module_meta_box' ),
        'supports' => array( 'title' ),
      )
    );

  }

  function add_module_meta_box()
  {
    add_meta_box(
      self::POST_TYPE,
      self::META_BOX_TITLE,
      array( $this, 'add_module_meta_box_html'),
      self::POST_TYPE
    );

  }

  function add_module_meta_box_html()
  {
	    wp_nonce_field( self::POST_TYPE . '_meta_box', self::POST_TYPE . '_meta_box_nonce' );
    ?>
    <ul>
    </ul>
      <p>
        <select id="mod-select">
          <option value="white">Basic white</option>
          <option value="full">Full-page image</option>
          <option value="basic">Basic Image</option>
          <!-- <option value="thin">Thinstrip</option> -->
          <option value="give">Giving</option>
        </select>
        <a id="add-new-module" class="button-primary" href="#">Add a New Module</a> 
      </p>

    <?php

  }

  function save_module( $post_id ) {
    if ( ! empty( $_POST ) && ! check_admin_referer( self::POST_TYPE . '_meta_box', self::POST_TYPE . '_meta_box_nonce' ) ) {
        return $post_id;
    }

    if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE )
        return $post_id;

    if ( ! empty( $_POST ) && check_admin_referer( self::POST_TYPE . '_meta_box', self::POST_TYPE . '_meta_box_nonce' ) && self::POST_TYPE == $_POST['post_type'] ) {
        if ( !current_user_can( 'edit_page', $post_id ) )
            return $post_id;

    } else {
            if ( !current_user_can( 'edit_post', $post_id ) )
                return $post_id;
    }

    if ( isset( $_POST['modules'] ) ) {
        update_post_meta( $post_id, 'modules', $_POST['modules'] );
    }
  }

  function register_module_assets()
  {
    wp_enqueue_script( self::POST_TYPE, plugins_url( 'js/admin.uw-module.dev.js', __FILE__ ), array('backbone', 'jquery-ui-sortable') );
    wp_enqueue_style( self::POST_TYPE, plugins_url( 'css/admin.uw-module.css', __FILE__ ) );
    wp_enqueue_media();
  }

  function add_shortcode_column( $columns )
  {
    return array_merge( array_slice( $columns, 0, 2 ), array('module-shortcode'=>'Module Shortcode'), array_slice( $columns, 2, null ));
  }

  function add_shortcode_column_content( $column, $post_id )
  {
    if ( $column == 'module-shortcode' ) echo '[module id='. $post_id .']';
  }

  function shortcode( $atts )
  {

    $atts = (object) shortcode_atts( array(
       'id' => null,
    ), $atts);

    if ( ! $atts->id ) return;

    ?> <script>$( "#main_content" ).empty();</script> <?php

    $modules = (object) get_post_meta( $atts->id, 'modules', true );

    $modulereturn = '<div class="uw-module' . ' module-template-' . $atts->id . '">';

    foreach ($modules as $module )
    {
      $module = (object) $module;
      $modulereturn .= $this->get_module($module);
    }

    wp_register_style( 'module-styles',  plugin_dir_url( __FILE__ ) . 'css/uw-module.css' );
    wp_enqueue_style( 'module-styles' );

    return $modulereturn . '</div>' . '<script>' .
      'var mods = $( "#main_content" ).html();' .
      '$( "div.uw-hero-image" ).remove();' . 
      '$( "div.uw-body" ).html(mods);' . 
      '$( "div.uw-body" ).addClass("uw-module-body").removeClass("uw-body container");' .
    '</script>'; 
  }

  function get_current_uw_module()
  {

    $modules = get_post_meta( $_GET['id'], 'modules', true );

    $modules = $modules ? $modules : array();

    foreach ($modules as $mod )
    {
      $module[] = $mod;
    }

    wp_die( json_encode( $module ) );

  }

  // Helper functions
  static public function get_latest_module()
  {
    $posts = get_posts( array(
      'post_type'   => self::POST_TYPE,
      'numberposts' => 1
    ) );

    $module = array_shift( $posts );

    $modules = get_post_meta( $module->ID, 'modules', true );

    return $modules ? json_decode( json_encode( array_reverse( $modules ) ) ) : array();

  }

  function get_module( $module ) {
    switch ($module->template) {
      case "white":
        return sprintf(self::MODULE_WHITE, $module->id, do_shortcode($module->text));
        break;
      case "full":
        return sprintf(self::MODULE_FULL, $module->id, $module->image, $module->image, $module->title, do_shortcode($module->text));
        break;
      case "basic":
        $return = sprintf(self::MODULE_BASIC, $module->id, $module->image, $module->title, do_shortcode($module->text));
        if (!empty($module->link)){
          $return .= "<script> $('div.module-" . $module->id . "').attr('onclick','location.href=\'" . $module->link . "\''); $('div.module-" . $module->id . "').attr('tabIndex', '0');</script>";
        }
        return $return;
        break;
      case "thin":
        return sprintf(self::MODULE_THIN, $module->id, do_shortcode($module->text));
        break;
      case "give":
        $gift = !empty($module->title) ? "source_typ=3&source=" . $module->title . "&" : "";
        return sprintf(do_shortcode(self::MODULE_GIVE), $module->id, $gift);
        break;
    }
  }


}


new UW_Module;
