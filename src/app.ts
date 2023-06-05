import fs from 'fs';
import {CheerioWebBaseLoader} from "langchain/document_loaders";

//Load environment variables (populate process.env from .env file)
import * as dotenv from "dotenv";
dotenv.config();

export const run = async () => {
    console.log("Scrape test starting......")
    const loader = new CheerioWebBaseLoader(
        "https://finance.yahoo.com/news/stocks-waver-oil-rises-after-saudi-output-cut-stock-market-news-today-133818042.html",
        {
            selector:"div.caas-body",
        }
    );
    const htmls = await loader.load();
    const html = htmls[0];
    const content = html.pageContent;
    console.log(content);
};
run();