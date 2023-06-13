// Website flow ----------------------------- :-
// 1. input length-range & checkboxes
// 2. click on generate password
// 3. gerated password displayed on top, also strength displayed simultaneously
// 4. Now, password can be copied (this can be done anytime, before/after)



// Functions needed ------------------------------- :-

// copy of password
// slider-control
// password generate --> button click
// set indicator color
// calculate strength

// (needed for password generation) :-
// get random integers 
// get random uppercase
// get random lowercase
// get random symbols



// Fetching elements ------------------------------ :-

    // Custom attribute  --->  [attribute]
var passwordDisplay = document.querySelector('[data-passwordDisplay]');

var inputSlider = document.querySelector('[password-length-slider]');
var lengthDisplay = document.querySelector('[password-length-text');

var copyBtn = document.querySelector('[data-copy]');
var copyMsg = document.querySelector('[data-copyMsg]');

var uppercaseCheck = document.querySelector('#uppercase');
var lowercaseCheck = document.querySelector('#lowercase');
var numbersCheck = document.querySelector('#numbers');
var symbolsCheck = document.querySelector('#symbols');

var allCheckBox = document.querySelectorAll('input[type=checkbox]');

var indicator = document.querySelector('[data-indicator]');

var generateBtn = document.querySelector('[generate-btn]');



// Variables --------------------------------------- :-

var password = "";
var passwordLength = 10;
var checkCount = 0; // count of checked checkboxes
// A string of all symbols
const symbols = '~`!@#$%^&*()_-+={}[]|:;"<,>.?/';
// set circle color to grey (of indicator)



// Functions -------------------------------------- :-


// inputSlider  -> set password len ->  lengthDisplay
function handleSlider() {
    // set values
    inputSlider.value = passwordLength; 
    lengthDisplay.innerText = passwordLength;
    // Set the color of left & right side of dragger
    let minVal = inputSlider.min;
    let maxVal = inputSlider.max;
    let size = ((((passwordLength - minVal) * 100) / (maxVal - minVal))) + "% 100%";
    inputSlider.style.backgroundSize = size;
    console.log(size);
}

// set color/shadow --> based on password-strength
function setIndicator(color) {
    // Add color to div
    indicator.style.backgroundColor = color;
    // Add shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer -> [minVal, maxVal]
function getRandomInteger() {
    var num = Math.random(); // [0-1] --> float
    num = Math.floor(num*10); // [0-9] --> int
    return num;
}

// get random uppercase
function getRandomUppercase() {
    var num = 65 + Math.floor(Math.random() * 26); // [65, 90]
    return String.fromCharCode(num);
}

// get random lowercase
function getRandomLowercase() {
    var num = 97 + Math.floor(Math.random() * 26); // [97, 122]
    return String.fromCharCode(num);
}

// get random symbol
function getRandomSymbol() {
    var s = symbols.length;
    var num = Math.floor(Math.random() * s);
    // [0, s-1]
    return symbols.charAt(num);
}

// calculate password string
function calcStrength() {
    var hasUpper=false, hasLower=false, hasNum=false, hasSym=false;
    if(uppercaseCheck.checked) {
        hasUpper = true;
    }
    if(lowercaseCheck.checked) {
        hasLower = true;
    }
    if(numbersCheck.checked) {
        hasNum = true;
    }
    if(symbolsCheck.checked) {
        hasSym = true;
    }
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8) {
        setIndicator("#ff0000");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#00ff00");
    }
}

// copy password
async function copyPassword() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        // show the text "copied" on page
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    // active --> CSS class to add
    // to set timeout display of text :-
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// checkbox-change function
function handleCheckboxChange() {
    var cnt = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            cnt++;
        }
    })
    checkCount = cnt; // count updated
    // Boundary condition
    if(passwordLength < checkCount) {
        // more variety of chars demanded than length
        passwordLength = checkCount;
        handleSlider();
    }
    return checkCount;
}


var ans1 = getRandomInteger();
var ans2 = getRandomLowercase();
var ans3 = getRandomUppercase();
console.log(ans1 + ' ' + ans2 + ' ' + ans3);


// uses "Fisher Yates Method"
function shufflePassword(arr) {
    var ans = "";
    for(var i=arr.length-1; i>=0; i--) {
        var idx = Math.floor(Math.random() * (i+1)); // [0,i]
        // Take arr[idx] into string
        ans += arr[idx];
        // Discard arr[idx], by swapping with arr[i]
        var temp = arr[idx];
        arr[idx] = arr[i];
        arr[i] = temp;
    }
    return ans;
}


function generatePassword() {
    password = ""; // empty old password
    // First put all checkbox functions in an array
    var funcArr = [];
    if(uppercaseCheck.checked) {
        funcArr.push(getRandomUppercase);
    }
    if(lowercaseCheck.checked) {
        funcArr.push(getRandomLowercase);
    }
    if(numbersCheck.checked) {
        funcArr.push(getRandomInteger);
    }
    if(symbolsCheck.checked) {
        funcArr.push(getRandomSymbol);
    }
    // compulsory addition
    for(var i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    // remaining addition
    for(var i=0; i<(passwordLength-funcArr.length); i++) {
        var idx = Math.floor(Math.random() * funcArr.length);
        password += funcArr[idx]();
    }
    // shuffle the password
    password = shufflePassword(Array.from(password));
    // password generated ------------------ :-
    passwordDisplay.value = password;
    // password displayed ------------------ :-
    calcStrength();
}



// Function calls (at page loading) ---------------- :-

handleSlider();
setIndicator("#ccc");


// Adding Eventlisteners ---------------- :-

// on change --> update password length & slider
inputSlider.addEventListener('input', (e) => {
    // input ==> event denoting any changes in value.
    passwordLength = e.target.value;
    handleSlider();
});

// on click --> copy password to clipboard
copyBtn.addEventListener('click', (e) => {
    if(passwordLength != 0) {
        copyPassword();
    }
    // Else no need to copy..
});

// on click --> generates a new password
generateBtn.addEventListener('click', (e) => {
    if(checkCount == 0) {
        return;
    }
    else if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // Now going to find new password
    generatePassword();
});

for(var i=0; i<allCheckBox.length; i++) {
    allCheckBox[i].addEventListener('change', handleCheckboxChange);
}