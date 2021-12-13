export function getUserByLogin(username)
{
    return fetch(`https://api.github.com/uses/${username}`)
    .then(function(response) {
        if (response.status >= 400) {
            return 0
        }
        return response.json();
    })
}
