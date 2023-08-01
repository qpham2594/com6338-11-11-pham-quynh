const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

// allows programmer to chain function calls together while passing teh output from one function into the input of another
const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

// function is curried to take tag name as an argument and then return a function that takes its argument and nests it with the tag
// function can be used in various ways to create html elements
// ex. makeTag('h1')('hello world') => <h1>hello world</h1>
const makeTag = tag => str => `<${tag}>${str}</${tag}>`


// complete this function
// tried async and it became undefined, so no need to use async here since it's already applied with onclick function below
// fetched API within this function initially and repeatedly getting [object Promise] since there was no promise return; already fetched with onclick

const makePoemHTML = (poemApp) => {
  try {
    // makeTag for title of Poem
    const poemTitle = poemApp[0].title;
    const titleTag = makeTag('h2')(poemTitle);
    
    // makeTag for the author and em tags, used pipe here to have h3 wrapped around em (so em first follow by h3 in pipe), and then have content inside
    const author = poemApp[0].author;
    const emAndH3Tag = pipe(makeTag('em'), makeTag('h3'));
    const poemEmphasis = emAndH3Tag(`by ${author}`);
    
    // Using reduce method  that takes a callback function and the initial value
    // Object: stanzas and currentStanzas
    // Two parameters: stanzaBlock - accumulator, and line - element being processed
    // If the line is an empty string, then the stanza has done and it will join the lines with 'br' and wraps the stanza with 'p' tags
    // Then that stanza gets pushed to the 'stanzas' array and the 'currentStanza' get resets to make new stanza
    // If the line is not empty, then it gets added to the 'currentStanza' array
    // Reduce() will repeat this until the linesArray is done and then wrap everything around 'p' tags

    const linesArray = poemApp[0].lines;
    const poemStanzas = linesArray.reduce((stanzaBlock, line) => {
      if (line === "") {
        // If we encounter an empty line, join the current stanza lines and wrap with <p>
        if (stanzaBlock.currentStanza.length > 0) {
          const stanzaContent = stanzaBlock.currentStanza.join('<br>');
          stanzaBlock.stanzas.push(`<p>${stanzaContent}</p>`);
        }
        stanzaBlock.currentStanza = []; // Reset the current stanza lines
      } else {
        stanzaBlock.currentStanza.push(line); // Add the non-empty line to the current stanza
      }
      return stanzaBlock;
    }, { stanzas: [], currentStanza: [] });
    
    // Handling the last stanza in case the poem doesn't end with an empty line
    // Join with 'br' and push the last stanza to into 'stanzas'
    if (poemStanzas.currentStanza.length > 0) {
      const stanzaContent = poemStanzas.currentStanza.join('<br>');
      poemStanzas.stanzas.push(`<p>${stanzaContent}</p>`);
    }
    
    // Joining all of the stanzas to form the whole poem
    const wholePoem = poemStanzas.stanzas.join('');
    console.log(wholePoem)

    // Making a constant to combine tile, author, and lines together into one
    // Return the constant to display on DOM, otherwise will be undefined.
    const wholeHTML = titleTag + poemEmphasis + wholePoem;
    return wholeHTML
  
  } catch (error) {
    console.log('unable to get data', error);
  }
};

// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  // renders the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
