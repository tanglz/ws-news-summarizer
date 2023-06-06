import { OpenAI } from "langchain";
import * as dotenv from "dotenv";
dotenv.config();
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {parseContentByPlaywright, parseContentByPostlight} from "./parseContent.js";
import {fetchSecurityNews} from "./securityNews.js";

const run = async () => {
    // fetch security news from graphql endpoint, return urls of news
    const securityNews=await fetchSecurityNews("sec-s-2875ffa767cf4185bdd3a096726670c6", "2023-06-06");
    const urls=securityNews.map((news:any)=>news.url);
     for(const url of urls){
        const content=await parseContentByPostlight(url);
        const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 2000});
        // @ts-ignore
        const splittedDocs = await textSplitter.createDocuments([content]);
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo",
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        const chain = loadSummarizationChain(model, {type: "map_reduce"});
        const res = await chain.call({
            input_documents: splittedDocs,
        });
        const sum = await model.call(
            `Please summarize the following text in 3 bullet points:
    ${res.text}
    `
        );
        console.log(url);
        console.log(sum);
    };

}
run();