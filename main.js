const fs = require('fs')
const path = require('path');
const axios = require('axios')

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
        form_schema: JSON.parse(getContents(dirName,'schema.json')),
        form_value: JSON.parse(getContents(dirName,'value.json'))
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
    return fs.readFileSync(`./templates/${dirName}/${fileName}`, 'utf8', (err, data) => {
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
        baseURL: 'localhost:9000/api/',
        timeout: 1000,
        headers: {'Authorization': ''}
    });
    instance.post('experiences', payload)
        .then(resp => console.log(resp))
        .catch(err => console.log(err))
}

/**
 * Iterate through directories
 * Read content
 * Send data to Nosto
 */
function iterate(){
    const mainPath = './templates/';
    let arr = [];
    fs.readdirSync(mainPath)
        .map(dir => path.join(mainPath, dir))
        .filter(path => fs.statSync(path).isDirectory())
        .forEach(dir => arr.push(getFilesContent(dir.split('/')[1])))

    arr.forEach(payload => postTemplates(payload))
}

iterate()