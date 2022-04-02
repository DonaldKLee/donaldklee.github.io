function spawn_duck() {
    
}

function spawn_meme() {

}



function rickroll_clicked() {
    window.location.href='https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
}

function google_search() {
    search = document.getElementById("search_bar").value;
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
}, 1000);