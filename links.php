<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents('php://input');
    $dataA = json_decode($json);
    $jsonString = file_get_contents('links.json');
    $data = json_decode($jsonString, true);
    $testCase = false;
    
    for ($i = count($data) - 1; $i >= 0; $i--) {
        $entry = $data[$i];
        if (
            (($entry['source'] == $dataA->source && $entry['target'] == $dataA->target) || ($entry['source'] == $dataA->target && $entry['target'] == $dataA->source)) ||
            ($dataA->target == "null" && ($dataA->source == $entry['source'] || $dataA->source == $entry['target']))
        ) {
            array_splice($data, $i, 1);
            $testCase = true;
        }
    }
    
    if (!$testCase) {
        $data[] = $dataA;
    }
    
    $newJsonString = json_encode($data);
    file_put_contents('links.json', $newJsonString);
    return $newJsonString;
}
?>
