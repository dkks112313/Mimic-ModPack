
const headers = {
    'Accept': 'application/json',
    'x-api-key': '$2a$10$E/QgiUN0Psj9GMRVOqG/keTZYX0FJWd7mnVUshlBaJawNwb6oqKrO'
};

fetch(`https://api.curseforge.com/v1/mods/1128348`,
    {
        method: 'GET',
        headers: headers
    })
    .then(res => res.json())
    .then(body => console.log(body))
