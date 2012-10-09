ig.module( 'game.levels.intro' )
.requires( 'impact.image','game.entities.clickable' )
.defines(function(){
LevelIntro=/*JSON[*/{"entities":[{"type":"EntityClickable","x":64,"y":216,"settings":{"text":"Play"}}],"layer":[{"name":"background","width":1,"height":2,"linkWithCollision":false,"visible":1,"tilesetName":"media/bg.png","repeat":false,"preRender":false,"distance":"1","tilesize":200,"foreground":false,"data":[[5],[8]]}]}/*]JSON*/;
LevelIntroResources=[new ig.Image('media/bg.png')];
});