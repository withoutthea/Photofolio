<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>

    <head>
        <title>Photofolio Demo</title>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
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
            });
        </script>

    </body>
</html>