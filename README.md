# STAGE_OTT_ASSIGNMENT
Instagram Stories assignment for Stage 


**LIVE LINK** https://insta-stageott.netlify.app/ </br> </br>
Hello! Sorry I could not finish this earlier. I had a busy Sprint and had plans to travel to Mumbai for Lollapalooza ( here right now! ). I was able to find a few hours to do this though  

Feature implemented. 

- Only built for mobile.
- Stories fetched from an external file.
- Multiple stories with scrollable bar.
- Can start viewing from anywhere in the list.
- Stories automatically progress to the next one after 5 second. Progress bar follows the same.
- User can manually navigate through the stories by clicking on the left side or the right side of the screen.
- Completely viewed story will be placed at the end. SORTING BASED ON VIEWED STORY.

Feature not implemented

- Swipe down to close the story. ( Can use onTouchMove and keep dimensions with timestamp). 
- Slightly better styling and transitions? (Subjective 😂)

Design choices

- Straight forward modular component based design.
- Avoid css for animation. Simpler states. 
- Use context to avoid prop drilling and unecessary re-renders on random state changes.
- A lot of DOM recyling.
- Preload images to improve speed. (Removed to make it a bit more realistic - check commit to index.html)

Design choices in a more realistic scenario with a backend
- Lazy loading stories that are not in view.
- AGRESSIVE preloading of stories based on the users actions. (Load when approaching a story)
- Optimized image formats like webp/svg along with device based resolution and sizing.
- Observer API to have viewport based loading
- We can also use web workers to off load some image processing tasks, if required?

**HOME PAGE** </br>


<img width="321" alt="image" src="https://github.com/user-attachments/assets/91b05529-34f8-4270-abe1-91b57d58ec5a" />

</br>
</br>
</br>

**STORY VIEWER** </br>
<img width="320" alt="image" src="https://github.com/user-attachments/assets/16ba37a1-8901-42e0-82b0-ea6cb91346dd" />
