const fs = require('fs')
const path = require('path');
const axios = require('axios')
const core = require('@actions/core');

function getMainPath() {
    const githubPath = '/github/workspace';
    return path.join(githubPath, core.getInput('template-directory'))
}

/**
 * Build JSON object to represent Velocity template data
 *
 * @param dirName
 * @returns
 */
function getFilesContent(dirName) {
    return {
        template_html: getContents(dirName,'markup.html'),
        template_id: dirName,
        // form_schema: JSON.parse(getContents(dirName,'schema.json')),
        // form_value: JSON.parse(getContents(dirName,'value.json'))
    };
}

/**
 * Read content from a specific file
 *
 * @param dirName
 * @param fileName
 * @returns {string} content
 */
function getContents(dirName, fileName){
    const mainPath = getMainPath()
    return fs.readFileSync(`${mainPath}/${dirName}/${fileName}`, 'utf8', (err, data) => {
        if (err) throw err;
        return data;
    })
}

/**
 * Make POST API call
 *
 * @param payload
 */
function postTemplates(payload) {
    const instance = axios.create({
        baseURL: 'https://shopify.dev.nos.to/api',
        timeout: 1000,
        headers: {'Authorization': core.getInput('NOSTO_API_TOKEN')}
    });
    instance.post('experiences', payload)
        .then(resp => console.log(resp))
        .catch(err => console.log(err.message))
}

/**
 * Iterate through directories
 * Read content
 * Send data to Nosto
 */
function iterate(){
    console.log('Template input: ' + core.getInput('template-directory'))
    let arr = [];
    const mainPath = getMainPath();
    fs.readdirSync(mainPath)
        .map(dir => {
            path.join(mainPath, dir)
            console.log(path.join(mainPath, dir))
        })
        // .filter(path => fs.statSync(path).isDirectory())
        // .forEach(dir => {
        //     let dirSplit = dir.split('/');
        //     arr.push(getFilesContent(dirSplit[dirSplit.length-1]))
        // })

    console.log(arr)
    // arr.forEach(payload => postTemplates(payload))
}

iterate()