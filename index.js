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
const makePoemHTML = async (poemApp) => {
  try {
    const AppData = await getJSON(poemURL);
    //const poemData = {tile, author, lines}
   // return poemData
    console.log(AppData[0]);

    const poemTitle = AppData[0].title;
    const titleTag = makeTag('h2')(poemTitle);
    console.log(titleTag)

    const author = AppData[0].author;
    const emAndH3Tag = pipe(makeTag('em'), makeTag('h3'));
    const poemEmphasis = emAndH3Tag(`by ${author}`);
    console.log(poemEmphasis)

    const linesArray = AppData[0].lines;
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
    
    // Handle the last stanza in case the poem doesn't end with an empty line
    if (poemStanzas.currentStanza.length > 0) {
      const stanzaContent = poemStanzas.currentStanza.join('<br>');
      poemStanzas.stanzas.push(`<p>${stanzaContent}</p>`);
    }
    
    // Join the stanzas to form the whole poem
    const wholePoem = poemStanzas.stanzas.join('');
    console.log(wholePoem)

    // Set the innerHTML of poemEl directly
    poemEl.innerHTML = titleTag + poemEmphasis + wholePoem;
  
  } catch (error) {
    console.log('unable to get data', error);
  }
};

// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  // renders the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
