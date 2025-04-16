"use strict";

const axios = require("axios"); // 引入 axios 库
const ipLikeMap = new Map();

module.exports = function (app) {
    app.route("/api/stock-prices").get(async function (req, res) {
        try {
            const stock = req.query.stock;
            const like = req.query.like || "false";

            // 获取IP并检测是否重复
            const ip = req.ip;
            const key = `${ip}:${stock}`;
            console.log(stock);

            if ((like === "true") & ipLikeMap.has(key)) {
                return res.status(400).json({ error: "You have already liked this stock" }); // 修复 Test 3
            }
            if (like === "true") {
                ipLikeMap.set(key, true);
            }

            // stock相关检测，存在与否，是字符串还是数组
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
