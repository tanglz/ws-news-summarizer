import { OpenAI } from "langchain";
import * as dotenv from "dotenv";
dotenv.config();
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {parseContentByPlaywright, parseContentByPostlight} from "./parseContent.js";
import {fetchSecurityNews} from "./securityNews.js";
import {convertToCSV, CSVRow, insertRow, saveCSVToFile} from "./saveResult.js";
import path from 'path';

const run = async () => {
    // Test parameters
    const securityId = "sec-s-2875ffa767cf4185bdd3a096726670c6";
    const from = "2023-06-07";
    // model optimization
    const modelName= "gpt-3.5-turbo";
    const chunkSize= 2000;
    const conentPrompt= "Summarize the following article in a style of a tweet and do not exceed the 200 characters limit:";
    const titlePrompt= "Create a title that is short and to the point about the article:";

    // fetch security news from graphql endpoint, return urls of news
    const resultData: CSVRow[]=[];
    const securityNews=await fetchSecurityNews(securityId, from);
    let urls=securityNews.map((news:any)=>news.url);
    // urls=urls.slice(0, 1);
    for(const url of urls){
        const result=await parseContentByPostlight(url);
        const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: chunkSize});
        // @ts-ignore
        const splittedDocs = await textSplitter.createDocuments([result.content]);
        const model = new OpenAI({
            modelName: modelName,
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        const chain = loadSummarizationChain(model, {type: "map_reduce"});
        const res = await chain.call({
            input_documents: splittedDocs,
        });
        const sum = await model.call(
            conentPrompt + ` ${res.text} `
        );
        const tt = await model.call(
            titlePrompt + ` ${res.text} `
        );
        insertRow(resultData, url, sum, result.title, tt);
    };
    // Convert data to CSV format
    const csvData = convertToCSV(resultData);
    // Save CSV data to a file
    saveCSVToFile(csvData, 'output_APPL.csv');
}
run();