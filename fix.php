<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $json = file_get_contents('php://input');
    $dataA = json_decode($json);
  
$jsonString = file_get_contents('position.json');
$data = json_decode($jsonString, true);
$testCase = false;
// echo $dataA;
var_dump($dataA);
// throw new ErrorException($dataA);
// or if you want to change all entries with activity_code "1"
foreach ($data as $key => $entry) {
    if ($entry['id'] == $dataA->id) {
        $data[$key]['x'] = $dataA->x;
        $data[$key]['y'] = $dataA->y;
        $testCase = true;
    }
}
// if(!$testCase){
//     $data = $data.$dataA;
// }

$newJsonString = json_encode($data);
file_put_contents('position.json', $newJsonString);
return $newJsonString;
}
?>