<?php

use Scriptotek\Sru\Client as SruClient;
use Danmichaelo\SimpleMarcParser\BibliographicParser;
use Danmichaelo\SimpleMarcParser\HoldingsParser;
use \Guzzle\Http\Client as HttpClient;

class DocumentsController extends BaseController {

	protected $userAgent = 'KatApi/0.1';

	public function getIndex()
	{
		// show search box?
		return View::make('hello');
	}

	public function lookup($res) {

		$sru = new SruClient($this->baseUrl, $this->sruOptions);
		$query = 'rec.identifier="' . $res['id'] . '"';
		$response = $sru->search($query, 1, 1);

		if (count($response->records) == 0) {
			App::abort(404, 'Record not found');
		}

		$data = $response->records[0]->data;

		$parser = new BibliographicParser;
		$holdingsParser = new HoldingsParser;
		$r = $data->first('metadata/marc:collection/marc:record[@type="Bibliographic"]');

		$rec = array_merge($res, $parser->parse($r));
		$rec['sru_url'] = $sru->urlTo($query, 1, 1);

		$rec['holdings'] = array();

		foreach ($data->xpath('metadata/marc:collection/marc:record[@type="Holdings"]') as $holding) {
			$h = $holdingsParser->parse($holding);
			$rec['holdings'][] = $h;
		}

		$rec['subjects'] = array_map(function($subj) {
			$term = $subj['term'];
			if (isset($subj['subdivisions']['topical'])) $term .= ' : ' . $subj['subdivisions']['topical'];
			if (isset($subj['subdivisions']['form'])) $term .= ' : ' . $subj['subdivisions']['form'];
			if (isset($subj['subdivisions']['chronological'])) $term .= ' : ' . $subj['subdivisions']['chronological'];
			if (isset($subj['subdivisions']['geographic'])) $term .= ' : ' . $subj['subdivisions']['geographic'];
			$o = array(
				'term' => $term
			);
			if (isset($subj['vocabulary'])) $o['vocabulary'] = $subj['vocabulary'];
			return $o;
		}, $rec['subjects']);

		return Response::json($rec);
	}

}
