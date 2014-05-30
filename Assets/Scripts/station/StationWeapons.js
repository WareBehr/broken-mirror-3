﻿#pragma strict
import System.Collections.Generic;


var phaser : GameObject;
var torpedo : GameObject;
var pulse : GameObject;

var phaserPoints : List.<WeaponPoints>;
var torpedoPoints : List.<WeaponPoints>;
var pulsePoints : List.<WeaponPoints>;

var hullMask : LayerMask;
var shieldMask : LayerMask;

function Start () {

	//set phaser points
	if(phaser != null)
	{
		setWeaponSystem(phaserPoints, "Phaser", phaser);
	}
	//set torpedoes points
	
	if(torpedo != null) {
		setWeaponSystem(torpedoPoints, "Torpedoes", torpedo);
	}
	//set pulse points
	if(pulse != null) {
		setWeaponSystem(pulsePoints, "Pulse", pulse);
	}

}


//this method sets the weapon systems of the station
//pre weapon != null
private function setWeaponSystem(system : List.<WeaponPoints>, tag : String, weapon : GameObject){
	//set phaser points
	var systems : GameObject[] = gameObject.FindGameObjectsWithTag(tag);
	
	for(var x : int = 0; x < systems.Length; x++) {
		if(getParent(systems[x].transform) == transform) {
			var newComp : WeaponPoints = new WeaponPoints(systems[x], weapon, hullMask, shieldMask);
			system.Add(newComp);
		}
	}

}

private function getParent(go : Transform) : Transform {
	
	var trans : Transform = go;
	
	
	while(trans.parent) {
		trans = trans.parent.transform;
	}

	return trans;
	
}

//this method fires the weapons on each slot
public function fire (weaponNum : int, type : WeaponType) {
	
	switch(type) {
		
		case WeaponType.beam:
			if(phaserPoints[weaponNum].canFire()) {
				StartCoroutine(phaserPoints[weaponNum].fireBeam());
			}
			break;
		case WeaponType.torpedo:
			
			if(torpedoPoints[weaponNum].canFire()) {
				
				torpedoPoints[weaponNum].fire();
			}
			break;
		case WeaponType.pulse:
			if(pulsePoints[weaponNum].canFire()) {
				pulsePoints[weaponNum].fire();
			}
	
	}
	

}

//this method makes the weapon search for a new target
//pre 0 <= weaponNum < getLength()
public function scan (weaponNum : int, type : WeaponType, enemyList : int[]) {
	
	switch(type) {
		case WeaponType.beam:
			if(phaser != null && !phaserPoints[weaponNum].hasTarget()) {
				phaserPoints[weaponNum].scan(enemyList, gameObject);
			}
			break;
		case WeaponType.torpedo:
			if(torpedo != null && !torpedoPoints[weaponNum].hasTarget()) {
				torpedoPoints[weaponNum].scan(enemyList, gameObject);
			}
			break;
		case WeaponType.pulse:
			if(pulse != null && !pulsePoints[weaponNum].hasTarget()) {
				pulsePoints[weaponNum].scan(enemyList, gameObject);
			}
		
	
	}

}

//this method returns the length of the WeaponPoints arrays
public function getLength(type : WeaponType) : int {
	var length : int = 0;
	
	switch (type) {
		case WeaponType.beam: 
			
			length = phaserPoints.Count;
			break;
		case WeaponType.torpedo:
			length = torpedoPoints.Count;
			break;
		case WeaponType.pulse:
			length = pulsePoints.Count;
			break;
	}
	
	return length;

}