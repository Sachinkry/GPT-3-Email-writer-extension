
const insert = (content) => {
    // find calmly editor input section
    const elements = document.getElementsByClassName('droid');

    if(elements.length === 0) {
        return;
    }

    const element = elements[0];

    // grab the first p tag so we can replace it with our injection
    const pToRemove = element.childNodes[0];
    pToRemove.remove();

    // split content by \n
    const splitContent = content.split('\n');

    // wrap in p tags
    splitContent.forEach((content) => {
        const p = document.createElement('p');

        if(content === '') {
            const br = document.createElement('br');
            p.appendChild(br);
        } else {
            p.textContent = content;
        }
        
        // insert into HTML one at a time
        element.appendChild(p);
    })


    // On success return true
    return true;
}

// gmail insert
const insertIntoGmail = (content) => {
    // find the active element for the email body
    const activeElement = document.activeElement;
    const activeElementId = activeElement.id;
    const element = document.getElementById(activeElementId); 
    console.log(activeElementId, element);
    console.log(content);

    // element.textContent = content;
    //split content by \n
    const splitContent = content.split('\n');

    splitContent.forEach(content => {
        const div = document.createElement('div');

        if(content === '') {
            const br = document.createElement('br');
            div.appendChild(br);
        } else {
            div.textContent = content;
        }

        element.appendChild(div);
    })
    
}

// Listen for messages from the context menu service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { content } = request;
    // console.log(content);
    const result = insertIntoGmail(content);
    // if (request.message === 'inject') {
        
    //     if(!result) {
    //         sendResponse({ status: 'failed' });
    //     }

    //     sendResponse({ status: 'success' });
    // }
})