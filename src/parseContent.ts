import {PlaywrightWebBaseLoader} from "langchain/document_loaders/web/playwright";
import {JSDOM} from "jsdom";
import {Readability} from "@mozilla/readability";
// @ts-ignore
import Parser from '@postlight/parser';

export async function parseContentByPlaywright(url: string) {
    const loader = new PlaywrightWebBaseLoader(url,
        {
            launchOptions: {
                headless: true,
            },
        }
    );

    const docs = await loader.load();
    const dom = new JSDOM(docs[0].pageContent);
    var article = new Readability(dom.window.document).parse();
    // @ts-ignore
    var content = new Readability(dom.window.document).parse().textContent;
    return content;
};

export async function parseContentByPostlight(url: string) {
    // @ts-ignore
    let result = await Parser.parse(url, { contentType: 'text' });
    return result.content;
};
