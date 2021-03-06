<?php


/**
 * @namespace GCTour\Query
 * @uri /tour
 * @uri /tour/{webcode}
 */
class TourResource extends Resource {
    
    protected $tm;
    protected $em;
    private $webcode;
    
    function __construct($paramaters) {
		if(isset($paramaters['webcode'])){
			$this->webcode = $paramaters['webcode'];
		}
        $this->tm = TemplateManager::getInstance();
        $this->em = GeocacheManager::getInstance();
    }
    
    function get($request) {
        $response = new Response($request);
        
	
        
        
      if(isset($this->webcode)){
  			$tour = $this->em->fetchTour($this->webcode);			
  		 			echo 
  			$format = $request->mostAcceptable(array(
  				'json', 'html'
  			));
  					
  			switch ($format) {
  				case 'json':
  					$response->addHeader('Content-type', 'application/json');
  					$response->body = $tour->__toJSON();
  					break;
  				case 'html':
  					$this->tm->smarty->assign('title', 'Tour Query');
  					if(get_class($tour) === "JSONMessage"){
  					  
             	$this->tm->smarty->assign('notour', "Tour '".$this->webcode."' does not exists!");
  					  
  					} elseif (get_class($tour) === "OldTour") {
  					  	$this->tm->smarty->assign('oldtour', $tour);
  					  
  					} elseif (get_class($tour) === "Tour") {
             	$this->tm->smarty->assign('tour', $tour);
  					  $this->tm->smarty->assign('markers', $tour->merge());
  					}
//  					if()
  				
  					
  					
  					$response->code = Response::OK;
  					$response->addHeader('Content-type', 'text/html');
  					$response->body = $this->tm->render('tour');
          
  			}
  		} else {
  			$this->tm->smarty->assign('title', 'Tour Query');
  			
  			$response->code = Response::OK;
  			$response->addHeader('Content-type', 'text/html');
  			$response->body = $this->tm->render('tour');	
  		}
		

      return $response;
        
    }
    
    
    
    
	function post($request) {
		$response = new Response($request);
		
		if (isset($_POST['webcode'])) {
      $this->webcode = $_POST['webcode'];
			$response =  $this->get($request);
	  } else {
            $response->code = Response::BADREQUEST;
		}
		return $response;
        
  }

    
}
