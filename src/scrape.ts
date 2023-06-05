import {CheerioWebBaseLoader} from "langchain/document_loaders";

export async function scrape(url: string) {
    const loader = new CheerioWebBaseLoader(
        url
    );
    const htmls = await loader.load();
    const html = htmls[0];
    const content = html.pageContent;
    console.log(content);
    return content;
}
