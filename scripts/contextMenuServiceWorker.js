

const sendMessage = (content) => {
    // this function sends a message to the content script to inject the generated text into the email editor
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // get the active tab
        const activeTab = tabs[0].id;

        // send message to content script
        chrome.tabs.sendMessage(
            activeTab,
            {message: 'inject', content},
            (response) => {
                if(response.status === 'failed') {
                    console.log('injection failed.')
                }
            }
        )  
    });
}

const getKey = () => {
    // this function checks if the user's local storage has a key saved and 
    // it returns a promise that either resolves with the key or rejects if no api key is found
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if(result['openai-key']) {
                // decode the key
                const decodedKey = atob(result['openai-key']);
                // resolve with the decoded key
                resolve(decodedKey);
            }
        });
        
    });
};

const generate = async (prompt) => {
    // get your api key from storage
    const key = await getKey();
    
    // url for completions endpoint
    const url = 'https://api.openai.com/v1/completions';

    // call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 430,
            temperature: 0.7,
        }),
    });

    // get the response
    const completion = await completionResponse.json();
    console.log(completion);
    return completion.choices.pop();
}

const generateCompletionAction = async (info) => {
    try {
        const { selectionText } = info;
        const basePromptPrefix = `You are an email writer bot, who writes email with the given properties on a subject. The email should contain\n1. A new clear subject line that accurately reflects the content of the email.\n2. A professional greeting.\n3. The main body of the email, which provides the necessary information or details in a logical and easy-to-follow manner.\n4. Provide a little more information on the main body with bullet points.\n5. A call to action, asking the recipient to reply or providing them with next steps, then a closing\nAdditionally, a good email should be well-written and free of grammar and spelling errors. It should also be formatted in a way that is easy to read, with appropriate use of paragraphs, bullet points, and other formatting tools as needed. Do a sentiment analysis of the email.\n`

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`)

        // send the output when we're all done
        sendMessage(baseCompletion.text);
        console.log('selection text', baseCompletion.text);
    } catch (error) {
        console.error(error);

        // in case there is some error
        sendMessage(error.toString());
    }
}

// an event that listens for when the extension is installed
// and if yes, it creates a context menu item with the given id, title and contexts
// the context menu item would be visible when the user selects a text on a webpage
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Generate Email',
        contexts: ['selection' ],
    });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);