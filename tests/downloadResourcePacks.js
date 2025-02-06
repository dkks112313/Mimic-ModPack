const {downloadFile} = require('../curseforge/download')

const trueUrl = 'https://www.curseforge.com/minecraft/data-packs/cobbletowns'
const nameUrl = trueUrl.split('/').pop()

const version = '1.20.1'

const headers = {
    'Accept': 'application/json',
    'x-api-key': '$2a$10$E/QgiUN0Psj9GMRVOqG/keTZYX0FJWd7mnVUshlBaJawNwb6oqKrO'
};

fetch(`https://api.curseforge.com/v1/mods/search?gameId=432&slug=${nameUrl}`,
    {
        method: 'GET',
        headers: headers
    })
    .then(res => res.json())
    .then(body => body['data'][0]['id'])
    .then(id => {
        fetch(`https://api.curseforge.com/v1/mods/${id}/files?gameVersion=${version}`,
            {
                method: 'GET',
                headers: headers
            })
            .then((res) => res.json())
            .then((data) => data.data[0]['downloadUrl'])
            .then((url) => {
                const nameUrl = decodeURIComponent(url.split('/').pop());

                downloadFile(url, nameUrl).then(() => {
                    console.log('File downloaded successfully');
                }).catch(error => {
                    console.error('Error:', error);
                });
            })
    })
