"use strict";

const axios = require("axios"); // 引入 axios 库

module.exports = function (app) {
    app.route("/api/stock-prices").get(async function (req, res) {
        try {
            console.log(req.query);
            const stock = req.query.stock;
            const like = req.query.like || false;
            if (!stock) {
                return res.status(400).json({ error: "Stock symbol is required" });
            }
            let apiUrl = "";
            if (typeof stock === "string") {
                apiUrl = `https://stock-price-checker.freecodecamp.rocks/api/stock-prices/?stock=${stock}&like=${like}`; // 构造单个stock的URL
            }
            if (Array.isArray(stock)) {
                apiUrl = `https://stock-price-checker.freecodecamp.rocks/api/stock-prices/?stock=${stock.join(
                    "&stock="
                )}&like=${like}`; // 构造多个stock的URL
            }

            const response = await axios.get(apiUrl); // 发起GET请求

            res.json(response.data); // 返回数据
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch stock data" });
        }
    });
};

// https://stock-price-checker.freecodecamp.rocks/api/stock-prices?stock=GOOG&stock=MSFT&like=false
