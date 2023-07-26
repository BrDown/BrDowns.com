<html>
    <body>
        <a class="fuckyou">AAA</a>
    </body>
    <script><?php
// Replace 'example.bin' with the path to your binary file
$fileFolder = '001';
$jsons = array("center", "links", "nodes", "position");
foreach($jsons as $index => $js){
    echo 'const '.$js.' = '.file_get_contents($fileFolder."/".$js.'.json').";";
}
?></script>
</html>