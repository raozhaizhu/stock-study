const chaiHttp = require("chai-http");
const chai = require("chai");
const server = require("../server");
const expect = chai.expect; // 导入 expect

chai.use(chaiHttp);

const testStockRequest = (params, customAssertions) => (done) => {
    chai.request(server)
        .get("/api/stock-prices")
        .query(params)
        .end((err, res) => {
            expect(err).to.be.null;
            if (res.status === 400) {
                customAssertions(res.body);
                done();
            }
            expect(res).to.have.status(200);
            if (customAssertions) customAssertions(res.body.stockData);
            done();
        });
};

describe("GET /api/stock-prices", function () {
    // 测试1：单股票查询（基础验证）
    it(
        "Test 1: Viewing one stock (GOOG)",
        testStockRequest({ stock: "GOOG" }, (stockData) => {
            expect(stockData).to.have.property("stock", "GOOG");
            expect(stockData).to.have.property("price").that.is.a("number");
        })
    );
    it(
        "Test 2: Viewing one stock and liking",
        testStockRequest({ stock: "GOOG", like: true }, (stockData) => {
            expect(stockData).to.have.property("stock", "GOOG");
            expect(stockData).to.have.property("price").that.is.a("number");
            expect(stockData).to.have.property("likes").that.is.a("number");
        })
    );
    it(
        "Test 3: Viewing the same stock and liking it again: ",
        testStockRequest({ stock: "GOOG", like: true }, (stockData) => {
            expect(stockData).to.have.property("error", "You have already liked this stock");
        })
    );
    it(
        "Test 4: Viewing two stocks: ",
        testStockRequest({ stock: ["GOOG", "MSFT"] }, (stockData) => {
            expect(stockData).to.be.an("array").that.has.lengthOf(2);
            // 动态匹配股票数据
            const googData = stockData.find((item) => item.stock === "GOOG");
            const msftData = stockData.find((item) => item.stock === "MSFT");

            // 验证 GOOG
            expect(googData).to.have.property("price").that.is.a("number");
            expect(googData).to.have.property("rel_likes").that.is.a("number");

            // 验证 MSFT
            expect(msftData).to.have.property("price").that.is.a("number");
            expect(msftData).to.have.property("rel_likes").that.is.a("number");
        })
    );
    it(
        "Test 5: Viewing two stocks and liking them ",
        testStockRequest({ stock: ["GOOG", "MSFT"], like: true }, (stockData) => {
            expect(stockData).to.be.an("array").that.has.lengthOf(2);

            // 动态匹配股票数据
            const GOOGData = stockData.find((item) => item.stock === "GOOG");
            const msftData = stockData.find((item) => item.stock === "MSFT");

            // 验证 GOOG
            expect(GOOGData).to.have.property("price").that.is.a("number");
            expect(GOOGData).to.have.property("rel_likes").that.is.a("number");

            // 验证 MSFT
            expect(msftData).to.have.property("price").that.is.a("number");
            expect(msftData).to.have.property("rel_likes").that.is.a("number");
        })
    );
});
