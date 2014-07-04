<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('hello');
});

# /documents/show/:id
Route::get('documents/show/{id}', 'BibsysController@getShow');
Route::get('bibsys/{id}', function($id) {
	return Redirect::action('BibsysController@getShow', $id);
});

# /documents/search
Route::get('documents/search', 'BibsysController@getSearch');
Route::get('bibsys/search', function() {
	return Redirect::action('BibsysController@getSearch');
});

# /covers/show/:id
Route::get('covers/show/{id}', 'CoversController@getShow');
//Route::get('covers/select/{id}', 'CoversController@getSelect');

//Route::get('covers/{id}/store', 'CoversController@postStore');
//Route::get('covers/{id}/remove', 'CoversController@getRemove');
//Route::get('covers/{id}/list', 'CoversController@getList');
//Route::get('covers/{id}/set-preferred/{index}', 'CoversController@postSetPreferred');


//Route::controller('documents', 'DocumentsController');
//Route::controller('subjects', 'SubjectsController');
//Route::controller('covers', 'CoversController');


App::missing(function($exception)
{
	$negotiator = new \Negotiation\FormatNegotiator();
	$acceptHeader = $_SERVER['HTTP_ACCEPT'];

	$priorities = array('text/html', 'application/json');
	$format = $negotiator->getBest($acceptHeader, $priorities);

	if ($format->getValue() == 'text/html') {
		return Response::view('errors.missing', array(
			'message' => $exception->getMessage() ?: 'Page not found'
		), 404);
	} else if ($format->getValue() == 'application/json') {
		return Response::json(array(
			'error' => $exception->getMessage() ?: 'Page not found'
		), 404);
	}
});