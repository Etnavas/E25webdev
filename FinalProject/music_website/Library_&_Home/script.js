// declaring variables 
let track_art = document.querySelector('.trackArt');
let track_name = document.querySelector('.trackName');
let track_artist = document.querySelector('.trackArtist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

//keeps track of the current song being played
let track_index = 0;
//indicates whether a track is currently playing or not. 
// It toggles between true and false.
let isPlaying = false;
//determines if the tracks should be played in a random order.
//  When set to true, the player will shuffle the playlist.
let isRandom = false;
let updateTimer;

//array of songs
const music_list = [
    {
        img : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/coverArt/98439.jpeg',
        name : 'Crazy In Love',
        artist : 'Beyonce,ft.JAY Z', 
        music : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/MusicFiles/CrazyInLove.mp3',
        genre : 'Pop',
    },

    {
        img : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/coverArt/Beyonce_-_Halo.png',
        name : 'Halo',
        artist : 'Beyonce', 
        music : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/MusicFiles/Beyoncé - Halo 4.mp3',
        genre : 'Pop',
    },

    {
        img : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/coverArt/1900x1900-000000-80-0-0.jpg',
        name : "Breakin' Dishes",
        artist : 'Rihanna',
        music : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/MusicFiles/BreakinDishes.mp3',
        genre : 'Pop',
    },

    {
        img : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/coverArt/0x1900-000000-80-0-0.jpg',
        name : 'Please Please Please',
        artist : 'Sabrina Carpenter',
        music : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/MusicFiles/Sabrina Carpenter - Please Please Please (Lyric Video) 4.mp3',
        genre : 'Pop',
    },

    {
        img : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/coverArt/500x500.jpg',
        name : 'Messy',
        artist : 'Lola Young',
        music : '/Users/pigeons/Desktop/Webdev-stuff/E25webdev/FinalProject/music_website/Library_&_Home/MusicFiles/Lola Young - Messy (Official Video) 4.mp3',
        genre : 'Pop',
    }
];

//manages the loading of music tracks from an array
//updates elements to reflect the currently playing track

//initiates the loading of a track based on the provided index.
loadTrack(track_index);

function loadTrack(track_index){
    //stops any existing timer that updates the playback progress.
    clearInterval(updateTimer);
    //reset any previous states or elements before loading a new track
    reset();

    //sets the audio source to the selected track
    curr_track.src = music_list[track_index].music;
    //loads the new audio source
    curr_track.load();

    //changes the background image to the album art of the current track.
    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";

    //update the respective elements with the track's name, artist, and current playing status
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    
    //starts a timer that calls the setUpdate function every second to update the playback progress
    updateTimer = setInterval(setUpdate, 1000);
    //adds an event listener that triggers the nextTrack function when the current track finishes playing
    curr_track.addEventListener('ended', nextTrack);

}

function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}
//used to determine if the random playback is active.
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}

//randomTrack checks the state of isRandom and either 
// pauses or plays the random track.
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}


function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    playpause_btn.innerHTML = '<i class="fa-solid fa-circle-play fa-flip-vertical fa-2xl"></i>';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    playpause_btn.innerHTML = '<i class="fa-solid fa-circle-play fa-flip-vertical fa-2xl"></i>';
}

function nextTrack(){
    // If the current track_index is less than the last index of music_list, and isRandom is false, 
    // it simply increments the track_index by 1
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    //If isRandom is true, it generates a random index within the bounds of music_list and assigns it to track_index
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    //If the current track is the last one, it resets track_index to 0, starting the playlist over
    }else{
        track_index = 0;
    }
    //it calls loadTrack(track_index) to load the new track and playTrack() to start playing it
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}

//find why the song progress bar wont work
function setUpdate(){
    //position in the media track that the user can drag to 
    // seek to a different part of the track

    //begins by initializing seekPosition to zero
    let seekPosition = 0;
    //checks if curr_track.duration is a valid number using isNaN()
    if(!isNaN(curr_track.duration)){

        //seek position is calculated as a percentage of the current time relative to the total duration
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        //The current playback time is divided by 60 to convert seconds into minutes
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        //The remaining seconds are calculated by subtracting the total minutes (in seconds) from the current time.
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        //calculations are performed for the total duration of the media track
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        //Each time value (minutes and seconds) is checked to see if it is less than 10. 
        // If so, a leading zero is added to ensure a consistent two-digit format 
        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        //total length of the media track
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;

        //The function starts by declaring seekPosition and setting it to 0.
        //checks if curr_track.duration is a number using isNaN(). If it's valid, the function proceeds.
        //The seek position is calculated as a percentage of the current time relative to the total duration.
        //The current time and total duration are converted from seconds to a MM:SS format,
        //this is done using Math.floor() to get whole minutes and seconds.
        //If the seconds or minutes are less than 10, a leading zero is added for better readability.
        //the function updates the text content of curr_time and total_duration elements to display the formatted time.
    }

}