function spawn_meme() {
    var meme_container = document.getElementById("meme_container");
    var meme = document.createElement("img");

    meme.classList.add("meme");

    const meme_images = [
        "googleassets/eggdog.gif",
        "googleassets/dino.png",
        "googleassets/duck.png",
    ];
    const image = Math.floor(Math.random() * meme_images.length);
    meme.src = meme_images[image]; 

    if (Math.random() < 0.5) { // 50% chance of the shark moving from right to left
        meme.classList.add("right_meme");
    }
    else {
        meme.classList.add("left_meme");
    }

    if (Math.random() < 0.1) { // 20% chance of a rotating meme
        meme.classList.add("left_rotate_meme");
    }
    else if (0.1 < Math.random() < 0.2) { // 20% chance of a rotating meme
        meme.classList.add("right_rotate_meme");
    }

    // If the shark isn't captured
    meme.addEventListener("animationend", function() {
        this.remove();
    });

    meme_container.appendChild(meme);
}

function lucky() {
    for (let i=0; i<10; i++) {
        spawn_meme();
        spawn_meme();
        spawn_meme();
    }
}

function language() {
    window.location.href='https://translate.google.ca/?sl=en&tl=fr&text=Rick%20Roll&op=translate';

}

function google_search() {
    search = document.getElementById("search_bar").value;
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley');
    window.location.href="https://www.google.com/search?q=" + search;
}

// When the user presses the "Enter" key on the keyboard, submit the form to add a task
document.getElementById("search_bar").addEventListener("keyup", 
	function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			google_search();
		}
	}
);




setInterval(function(){ 
    spawn_meme();
}, 500);