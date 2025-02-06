const AdmZip = require("adm-zip")
const path = require("path");
const {move} = require('fs-extra');
const fs = require("fs");

const {downloadFile} = require('./download')

/*
* classId:
* 6 - mods
* 6552 - shaders
* 4471 - mod packs
* 6945 - data packs
* 12 - resource packs
* 17 - worlds
*/

const url = 'https://www.curseforge.com/minecraft/modpacks/all-the-mods-10'
const nameUrl = url.split('/').pop()

const version = '1.21'
const select_mode = {
    'Forge': 1,
    'Fabric': 4,
    'Quilt': 5,
    'NeoForge': 6
}

const rootPath = 'C:\\Users\\ovcha\\web-launcher\\untitled10\\'
const entityMinecraft = {
    mode: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\mods',
    resources: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\resourcepacks',
    //data: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\resourcepacks',
    world: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\saves',
    screen: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\screenshots',
    shaders: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\shaderpacks',
    //textures: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\texturepacks',
    server: 'C:\\Users\\ovcha\\web-launcher\\untitled10\\.Minecraft\\server-resource-packs'
}

Object.values(entityMinecraft).forEach(data => {
    if (!fs.existsSync(data)) {
        fs.mkdirSync(data);
    }
})

function zipExtract(nameArchive) {
    const zipArchive = new AdmZip(path.join(rootPath, nameArchive))
    zipArchive.extractAllTo(rootPath, true)
}

function zipDelete(nameArchive) {
    fs.unlink(path.join(rootPath, nameArchive), (err) => {
    })
}

const headers = {
    'Accept': 'application/json',
    'x-api-key': '$2a$10$E/QgiUN0Psj9GMRVOqG/keTZYX0FJWd7mnVUshlBaJawNwb6oqKrO'
};

async function fetchModpackInfo(modId) {
    const url = `https://api.curseforge.com/v1/mods/${modId}/files?gameVersion=${version}&modLoaderType=${select_mode['NeoForge']}`;

    const response = await fetch(url, {headers});
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

function downloadMode(modId, fileId) {
    fetch(`https://api.curseforge.com/v1/mods/${modId}`,
        {
            method: 'GET',
            headers: headers
        })
        .then((res) => res.json())
        .then((data) => data.data['classId'])
        .then((classId) => {
            fetch(`https://api.curseforge.com/v1/mods/${modId}/files/${fileId}`,
                {
                    method: 'GET',
                    headers: headers
                })
                .then(res => res.json())
                .then(data => data.data['downloadUrl'])
                .then(url => {
                    if (url !== null) {
                        const nameUrl = decodeURIComponent(url.split('/').pop());

                        let pathToDownload;
                        switch (classId) {
                            case 6:
                                pathToDownload = entityMinecraft.mode
                                break;
                            case 6552:
                                pathToDownload = entityMinecraft.shaders
                                break;
                            case 6945:
                                pathToDownload = entityMinecraft.resources
                                break;
                            case 12:
                                pathToDownload = entityMinecraft.resources
                                break;
                            case 17:
                                pathToDownload = entityMinecraft.world
                                break;
                            default:
                                pathToDownload = ''
                        }

                        downloadFile(url, path.join(pathToDownload, nameUrl)).then(() => {
                            console.log('File downloaded successfully');
                        }).catch(error => {
                            console.error('Error:', error);
                        });
                    }
                })
        })
}

fetch(`https://api.curseforge.com/v1/mods/search?gameId=432&slug=${nameUrl}`,
    {
        method: 'GET',
        headers: headers
    })
    .then(res => res.json())
    .then(body => body['data'][0]['id'])
    .then(id => {
        fetchModpackInfo(id)
            .then(data => {
                const url = data.data[0]['downloadUrl']
                const nameUrl = decodeURIComponent(url.split('/').pop());

                downloadFile(url, nameUrl).then(() => {
                    console.log('File downloaded successfully');
                })
                    .then(() => zipExtract(nameUrl))
                    .then(() => zipDelete(nameUrl))
                    .then(() => {
                        const jsonObj = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

                        for (const modeObj of jsonObj['files']) {
                            downloadMode(modeObj['projectID'], modeObj['fileID'])
                        }
                    })
                    .then(() => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                            }, 4000);
                        });
                    })
                    .then(() => {
                        const paths = path.join(rootPath, 'overrides')
                        if (fs.existsSync(paths)) {
                            fs.promises.readdir(paths, {recursive: false})
                                .then(files =>
                                    files.forEach(folder => {
                                        move(path.join(paths, folder), path.join(rootPath, '.Minecraft', folder))
                                    })
                                )
                        }
                    })
            })
    })
