const jsdom = require("jsdom");
const {downloadFile} = require("../curseforge/download")

const url = "https://www.optifine.net/downloads"

const createUrl = (value) => `https://optifine.net/download?f=${value}`

function start(mcVersion) {
    fetch(url, {
        method: 'GET'
    })
        .then(res => res.text())
        .then(text => {
            const dom = new jsdom.JSDOM(text)

            let listOfVersion = Array.from(dom.window.document.getElementsByTagName('h2'))

            return listOfVersion.find((h2) => h2.textContent === `Minecraft ${mcVersion}`)
        })
        .then(replaceVersion => {
            replaceVersion.textContent = replaceVersion.textContent.replace('Minecraft ', '')
            return replaceVersion
        })
        .then(version => {
            let nextElement = version.nextElementSibling;

            while (nextElement) {
                if (nextElement.tagName === 'DIV') {
                    const table = nextElement.querySelector('table.downloadTable');
                    if (table) {
                        return table;
                    }
                }
                nextElement = nextElement.nextElementSibling;
            }
        })
        .then(table => table.querySelectorAll('tr')[0])
        .then(tr => {
            const nameOptifine = tr.querySelector('td.colFile').textContent;
            const mirrorOptifine = tr.querySelector('td.colMirror').querySelector('a').href
            const urlParams = new URLSearchParams('?' + mirrorOptifine.split('?')[1]);

            downloadFile(createUrl(urlParams.get('f')), nameOptifine+'.jar').then(() => {
                console.log('File by name ', nameOptifine, ' downloaded successfully');
            })
        })
}

start('1.21.4')
