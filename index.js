// Taking DOM elements
const finalday = document.getElementById("day");
const finalhour = document.getElementById("hour");
const finalminute = document.getElementById("minute");
const finalsecond = document.getElementById("second");

const container = document.querySelector(".container");
const custom = document.querySelector(".custom");

const btn = document.getElementById("btn");
const date = document.getElementById("date");
const heading = document.getElementById("heading");
const text = document.getElementById("text");

// Creating an event listener of button
btn.addEventListener("click", () => {
    text.innerHTML = heading.value;
    container.classList.remove("hidden");
    custom.classList.add("hidden");
});

// Creating the countdown function
function countdown(){
    const newdate = new Date(date.value);
    const currenttime = new Date();

    const timeleft = (newdate - currenttime)/1000;

    const days = Math.floor(timeleft/3600/24);
    const hours = Math.floor(timeleft/3600)%24;
    const minutes = Math.floor(timeleft/60)%60;
    const seconds = Math.floor(timeleft)%60;

    finalday.innerHTML = days; 
    finalhour.innerHTML = update(hours);
    finalminute.innerHTML = update(minutes);
    finalsecond.innerHTML = update(seconds);
};

// setting the default time to zero
function update(time){
    if( time < 10 ){
        return '0'+time ;
    }
    else{
        return time;
    }
};

// countdown starts
setInterval(countdown,1000);