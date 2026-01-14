export const parseSwapiUrl = (url) => {
    if (!url) return null;
    // Extract type and id from URL like https://swapi.py4e.com/api/people/1/
    // or https://swapi.dev/api/people/1/
    const matches = url.match(/\/api\/([a-z]+)\/(\d+)\/?$/);
    if (matches) {
        return {
            resource: matches[1],
            id: matches[2],
            path: `/${matches[1]}` // internal route path usually matches resource name
        };
    }
    return null;
};
