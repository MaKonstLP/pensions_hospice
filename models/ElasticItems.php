<?php

namespace frontend\modules\hospice\models;

use Yii;
use common\models\Restaurants;
use common\models\PansionMain;
use common\models\RestaurantsTypes;
use yii\helpers\ArrayHelper;
use common\models\Subdomen;
use common\models\RestaurantsSpec;
use common\models\RestaurantsSpecial;
use common\models\RestaurantsExtra;
use common\widgets\ProgressWidget;

class ElasticItems extends \yii\elasticsearch\ActiveRecord
{
    public function attributes()
    {
        return [
            'id',
            'pansion_id',
            'pansion_name',
            'pansion_url',
            'pansion_price',
            'pansion_price_old',
            'pansion_address',
            'pansion_review_yandex',
            'pansion_our',
            'pansion_cities',
        ];
    }

    public static function index()
    {
        return 'hospice';
    }

    public static function type()
    {
        return 'items';
    }

    /**
     * @return array This model's mapping
     */
    public static function mapping()
    {
        return [
            static::type() => [
                'properties' => [
                    'id'                           => ['type' => 'integer'],
                    'pansion_id'                   => ['type' => 'integer'],
                    'pansion_name'                 => ['type' => 'text'],
                    'pansion_url'                  => ['type' => 'text'],
                    'pansion_price'                => ['type' => 'integer'],
                    'pansion_price_old'            => ['type' => 'integer'],
                    'pansion_address'              => ['type' => 'text'],
                    'pansion_review_yandex'        => ['type' => 'text'],
                    'pansion_our'                  => ['type' => 'integer'],
                    'pansion_cities'               => ['type' => 'nested', 'properties' => [
                        'id'                        => ['type' => 'integer'],
                        'name'                      => ['type' => 'text'],
                    ]],
                ]
            ],
        ];
    }

    /**
     * Set (update) mappings for this model
     */
    public static function updateMapping()
    {
        $db = static::getDb();
        $command = $db->createCommand();
        $command->setMapping(static::index(), static::type(), static::mapping());
    }

    /**
     * Create this model's index
     */
    public static function createIndex()
    {
        $db = static::getDb();
        $command = $db->createCommand();
        $command->createIndex(static::index(), [
            'settings' => [
                'number_of_replicas' => 0,
                'number_of_shards' => 1,
            ],
            'mappings' => static::mapping(),
            //'warmers' => [ /* ... */ ],
            //'aliases' => [ /* ... */ ],
            //'creation_date' => '...'
        ]);
    }

    /**
     * Delete this model's index
     */
    public static function deleteIndex()
    {
        $db = static::getDb();
        $command = $db->createCommand();
        $command->deleteIndex(static::index(), static::type());
    }

    public static function refreshIndex($params)
    {
        $connection = new \yii\db\Connection($params['main_connection_config']);
        $connection->open();
        Yii::$app->set('db', $connection);

        $res = self::deleteIndex();
        $res = self::updateMapping();
        $res = self::createIndex();


        $pansions = PansionMain::find()
            ->with('cities')
            ->limit(100000)
            ->all();

        $all_res = '';


        $pens_count = count($pansions);
        $pens_iter = 0;
        foreach ($pansions as $pansion) {
            // $res = self::addRecord($restaurant, $restaurants_types, $restaurants_spec, $restaurants_specials, $restaurants_extra);
            $res = self::addRecord($pansion);
            echo ProgressWidget::widget(['done' => $pens_iter++, 'total' => $pens_count]);
            //$all_res .= $res.'<br><br><br><br><br><br><br><br><br><br><br><br>';
        }
        echo 'Обновление индекса ' . self::index() . ' ' . self::type() . ' завершено<br>' . $all_res;
    }

    public static function getTransliterationForUrl($name)
    {
        $latin = array('-', "Sch", "sch", 'Yo', 'Zh', 'Kh', 'Ts', 'Ch', 'Sh', 'Yu', 'ya', 'yo', 'zh', 'kh', 'ts', 'ch', 'sh', 'yu', 'ya', 'A', 'B', 'V', 'G', 'D', 'E', 'Z', 'I', 'Y', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', '', 'Y', '', 'E', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', '', 'y', '', 'e');
        $cyrillic = array(' ', "Щ", "щ", 'Ё', 'Ж', 'Х', 'Ц', 'Ч', 'Ш', 'Ю', 'я', 'ё', 'ж', 'х', 'ц', 'ч', 'ш', 'ю', 'я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Ь', 'Ы', 'Ъ', 'Э', 'а', 'б', 'в', 'г', 'д', 'е', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'ь', 'ы', 'ъ', 'э');
        return trim(
            preg_replace(
                "/(.)\\1+/",
                "$1",
                strtolower(
                    preg_replace(
                        "/[^a-zA-Z0-9-]/",
                        '',
                        str_replace($cyrillic, $latin, $name)
                    )
                )
            ),
            '-'
        );
    }

    public static function addRecord($pansion)
    {
        $isExist = false;

        try {
            // $record = self::get($restaurant->id);
            $record = self::get($pansion->id);
            if (!$record) {
                $record = new self();
                // $record->setPrimaryKey($restaurant->id);
                $record->setPrimaryKey($pansion->id);
            } else {
                $isExist = true;
            }
        } catch (\Exception $e) {
            $record = new self();
            // $record->setPrimaryKey($restaurant->id);
            $record->setPrimaryKey($pansion->id);
        }

        $record->id = $pansion->id;
        $record->pansion_id = $pansion->pansion_id;
        $record->pansion_name = $pansion->name;
        $record->pansion_url = $pansion->url;
        $record->pansion_price = $pansion->price;
        $record->pansion_price_old = $pansion->price_old;
        $record->pansion_address = $pansion->address;
        $record->pansion_review_yandex = $pansion->review_yandex;
        $record->pansion_our = $pansion->our;

        //Города
        $cities = [];
        foreach ($pansion->cities as $key => $city) {
            $city_arr =[];
            $city_arr['id'] = $city->city_id;
            $city_arr['name'] = $city->name;
            array_push($cities, $city_arr);
        }
        $record->pansion_cities = $cities;

        try {
            if (!$isExist) {
                $result = $record->insert();
            } else {
                $result = $record->update();
            }
        } catch (\Exception $e) {
            $result = $e;
        }

        return $result;
    }
}
