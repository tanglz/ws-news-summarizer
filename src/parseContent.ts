import {PlaywrightWebBaseLoader} from "langchain/document_loaders/web/playwright";
import {JSDOM} from "jsdom";
import {Readability} from "@mozilla/readability";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

export async function parseContent(url: string) {
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
}