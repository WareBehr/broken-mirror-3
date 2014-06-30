﻿using UnityEngine;
using System.Collections;

public class ChangeSceneOnFinish : MonoBehaviour
{

		public Animation animation;
		public string destinyScene;
		public float wait;

		// Use this for initialization
		void Start ()
		{
				animation = gameObject.GetComponent<Animation> ();
		}
	
		// Update is called once per frame
		void Update ()
		{
				if (canTerminate ()) {
						StartCoroutine (terminate ());
				}
	
		}

		private bool canTerminate ()
		{
				return !animation.isPlaying || Input.GetKey (KeyCode.Escape);

		}

		private IEnumerator terminate ()
		{
				yield return new WaitForSeconds (wait);
				Application.LoadLevel (destinyScene);
		}
}