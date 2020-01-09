const fs = require('fs')
const path = require('path');
const axios = require('axios')
const core = require('@actions/core');
const { GITHUB_REF } = process.env
const API_ENDPOINT = 'https://api.nosto.com/recommendation'

function getMainPath() {
    const githubPath = '/github/workspace';
    return path.join(githubPath, core.getInput('template-directory'))
}

function getTemplateId(dir) {
    if (GITHUB_REF.toString().startsWith('refs/heads')) {
        const branch = GITHUB_REF.toString().replace('refs/heads/', '')
        return `${branch}-${dir}`
    }
    return dir
}

/**
 * Build JSON object to represent Velocity template data
 *
 * @param pathName
 * @returns
 */
function getFilesContent(pathName) {
    return {
        template_html: getContents(pathName, 'markup.html'),
        template_id: getTemplateId(path.basename(pathName)),
        form_schema: JSON.parse(getContents(pathName, 'schema.json')),
        form_values: JSON.parse(getContents(pathName, 'value.json'))
    };
}

/**
 * Read content from a specific file
 *
 * @param dirName
 * @param fileName
 * @returns {string} content
 */
function getContents(dirName, fileName) {
    return fs.readFileSync(path.join(dirName, fileName), 'utf8', (err, data) => {
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
        baseURL: API_ENDPOINT,
        timeout: 60000,
        auth: {
            username: '',
            password: core.getInput('nosto-token')
        },

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
function iterate() {
    const mainPath = getMainPath();
    fs.readdirSync(mainPath)
        .map(dir => path.join(mainPath, dir))
        .filter(path => fs.statSync(path).isDirectory())
        .map(dir => {
            console.log(`Parsing templates from ${dir}`)
            return getFilesContent(dir)
        })
        .forEach(payload => {
            console.log(`Posting template ${payload.template_id}`)
            postTemplates(payload)
        })
}

iterate()