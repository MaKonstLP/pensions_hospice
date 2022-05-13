<?php

namespace app\modules\hospice;


use Yii;
use common\models\Subdomen;
/**
 * svadbanaprirode module definition class
 */
class Module extends \yii\base\Module
{
    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\modules\hospice\controllers';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        $subdomen = explode('.', $_SERVER['HTTP_HOST'])[0];
        
        parent::init();
    }
}
