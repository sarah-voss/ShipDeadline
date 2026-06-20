
export async function fetchData(urlToFetch) {
    const response = await fetch(urlToFetch);

    if (!response.ok) {
        throw new Error('request failed!');
    }

    return response.json();
}

