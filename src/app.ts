import { OpenAI } from "langchain";
import * as dotenv from "dotenv";
dotenv.config();
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {parseContentByPlaywright, parseContentByPostlight} from "./parseContent.js";
import {fetchSecurityNews} from "./securityNews.js";
import {convertToCSV, CSVRow, insertRow, saveCSVToFile} from "./saveResult.js";

const run = async () => {
    // Test parameters
    const securityId = "sec-s-2875ffa767cf4185bdd3a096726670c6";
    const from = "2023-06-06";
    // model optimization
    const modelName= "gpt-3.5-turbo";
    const chunkSize= 2000;
    const prompt= "Please summarize the following text in 3 bullet points:";

    // fetch security news from graphql endpoint, return urls of news
    const resultData: CSVRow[]=[];
    const securityNews=await fetchSecurityNews(securityId, from);
    const urls=securityNews.map((news:any)=>news.url);
     for(const url of urls){
        const content=await parseContentByPostlight(url);
        const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: chunkSize});
        // @ts-ignore
        const splittedDocs = await textSplitter.createDocuments([content]);
        const model = new OpenAI({
            modelName: modelName,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
        const chain = loadSummarizationChain(model, {type: "map_reduce"});
        const res = await chain.call({
            input_documents: splittedDocs,
        });
        const sum = await model.call(
            prompt + ` ${res.text} `
        );
        console.log(url);
        console.log(sum);
        insertRow(resultData, url, sum);
    };

    // Convert data to CSV format
    const csvData = convertToCSV(resultData);

    // Save CSV data to a file
    const filePath = 'result_files/output.csv';
    saveCSVToFile(csvData, filePath);
}
run();