<?php
/*
    Plugin Name: PhotoFolio
    Plugin URI: http://www.withoutthea.com/projects/photofolio
    Description: A fully functional, good looking photo portfolio plugin.
    Version: 0.2
    Author: Nathan Loding
    Author URI: http://www.withoutthea.com/
    License: GPL2

    Copyright 2011  Nathan Loding  (email : nathan@withoutthea.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

class Photofolio
{
    const version = '0.2';
    const DEBUG = true; // set to false for a production environment!

    public $postId;
    public $markup;

    private $_defaults = array();
    private $_attachments = array();

    public function __construct()
    {
        // get some default values around
        $this->_defaults = array(
            // @TODO -> All these here for the growth of the project ... not implement in Photofolio itself yet!
            /*'thumbnails' => true,
            'showNav' => true,
            'navPosition' => 'top-center',
            'slideshow' => false,
            'timer' => '5',
            'lightbox' => false,
            'thumbHeight' => 'auto',
            'thumbWidth' => 'auto',
            'imageHeight' => 'auto',
            'imageWidth' => 'auto',
            'containerHeight' => 'auto',
            'containerWidth' => 'auto',*/

            'containerClass' => 'photofolio-container',
            'navPosition' => 'top-center',
            'thumbnailPosition' => 'below',
            'exclude' => ''
        );

        $this->registerScripts();
    }

    public function getSetting($setting)
    {
        if (array_key_exists($setting, $this->_defaults)) return $this->_defaults[$setting];
        else return false;
    }

    public function registerScripts()
    {
        // setup our mandatory features
        // first, get rid of old versions, we want 1.4.4 in the footer
        // @TODO -> Does this break any other plugins/themes, and how to compensate?
        //wp_deregister_script('jquery');
        //wp_register_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js', false, '1.4.4', true);

        // add jquery.cycle and jquery.photofolio and css
        //wp_register_script('jquery.cycle', plugins_url('/js/jquery.cycle.min.js', __FILE__), 'jquery', '', true);
        wp_register_script('jquery.photofolio', plugins_url('/js/jquery.photofolio.js', __FILE__), array('jquery'), true);
        wp_register_style('jquery.photofolio', plugins_url('/css/photofolio.css', __FILE__), '', '0.1a', 'screen');

        // queueing just jquery.photofolio should queue all due to deps
        wp_enqueue_script('jquery.photofolio');
        wp_enqueue_style('jquery.photofolio');

        // add css
        wp_register_style('photofolio', plugins_url('/css/jquery.photofolio.css'), false, '', 'screen');
    }

    public function initPhotofolio($atts)
    {
        // of course, get the post ID!
        $this->postId = get_the_ID();

        // first, handle the shortcode and extract the values
        $this->handleShortcode($atts);

        // get attachments for this post/page
        $this->getAttachments();

        // build the container and output results
        $this->buildContainer();

        // finish it off and output the fun markup!
        return $this->output();
    }

    public function handleShortcode($atts)
    {
        $this->_defaults = shortcode_atts($this->_defaults, $atts);
        
        //if (self::DEBUG) print_r($this->_defaults);
    }

    public function getAttachments()
    {
        if ($this->getSetting('exclude') != '')
            $exclude = preg_replace('/[^0-9,]+/', '', $$this->getSetting('exclude'));
        else
            $exclude = null;

		$this->_attachments = get_posts(array(
            'order'          => 'ASC',
            'orderby' 		 => 'menu_order ID',
            'post_type'      => 'attachment',
            'post_parent'    => $this->postId,
            'post_mime_type' => 'image',
            'post_status'    => null,
            'numberposts'    => -1,
            //'size'			 => $size,
            'exclude'		 => $exclude
        ));

        //if (self::DEBUG) var_dump($this->_attachments);
    }

    public function buildContainer()
    {
        // prep some markup -- gonna try preg_replace ...
        $markup =
        '<ul class="wp-photofolio">
            %image-list%
         </ul>

        <script type="text/javascript">
            %jquery-script%
        </script>';

        // if there are no attachments, show an error and return
        if (empty($this->_attachments))
        {
            // @TODO -> Add error message (red box)
            return false;
        }

        // build image list
        foreach ($this->_attachments as $att)
        {
            $li .= "<li>" . wp_get_attachment_image($att->ID, 'full', false) . "</li>\n";
        }

        //if (self::DEBUG) var_dump($li);

        // build the jquery
        $jq =
        "jQuery(document).ready(function($) {
			$('.wp-photofolio').photofolio({
				navPosition : '" . $this->getSetting('navPosition') . "',
				thumbnailPosition : '" . $this->getSetting('thumbnailPosition') . "'
			});
        });";

        // preg_replace into the markup!
        $markup = preg_replace('/%image-list%/', $li, $markup);
        $markup = preg_replace('/%jquery-script%/', $jq, $markup);
        
        $this->markup = $markup;

        //$this->output();
    }

    public function output()
    {
        return apply_filters('the_content', $this->markup);
    }
}

$photofolio = new Photofolio();

add_shortcode('photofolio', array($photofolio, 'initPhotofolio'));

?>
