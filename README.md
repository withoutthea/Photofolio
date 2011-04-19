**Photofolio** is an elegant, easy-to-use photography portfolio, with both a standalone jQuery plugin or an integrated Wordpress plugin.   **Photofolio** is meant to be extremely easy to use, extremely flexible for those who are so inclined, and compatible with *most* website/WP themes.

This project is still in heavy development and is currently still in an *Alpha* release.

## Wordpress Installation/Usage

*Note:* Photofolio is compatible with Wordpress 3.x.  It has not been tested with anything lower than 3.0.
1. Extract the `wp-photofolio.zip` file to your `wp-content\plugins` directory.
2. Activate the plugin on your Plugin menu.
3. In your post/page, use the `[photofolio]` shortcode.
4. Attach any images you with to be in the portfolio to the post/page (do not include in the text, just as attachments).
5. Save and watch the magic happen!

## Standalone Installation/Usage

*Note:* Photofolio requires jQuery 1.4 or higher.
1. Include jQuery and jquery.photofolio.js in your Javascript includes.
2. Include photofolio.css in your CSS includes (or customize the CSS).
3. Create an unordered list (`<ul />`) with each `li` being an image (see example below).
4. Initialize the plugin with `$(ul).photofolio();`

## Sample Code

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
    <html>

        <head>
            <title>Photofolio Demo</title>
            <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
            <script type="text/javascript" src="js/jquery.photofolio.js"></script>
            <link type="text/css" rel="stylesheet" href="css/photofolio.css" />
        </head>

        <body>

            <ul>
                <?php
                    for ($i = 1; $i < 10; $i++)
                    {
                ?>
                <li><img src="images/<?php echo $i; ?>.jpg" title="<?php echo $i; ?>" rel="<?php echo $i; ?>" /></li>
                <?php
                    }
                ?>
            </ul>

            <script type="text/javascript">
                $(document).ready(function() {
                   $('ul').photofolio();
            </script>

        </body>
    </html>

## Available Options

*Coming Soon ...*

## API

*Coming Soon ...*