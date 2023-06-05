import fs from 'fs';
//Load environment variables (populate process.env from .env file)
import * as dotenv from "dotenv";
import {scrape} from "./scrape.js";
dotenv.config();

export const run = async () => {
    console.log("Scrape test starting......")
    const content = scrape("https://finance.yahoo.com/news/stocks-waver-oil-rises-after-saudi-output-cut-stock-market-news-today-133818042.html");
    console.log(content);
};
run();