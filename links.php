<!-- updates the links JSON to allow for global change (or if you refresh the page) -->
<!-- FUCKING ADDING TO THE ARRAY DOESNT FUCKNIG WORK HERE???? WHY????? AAAAAAAAAAAAAAAAAAAAA -->
<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents('php://input');
    $dataA = json_decode($json);
    $jsonString = file_get_contents('links.json');
    $data = json_decode($jsonString, true);
    $testCase = false;
    var_dump($dataA);
    foreach ($data as $key => $entry) {
        if (($entry['source'] == $dataA->source && $entry['target'] == $dataA->target) || $entry['source'] == $dataA->target && $entry['target'] == $dataA->source) {
            unset($data[$key]);
            $testCase = true;
        }
    }
    // TO DO: MAKE IT SO IF THE TESTCASE IS NEVER TRIGGERED, ADDS TO THE JSON.
    if(!$testCase){
        array_push($data,$dataA); //maybe this will work?
    }
    $newJsonString = json_encode($data);
    file_put_contents('links.json', $newJsonString);
    return $newJsonString;
}
?>