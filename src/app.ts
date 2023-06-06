import { OpenAI, PromptTemplate } from "langchain";
import { ChatOpenAI } from "langchain/chat_models";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";

import * as dotenv from "dotenv";
import {Readability} from '@mozilla/readability';
import { JSDOM } from "jsdom"
dotenv.config();
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
});


const loader = new PlaywrightWebBaseLoader("https://longreads.com/2020/03/16/tiger-trafficking-in-america/",
    {
        launchOptions: {
            headless: true,
        },
    }
);

const docs = await loader.load();
const dom = new JSDOM(docs[0].pageContent);
var article = new Readability(dom.window.document).parse();
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
// @ts-ignore
const splittedDocs = await textSplitter.createDocuments([article.textContent]);

// This convenience function creates a document chain prompted to summarize a set of documents.
const chain = loadSummarizationChain(model, { type: "map_reduce" });
const res = await chain.call({
    input_documents: splittedDocs,
});
console.log( res );
const sum = await model.call(
    `Please summarize the following text in 3 bullet points:
    ${res.text}
    `
);
console.log(sum)