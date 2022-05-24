<?php
namespace app\modules\hospice\controllers;

use Yii;
use yii\web\Controller;
use common\models\Seo;

class LicenziiController extends Controller
{

	public function actionIndex(){

        $this->view->params['menu'] = 'licenzii';
		// $seo = $this->getSeo('licenzii');
        // $this->setSeo($seo);

		return $this->render('index.twig', array(
			// 'seo' => $seo,
			'year' => date('Y') + 1,
			// 'city_rod' => Yii::$app->params['subdomen_rod']
		));
	}

  	private function getSeo($type, $page=1, $count = 0){
        $seo = new Seo($type, $page, $count);

        return $seo->seo;
    }

    private function setSeo($seo){
        $this->view->title = $seo['title'];
        $this->view->params['desc'] = $seo['description'];
        $this->view->params['kw'] = $seo['keywords'];
    }

}