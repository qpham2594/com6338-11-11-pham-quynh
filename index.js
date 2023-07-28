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
/*
const titleTag = makeTag('h1')
const emTag = makeTag('em')
const authorTag = makeTag ('h3')
const stanzaTag = makeTag ('div')
const linesTag = makeTag ('p')
const linebreak = makeTag ('br') */

// complete this function
//  Will accept API and output a single string of html
// String should consist of h2 element for title, em element "by" and h3 element with author's name, p element for each stanza separated by <br>
// Last line in each paragraph does NOT contain a linebreak element after it

// Must use makeTag adn pipe at least once, can also use split, join, and map to make short work of separating poem into stanzas and inserting linebreaks
// "" to separate stanzas 

// div 'poem' to h2 to h3 to em within h3, to p follow by linebreak after each line except the last line
const makePoemHTML = async (poemApp) => {
  
  try {
    const AppData = await getJSON(poemURL);
    const stringJSON = JSON.stringify(AppData)
    console.log(AppData)
    console.log(stringJSON)
    return poemHTML(AppData)

    //const splitJSON = stringJSON.split()
    //console.log(typeof(splitJSON))
    //eturn stringJSON
    
  } catch (error) {
    console.log('unable to get data', error)
    return ''
  }

  const poemHTML = (poemData) => {
    const poemHTMLStrings = poemData.map(({title, author, lines}) => {
      const blockHTML = lines.map(makeTag('p')).join('br');
      return `${makeTag('h2')(title)}${makeTag('h3')(`by ${author}`)}${blockHTML}`
    });
  
    return poemHTMLStrings.join('')
  }
}





// attach a click event to #get-poem
getPoemBtn.onclick = async function() {
  // renders the HTML string returned by makePoemHTML to #poem
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}
