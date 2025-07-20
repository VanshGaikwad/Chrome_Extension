chrome.runtime.onMessage.addListener((request,sender,sendMessage)=>{
    if(request.action === 'openPopup'){
            chrome.action.openPopup()
    }
})