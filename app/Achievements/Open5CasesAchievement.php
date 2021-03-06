<?php

namespace App\Achievements;

use Gstt\Achievements\Achievement;
use App\Traits\AchivementUnlockedTrait;

class Open5CasesAchievement extends Achievement
{
    use AchivementUnlockedTrait;
    /*
     * The achievement name
     */
    public $name = "open 5 cases";

    /*
     * A small description for the achievement
     */
    public $description = "Opened 5 cases";
    
    /*
     * The amount of "points" this user need to obtain in order to complete this achievement
     */
    public $points = 5;

    public $levelPoints = 10;

    public function whenUnlocked($progress)
    {
        $this->givePoints($progress->achiever_id, $this->levelPoints);
        $this->sendNotification($progress->achiever_id, $this->description);
    }
}