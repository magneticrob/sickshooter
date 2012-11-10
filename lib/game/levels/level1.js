ig.module( 'game.levels.level1' )
.requires( 'impact.image','game.entities.player','game.entities.enemy' )
.defines(function(){
LevelLevel1=/*JSON[*/{"entities":[{"type":"EntityPlayer","x":74,"y":204},{"type":"EntityEnemy","x":90,"y":40}],"layer":[{"name":"background","width":1,"height":2,"linkWithCollision":false,"visible":1,"tilesetName":"media/bg.png","repeat":false,"preRender":false,"distance":"1","tilesize":200,"foreground":false,"data":[[5],[8]]}]}/*]JSON*/;
LevelLevel1Resources=[new ig.Image('media/bg.png')];
});