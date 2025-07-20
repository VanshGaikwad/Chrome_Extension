// storing selected text in chrome local storage

document.addEventListener('mouseup',()=>{
    const selectedText=window.getSelection().toString().trim()

    if(selectedText){
        chrome.storage.local.set({selectedText})
        chrome.runtime.sendMessage({action:'openPopup'})
    }
})