<?php
/**!
 * Plugin Name: UW Slideshow
 * Plugin URI: http://uw.edu/brand/web/#slideshow
 * Description: Put a slideshow on your pages and posts.
 * Version: 1.0
 * Author: UW Web Team
 */

class UW_Slideshow
{

  const POST_TYPE        = 'slideshow';
  const POST_TYPE_NAME   = 'Slideshow';
  const POST_TYPE_PLURAL = 'Slideshows';
  const META_BOX_TITLE   = 'Slides';

  function __construct()
  {
    add_action( 'init', array( $this, 'register_slideshow_post_type' ) );
    add_action( 'admin_enqueue_scripts', array( $this, 'register_slideshow_assets' ) );
    add_action( 'wp_ajax_get_current_uw_slideshow', array( $this, 'get_current_uw_slideshow') );
    add_action( 'save_post_' . self::POST_TYPE , array( $this, 'save_slideshow') );

    add_filter( 'manage_'. self::POST_TYPE .'_posts_columns', array( $this, 'add_shortcode_column' ) );
    add_action( 'manage_posts_custom_column' , array( $this, 'add_shortcode_column_content' ) , 10, 2 );

    add_shortcode( 'slideshow', array( $this, 'shortcode') );
  }

  function register_slideshow_post_type()
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
        'register_meta_box_cb' => array( $this, 'add_slideshow_meta_box' ),
        'supports' => array( 'title' ),
      )
    );

  }

  function add_slideshow_meta_box()
  {
    add_meta_box(
      self::POST_TYPE,
      self::META_BOX_TITLE,
      array( $this, 'add_slideshow_meta_box_html'),
      self::POST_TYPE
    );

  }

  function add_slideshow_meta_box_html()
  {
	    wp_nonce_field( self::POST_TYPE . '_meta_box', self::POST_TYPE . '_meta_box_nonce' );
    ?>
    <ul>
    </ul>
      <p>
        <a id="add-new-slide" class="button-primary" href="#">Add a New Slide</a>
      </p>

    <?php

  }

  function save_slideshow( $post_id ) {

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

    if ( isset( $_POST['slides'] ) )
        update_post_meta( $post_id, 'slides', $_POST['slides'] );


  }

  function register_slideshow_assets()
  {
    wp_enqueue_script( self::POST_TYPE, plugins_url( 'js/admin.uw-slideshow.dev.js', __FILE__ ), array('backbone', 'jquery-ui-sortable') );
    wp_enqueue_style( self::POST_TYPE, plugins_url( 'css/admin.uw-slideshow.css', __FILE__ ) );
    wp_enqueue_media();
  }

  function add_shortcode_column( $columns )
  {
    return array_merge( array_slice( $columns, 0, 2 ), array('shortcode'=>'Shortcode'), array_slice( $columns, 2, null ));
  }

  function add_shortcode_column_content( $column, $post_id )
  {
    if ( $column == 'shortcode' ) echo '[slideshow id='. $post_id .']';
  }

  function shortcode( $atts )
  {

    $atts = (object) shortcode_atts( array(
      'id' => null,
      'simple' => false,
    ), $atts);

    if ( ! $atts->id ) return;

    $slides = (object) get_post_meta( $atts->id, 'slides', true );


   // 137-141 Creates for a simple slideshow

    $class = ( $atts->simple === "true" ? ' photo-slider' : null);

    $slidereturn = '<div tabIndex="0" class="uw-slideshow' . $class . ' ' . 'slideshow-' . $atts->id . '">';

    foreach ($slides as $slide )
    {
      $slide = (object) $slide;
      $slide->esctitle = esc_attr( $slide->title );
      $slidereturn .=  "<div class='slide " . ($slide->text || $slide->title ? 'has-text' : 'no-text') . "'>" .
              "<a tabIndex='-1' href='{$slide->link}' title='{$slide->esctitle}'><img src='{$slide->image}' title='{$slide->esctitle}' /></a>" .
              "<div>" .
                "<h3 tabIndex='-1'><a tabIndex='-1' href='{$slide->link}' title='{$slide->esctitle}'>{$slide->title}</a>".
                "</h3>".
                "<p>{$slide->text}</p>" .
              "</div>" .
            "</div>";
    }
    return $slidereturn . '</div>';


  }

  function get_current_uw_slideshow()
  {

    $slides = get_post_meta( $_GET['id'], 'slides', true );

    $slides = $slides ? $slides : array();

    foreach ($slides as $slide )
    {
      $slideshow[] = $slide;
    }

    wp_die( json_encode( $slideshow ) );

  }

  // Helper functions
  static public function get_latest_slideshow()
  {
    $posts = get_posts( array(
      'post_type'   => self::POST_TYPE,
      'numberposts' => 1
    ) );

    $slideshow = array_shift( $posts );

    $slides = get_post_meta( $slideshow->ID, 'slides', true );

    return $slides ? json_decode( json_encode( array_reverse( $slides ) ) ) : array();

  }


}


new UW_Slideshow;
