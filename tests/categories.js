
const headers = {
    'Accept': 'application/json',
    'x-api-key': '$2a$10$E/QgiUN0Psj9GMRVOqG/keTZYX0FJWd7mnVUshlBaJawNwb6oqKrO'
};

fetch(`https://api.curseforge.com/v1/mods/1039434`,
    {
        method: 'GET',
        headers: headers
    })
    .then((res) => res.json())
    .then((data) => console.log(data.data['classId']))
