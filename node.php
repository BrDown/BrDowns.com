<!-- updates the position JSON to allow for global change (or if you refresh the page) -->
<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents('php://input');
    $dataA = json_decode($json);
    $jsonString = file_get_contents('nodes.json');
    $data = json_decode($jsonString, true);
    // start of modification
    // echo $dataA->id;
    $testCase = false;
    
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $dataA->id) {
            $testCase = true;
            if($dataA->name != "null"){
                $data[$key]['name'] = $dataA->name;
                // echo $dataA->name;
            } else if($dataA->color != "null"){
                $data[$key]['color'] = $dataA->color;
                // echo $dataA->color;
            } else if($dataA->description != "null"){
                $data[$key]['description'] = $dataA->description;
                // echo $dataA->color;
            } else {
                array_splice($data, $key, 1);
            }
        }
    }
    if(!$testCase){
        array_push($data, $dataA);
    }
    // end of modification
    $newJsonString = json_encode($data);
    file_put_contents('nodes.json', $newJsonString);
    return $newJsonString;
}
?>