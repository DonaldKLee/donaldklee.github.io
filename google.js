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

// Spawn memes at a faster rate (1 every 10ms), and then ends the interval after 100 memes are spawned
function lucky() { 
    let i = 0;
    setInterval(function() {  
        i++;
        if (i > 100) {
            return;
        }
        spawn_meme();
      }, 50)
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



search_placeholders = ["How can I get 8 hours of sleep in 5 hours?", "Why is the Earth round?", "What are some good dad jokes?","What are some good puns?" , "How can I annoy my friends?"]
const placeholder = Math.floor(Math.random() * search_placeholders.length);
document.getElementById("search_bar").placeholder = search_placeholders[placeholder]; 

setInterval(function(){ 
    spawn_meme();
}, 500);

setTimeout(lucky, 5000); 