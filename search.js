const headers = {
    'Accept': 'application/json',
    'x-api-key': '$2a$10$E/QgiUN0Psj9GMRVOqG/keTZYX0FJWd7mnVUshlBaJawNwb6oqKrO'
};

fetch(`https://api.curseforge.com/v1/mods/search?gameId=432`,
    {
        method: 'GET',
        headers: headers
    })
    .then(res => res.json())
    .then(body => console.log(body))
    //.then(body => body['data'][0]['categories'])
    //.then(categories => console.log(categories))