const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const { suite, test } = require("mocha");

suite("Functional Tests", function () {
    // 测试1：单股票查询（基础验证）
    test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices")
            .query({ stock: "GOOG" })
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.propertyVal(stockData, "stock", "GOOG");
                assert.isNumber(stockData.price);
                done();
            });
    });

    test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices")
            .query({ stock: "GOOG", like: "true" })
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.propertyVal(stockData, "stock", "GOOG");
                assert.isNumber(stockData.price);
                assert.isNumber(stockData.likes);
                done();
            });
    });

    test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices")
            .query({ stock: "GOOG", like: "true" })
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.status, 400);
                const body = res.body;
                assert.propertyVal(body, "error", "You have already liked this stock");
                done();
            });
    });

    test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices")
            .query({ stock: ["GOOG", "MSFT"] })
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.isArray(stockData);
                assert.lengthOf(stockData, 2);

                // 动态匹配股票数据
                const googData = stockData.find((item) => item.stock === "GOOG");
                const msftData = stockData.find((item) => item.stock === "MSFT");

                // 验证 GOOG
                assert.isNumber(googData.price);
                assert.isNumber(googData.rel_likes);

                // 验证 MSFT
                assert.isNumber(msftData.price);
                assert.isNumber(msftData.rel_likes);
                done();
            });
    });

    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
        chai.request(server)
            .get("/api/stock-prices")
            .query({ stock: ["GOOG", "MSFT"], like: "true" })
            .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.status, 200);
                const stockData = res.body.stockData;
                assert.isArray(stockData);
                assert.lengthOf(stockData, 2);

                // 动态匹配股票数据
                const GOOGData = stockData.find((item) => item.stock === "GOOG");
                const msftData = stockData.find((item) => item.stock === "MSFT");

                // 验证 GOOG
                assert.isNumber(GOOGData.price);
                assert.isNumber(GOOGData.rel_likes);

                // 验证 MSFT
                assert.isNumber(msftData.price);
                assert.isNumber(msftData.rel_likes);
                done();
            });
    });
});
