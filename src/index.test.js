const i = require("../dist/index");
const { Pager } = require("../dist/index");
const expect = require("expect.js");

describe("Page Creation", function () {
    let a = new i.Pager();
    let c = new i.Pager();
    describe("Pager#pages", function () {
        it("should be an array", function () {
            expect(c.pages).to.be.an("array");
        });
        it("should hold no items yet", function () {
            expect(c.pages).length(0);
        });
    });
    describe("Pager#addPage", function () {
        a.addPage("con");
        expect(a.pages[0].content).to.be.eql("con");
        expect(a.pages[0].title).to.be(undefined);
        a.removePage(0);
        a.addPage({ title: "me", content: "con" });
        expect(a.pages[0].content).to.be("con");
        expect(a.pages[0].title).to.be("me");
        a.removePage(0);
    });
    describe("Pager#addPages", function () {
        it("should add 2 pages from a string.", function () {
            a.addPages("con", "con2");
            expect(a.pages.length).to.be(2);
            expect(a.pages[0].content).to.be("con");
            expect(a.pages[0].title).to.be(undefined);
            expect(a.pages[1].content).to.be("con2");
            expect(a.pages[1].title).to.be(undefined);
        });
        a.pages.splice(0, 2);
        it("should add 3 pages from an object", function () {
            a.addPages(
                { title: "me", content: "con" },
                { title: "me again", content: "con2" },
                { title: "yup its me", content: "mhm" }
            );
            it("should hold 3 objects", function () {
                expect(a.pages.length).to.be(3);
            });
            expect(a.pages[0].content).to.be("con");
            expect(a.pages[0].title).to.be("me");

            expect(a.pages[1].content).to.be("con2");
            expect(a.pages[1].title).to.be("me again");

            expect(a.pages[2].content).to.be("mhm");
            expect(a.pages[2].title).to.be("yup its me");
        });
    });
    describe("Pager#removePage", function () {
        // We didnt remove the pages from the previous test, therefore there is currently 3 pages
        a.addPages("removed", "random stuff", "mh");
        // Page 4's content = "removed" so we check for that.
        it("should remove page index 3 (page 4)", function () {
            a.removePage(3);
            expect(a.pages[3].content).to.not.be("removed");
        });
    });
    describe("Pager#addDynamicPages", function () {
        let b = new Pager();
        it("should dynamically add pages", function () {
            const arr = ["content1", "content2", "content3", "content4"];
            b.addDynamicPages(arr, 2);
            it("should have 2 pages", function () {
                expect(b.pages.length).to.be(2);
            });
            expect(b.pages[0].content.includes("content1")).to.be(true);
            expect(b.pages[1].content.includes("content4")).to.be(true);
        });
    });
});
