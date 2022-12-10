
// this function checks if the user's local storage has a key saved 
// and it returns a promise that either resolves with the key or rejects if no api key is found
const checkForKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            resolve(result['openai-key']);
        })
    })
}

// this function gets the api key from the input field and saves it to the user's local storage after encoding it
const saveKey = () => {
    const input = document.getElementById('key_input');

    if(input) {
        const { value } = input;

        // encode string
        const encodedValue = btoa(value);

        // save to google storage
        chrome.storage.local.set({ 'openai-key': encodedValue}, () => {
            document.getElementById('key_needed').style.display = 'none';
            document.getElementById('key_entered').style.display = 'block';
        });
    }
}

// this function is called when the user clicks the change key button
const changeKey = () => {
    document.getElementById('key_needed').style.display = 'block';
    document.getElementById('key_entered').style.display = 'none';
}

document.getElementById('save_key_button').addEventListener('click', saveKey);

document.getElementById('change_key_button').addEventListener('click', changeKey);


// function would be called everytime the popup is opened to determine which view to show
checkForKey().then((response) => {
    if(response) {
        document.getElementById('key_needed').style.display = 'none';
        document.getElementById('key_entered').style.display = 'block';
    }
})