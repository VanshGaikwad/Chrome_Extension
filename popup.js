
const generatePrompt = (query) => {
    const prompt = `    Hey Gemini, 
    
    I have a word, sentence, or paragraph that I would like you to analyze. Here's the input:
    
    Input: ${query}
    
    Please provide the analysis in JSON format with the following structure and details:
    
    1. Meaning: 
       - The meaning or interpretation of the input (word, sentence, or paragraph).
       
    2. Words:
       - A breakdown of the individual words used in the input.
       - For each word, include:
         - Meaning: The definition of the word.
         - Synonyms: A list of similar words.
         - Antonyms: A list of opposite words.
         - Example: A sample sentence using the word.
    
    3. Idiom (if applicable): 
       - Identify any idioms present in the input.
       - Include:
         - Phrase: The idiom itself.
         - Meaning: The interpretation of the idiom.
         - Example: A sample sentence using the idiom.
    
    4. Phrase (if applicable):
       - Identify any notable phrases in the input.
       - Include:
         - Phrase: The phrase itself.
         - Meaning: The interpretation of the phrase.
         - Example: A sample sentence using the phrase.
    
    ### Expected JSON Output:
     
    {
        "sentence": "Encourages users to practice sentence",
        "meaning": "This sentence suggests motivating individuals to engage in practicing sentences to improve skills.",
        "words": [
            {
                "word": "Encourages",
                "meaning": "To give someone support, confidence, or hope.",
                "synonyms": ["Inspire", "motivate", "support"],
                "antonyms": ["Discourage", "deter", "dishearten"],
                "example": "The teacher encourages students to participate in class discussions."
            },
            {
                "word": "Practice",
                "meaning": "The act of doing something repeatedly to improve.",
                "synonyms": ["Rehearse", "train", "drill"],
                "antonyms": ["Neglect", "ignore", "abandon"],
                "example": "She practices the piano every evening."
            },
            {
                "word": "Sentence",
                "meaning": "A set of words that conveys a complete thought.",
                "synonyms": ["Phrase", "clause", "statement"],
                "antonyms": ["Word fragment"],
                "example": "He wrote a sentence on the board."
            }
        ],
        "idiom": [{
            "phrase": null,
            "meaning": null,
            "example": null
         }],
        "phrase": [{
            "phrase": null,
            "meaning": null,
            "example": null
        }]
    }
     
    ### Notes for Gemini:
    - Ensure the output strictly adheres to the JSON structure for easy parsing.
    - If an idiom or phrase is not present in the input, then make them an empty array.
    - Keep definitions concise and easy to understand.
    - Avoid overly complex language or ambiguous results.

`
    return prompt

}


const renderResult=(result)=>{
    let html=''
    // setting query html
    html+=` <div class="mb-3 border-bottom pb-3">
                <h2>Query: </h2>
                <p class="p-0 m-0" id="query">${result.sentence}</p>
            </div>`
    // adding sentence meaning
    html+=`<h2 class="text-success">Result: </h2>
            <div>
                <p id="meaning"><b>Meaning:</b>${result.meaning}</p>
            </div>`
            
    // creating html forwords
    html+=`<h5 class="text-primary">Words</h5>`
    let wordHtml=''
    if(result.words && result.words.length>0){
        result.words.forEach(singleWord => {
            wordHtml +=`
            <div class="mb-3">
                <h6 class="m-0 p-0 text-capitalize">${singleWord.word}</h6>
                <p class="p-0 m-0">${singleWord.meaning}</p>
                <p class="p-0 m-0"><b class="text-secondary">Example: </b> ${singleWord.example}</p>
                <p class="p-0 m-0"><b class="text-secondary">Synonyms: </b> ${singleWord.synonyms.join()}</p>
                <p class="p-0 m-0"><b class="text-secondary">Antonyms: </b>  ${singleWord.antonyms.join()}</p>
            </div>`
        });
    }
    else{
        wordHtml+=`<p>No words</p>`
    }
        html+=wordHtml

    // creating idioms html
    html+=` <h5 class="text-primary">Idioms</h5>`
    let idiomHtml=''
    if(result.idiom && result.idiom.length>0){
        result.idiom.forEach(idiom => {
            idiomHtml +=`
            <div class="mb-3">
                <h6 class="m-0 p-0 text-capitalize">${idiom.phrase}</h6>
                <p class="p-0 m-0">${idiom.meaning}</p>
                <p><b class="text-secondary">Example: </b>${idiom.example}</p>
            </div>`
        });
    }
    else{
        idiomHtml+=`<p>No idiom</p>`
    }

     html+=idiomHtml
     // creating phrase html
    html+=` <h5 class="text-primary">Phrase</h5>`
    let phraseHtml=''
    if(result.phrase && result.phrase.length>0){
        result.phrase.forEach(phrase => {
            phraseHtml +=`
            <div class="mb-3">
                <h6 class="m-0 p-0 text-capitalize">${phrase.phrase}</h6>
                <p class="p-0 m-0">${phrase.meaning}</p>
                <p><b class="text-secondary">Example: </b>${phrase.example}</p>
            </div>`
        });
    }
    else{
        phraseHtml+=`<p>No phrase</p>`
    }
  html+=phraseHtml



   
  
    return html

}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.details-container').innerHTML = "<h6>Gathering Information....</h6>"

    chrome.storage.local.get('selectedText', async ({ selectedText }) => {
        // enter your api key
        const API_KEY = "Your API KEY";
        const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
        const prompt = generatePrompt(selectedText)

        if (selectedText) {
            const response = await fetch(API_ENDPOINT, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                            "parts": [{"text": prompt
                                }]
                        }]
                })


            });
            const apiData=await response.json()
            // get text/json string from api response
            const jsonString =apiData.candidates[0].content.parts[0].text
            // removing ```json and ``` from json string 
              const filteredJsonString = jsonString.replace(/```json|```/g, '')
            
            // converting json string into json object
             const result = JSON.parse(filteredJsonString) 
            
           const outputhtml=renderResult(result)

             document.querySelector('.details-container').innerHTML =outputhtml
            
            
            
        } else {
            document.querySelector('.details-container').innerHTML = "<h6>Nothig to show....</h6>"
        }
    })
})