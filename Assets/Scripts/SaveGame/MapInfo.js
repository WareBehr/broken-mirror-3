﻿#pragma strict

class PlanetInfo { //this class stores all planet information necessary for the map
	var isEnabled : boolean;
	var name : String;
	var faction : int;
	var scene : String;
	var description : String;
	var image : Texture2D;
	var cood : PlanetCood;
	var defenseForce : SaveShip[];
	var hasPlayerVisit : boolean = false;
	var isColonized : boolean = false;
	
	class PlanetCood {
		
		var x : int;
		var y : int;
	
	}

}

class GuiComponent {

	var image : Texture2D;
	var position : Rect;
	var text : String;

}

class MapButtons {
	var buttonRect : Rect;
	var ally : Texture2D;
	var enemy : Texture2D;
	var neutral : Texture2D;
	var own : Texture2D;
	var empty : Texture2D;
	var never : Texture2D;
	
	
}

class OverRect {
	var position : Rect;
	var bg_image : Texture2D;
	
	//labels
	var planet_label : Rect;
	var faction_label : Rect;
	var race_label : Rect;
	

}

class MapGui { //this class stores all information related with the map GUI
	var map_bg : GuiComponent; //the background information
	var close_bt : GuiComponent; //closing button
	
	//map buttons
	var buttons : MapButtons;
	
	//mouse over
	var mouseOver : OverRect;
	
	
	var skin : GUISkin;

}

var planets : PlanetInfo[];
var map : MapGui;
var isMap : boolean = false;

//set warp speed
var warpTime : float = 3.0f;
var warpInc : float = 750.0f;
var warpWait : float = 1.0f;;

private var areaRect : Rect;





function OnGUI () {
	
	
	//now we check the isMap value
	
	if(isMap) { //if its true, prepare to draw the map
		//calls the DrawMap function
		drawMap();	
		
	}
	
	
	
	
	
	
}

//this function draws the map
function drawMap () {

	//calculate Rect
	var areaX : int = (Screen.width - map.map_bg.position.width)/2;
	var areaY : int = (Screen.height - map.map_bg.position.height)/2;
	var areaWidth : int = map.map_bg.position.width;
	var areaHeight : int = map.map_bg.position.height;
	areaRect = new Rect(areaX, areaY, areaWidth, areaHeight);
	//Set area
	GUILayout.BeginArea(areaRect);

		GUI.DrawTexture(map.map_bg.position, map.map_bg.image);//Draw the background
		
		//draw the buttons
		
		//get the player ship
		var playerShip : GameObject = SaveGame.FindPlayerShip();
		var faction : int = playerShip.GetComponent(shipProperties).shipInfo.faction; //and the faction
		
		//update faction info
		//get script
		var save_go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
		var gen_scr : GeneralInfo = save_go.GetComponent(GeneralInfo);
		
		//now get faction info
		var factionInfo : FactionInfo = gen_scr.factionInfo[faction];
		
		//print the buttons		
		for(var x : int = 0; x < planets.Length; x++) {
			CreatePlanetButton(planets[x], map.buttons, map.map_bg.position, factionInfo, faction);
		}
		
		//prepare the mouseovers
		for(x = 0; x < planets.Length; x++) {
		
			var butRect : Rect = prepButRect(map.map_bg.position, planets[x], map.buttons);
			DrawMouseOver(butRect, map.mouseOver, planets[x]);
			
		}
		
		
	
		//create close button
		var padX : int = 2;
		var padY : int = 3;
		var buttonX : int = areaWidth - map.close_bt.position.width - padX;
		var buttonY : int = areaHeight - map.close_bt.position.height - padY;
		var buttonWidth : int = map.close_bt.position.width;
		var buttonHeight : int = map.close_bt.position.height;
		
		var buttonRect : Rect = new Rect(buttonX, buttonY, buttonWidth, buttonHeight);
		if(GUI.Button(buttonRect, map.close_bt.text, map.skin.GetStyle("CloseMap"))) {
			swapStatus();
		}

	//End area
	GUILayout.EndArea();
	

}

/**
*This function creates the planet buttons on the star map
*planet represents the planet information
*button represents the button set being used
*mapRect contains the area dimensions
*faction contains the player faction information
*this should output several buttons on the GUI
*/

function CreatePlanetButton(planet : PlanetInfo, buttons : MapButtons, mapRect : Rect, factionInfo : FactionInfo, faction : int) {
	var useTexture : Texture2D;
	
	//first check if planet has been visited by player
	if(!planet.hasPlayerVisit) {
		useTexture = buttons.never;
	}
	else if(!planet.isColonized) { //check if the player is colonized
		useTexture = buttons.empty;
	}
	else if(CheckArrayValue(planet.faction, factionInfo.hostileFactions)){ //if planet is enemy
		useTexture = buttons.enemy;
	}
	else if(CheckArrayValue(planet.faction, factionInfo.alliedFactions)) { //if planet is ally
		useTexture = buttons.ally;
	}
	else if(faction == planet.faction) { //if it belongs to your faction
		useTexture = buttons.own;
	}
	else { //if its neutral
		useTexture = buttons.neutral;
	}
	
	//prepare the Rect
	var butRect : Rect = prepButRect(mapRect, planet, buttons);
	
	//now its the button
	if(GUI.Button(butRect, useTexture, map.skin.GetStyle("ButtonMap"))) {
		
		goWarp(planet.scene);
	
	}
	
	//var globalRect : Rect = new Rect(CoodX + areaRect.x, CoodY + areaRect.y, buttons.buttonRect.width, buttons.buttonRect.height);
	
	
	
	

}

/**
*This function draws a box when the mouse is over the button
*
*/
function DrawMouseOver(button : Rect, mouseover : OverRect, planet : PlanetInfo) {
	//check if the mouse is over the button
	if(button.Contains(Event.current.mousePosition)) {
		
		//construct texture rect
		var CoodX : int = button.x;
		var CoodY : int = button.y - mouseover.position.height;
		var overRect : Rect = new Rect(CoodX, CoodY, mouseover.position.width, mouseover.position.height);
		
		//prepare to draw
		GUILayout.BeginArea(overRect);
			GUI.DrawTexture(Rect(0,0, mouseover.position.width, mouseover.position.height),mouseover.bg_image);
			
			GUI.Label(mouseover.planet_label, planet.name, map.skin.GetStyle("PlanetOver")); //Show planet name
			
			//Get faction info
			var facInfo : FactionInfo = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo).factionInfo[planet.faction];
			var facName : String = facInfo.factionName;
			
			GUI.Label(mouseover.faction_label, facName, map.skin.GetStyle("FactionOver")); //Show planet faction
			
			var facRace : String = facInfo.factionRace;
			
			GUI.Label(mouseover.race_label, facRace, map.skin.GetStyle("FactionOver"));// Show planet master race
			
		
		GUILayout.EndArea();
	}

}


function CheckArrayValue(desValue : int, array : int[]) : boolean {

	var belongs : boolean = false;
	
	for(var val : int in array) {
	
		if (desValue == val)
		{
			belongs = true;
		}
	
	}
	
	return belongs;

}

function swapStatus() {
	isMap = !isMap;
}

/**
*This function changes scene, and eventualy will play the warp animation,
*It accepts the destiny String as an argument
*/

function goWarp(destiny : String) {
	//map off
	swapStatus();
	
	//save game first
	var save_obj : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var save_scr : SaveGame = save_obj.GetComponent(SaveGame);
 	save_scr.Save();
	
	//find player ship
	
	var playerShip : GameObject = save_scr.FindPlayerShip();
	
	//play warp anymation
	//play sound first (future) and wait 1.0 seconds
	
	WaitForSeconds(warpWait);
	
	var warpDur : float = Time.time + warpTime;
	while(Time.time < warpDur) {
		
		playerShip.rigidbody.velocity.z += warpInc * Time.deltaTime;
	
		yield;
	
	}
	
	
	//load new scene
	//show splash screen
	var go : GameObject = GameObject.FindGameObjectWithTag("LoadScene");
	var scr : LoadScene = go.GetComponent(LoadScene);
	scr.showScreen();
	
	
	//load level

	
	
	scr.LoadScene(destiny);
	
}

//Esta funçao calcula as dimensoes e posicao do butao
function prepButRect(mapRect : Rect, planet : PlanetInfo, buttons : MapButtons) : Rect {
		var CoodX : int = (mapRect.width/2 + planet.cood.x) - (buttons.buttonRect.width/2);
		var CoodY : int = (mapRect.height/2 + planet.cood.y) - (buttons.buttonRect.height/2);
	
		var butRect : Rect = new Rect(CoodX, CoodY, buttons.buttonRect.width, buttons.buttonRect.height);
		return butRect;

}