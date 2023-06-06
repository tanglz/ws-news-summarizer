import fetch from 'node-fetch'

const graphqlEndpoint = 'http://news-api.staging.iad.wealthsimple.com/api/graphql';

export async function fetchSecurityNews(securityId: string, from: string) {
    const query = `
    query fetchSecurityNews($securityId: String, $from: String) {
      securityNews(query: { ids: [$securityId], metadata: { from: $from } }) {
        title
        image
        url
        publishedAt
        source
        symbols
      }
    }
  `;

    const variables = {
        securityId: securityId,
        from: from
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    };

    try {
        const response = await fetch(graphqlEndpoint, requestOptions);
        const data: any = await response.json();
        return data.data.securityNews;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}