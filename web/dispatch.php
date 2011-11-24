<?php

// load Tonic library
require_once './lib/tonic.php';

// load GCTour library
require_once './lib/gctour.php';

// load resources
//~ require_once 'resources/tour_save.php';
require_once 'resources/map_save.php';
require_once 'resources/map_check.php';
require_once 'resources/map_show.php';

require_once 'resources/error_send.php';
require_once 'resources/error_query.php';


// load Datebase wrapper and config
require_once 'conf/config.inc.php';
require_once 'lib/Database.singleton.php';


// create the $db object 
$db = Database::obtain(DB_SERVER, DB_USER, DB_PASS, DB_DATABASE); 
// connect to the server 
$db->connect(); 
// support umlauts
$db->query("set names 'utf8';");


// handle request
$request = new Request(array(
        'baseUri' => '/gctour' // change this if you have an different uri on the webserver
    ));
try {
    $resource = $request->loadResource();
    $response = $resource->exec($request);

} catch (ResponseException $e) {
    switch ($e->getCode()) {
    case Response::UNAUTHORIZED:
        $response = $e->response($request);
        $response->addHeader('WWW-Authenticate', 'Basic realm="Tonic"');
        break;
    default:
        $response = $e->response($request);
    }
}
$response->output();

// and when finished, remember to close connection 
$db->close();

