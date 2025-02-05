const {downloadFile} = require('./download')

const url = 'https://www.curseforge.com/minecraft/modpacks/all-the-mods-10'
const nameUrl = url.split('/').pop()

const headers = {
    'Accept': 'application/json',
    'x-api-key': '$2a$10$E/QgiUN0Psj9GMRVOqG/keTZYX0FJWd7mnVUshlBaJawNwb6oqKrO'
};

async function fetchModpackInfo(modId) {
    const url = `https://api.curseforge.com/v1/mods/${modId}/files`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

fetch(`https://api.curseforge.com/v1/mods/search?gameId=432&slug=${nameUrl}`,
    {
        method: 'GET',
        headers: headers
    })
    .then((res) => res.json())
    .then((body) => body['data'][0]['id'])
    .then((id) => {
        fetchModpackInfo(id)
            .then(data => {
                const url = data.data[0]['downloadUrl']
                const nameUrl = decodeURIComponent(url.split('/').pop());

                downloadFile(url, nameUrl).then(() => {
                    console.log('File downloaded successfully');
                }).catch(error => {
                    console.error('Error:', error);
                });
            })
    })
