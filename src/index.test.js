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
	describe("add page from string", function (){
		it("should add a page from a string", function () {
        		expect(a.pages[0].content).to.be("con");
        		expect(a.pages[0].title).to.be(undefined);
		})
	})
	describe("add page from object", function () {
		it("should add a page from an object", function () {
        		a.addPage({ title: "me", content: "con" });
        		expect(a.pages[1].content).to.be("con");
        		expect(a.pages[1].title).to.be("me");
		})
	})
    });
    describe("Pager#addPages", function () {
	let str = new Pager()
        describe("should add 2 pages from a string.", function () {
            str.addPages("con", "con2");
	    it("should be of length 2", function () {
            expect(str.pages).to.have.length(2);
	    })
	    it("should have the pages", function () {
            expect(str.pages[0].content).to.be("con");
            expect(str.pages[0].title).to.be(undefined);
            expect(str.pages[1].content).to.be("con2");
            expect(str.pages[1].title).to.be(undefined);
	    })
        });
	let strr = new Pager()
        describe("should add 3 pages from an object", function () {
            strr.addPages(
                { title: "me", content: "con" },
                { title: "me again", content: "con2" },
                { title: "yup its me", content: "mhm" }
            );
            it("should hold 3 objects", function () {
                expect(strr.pages).have.length(3);
            });
	    it("should have the pages", function () {
            expect(strr.pages[0].content).to.be("con");
            expect(strr.pages[0].title).to.be("me");

            expect(strr.pages[1].content).to.be("con2");
            expect(strr.pages[1].title).to.be("me again");

            expect(strr.pages[2].content).to.be("mhm");
            expect(strr.pages[2].title).to.be("yup its me");
	    })
        });
    });
    describe("Pager#removePage", function () {
	let rem = new Pager()
        
	rem.addPages("removed", "random stuff", "mh");
        it("should remove page index 3 (page 4)", function () {
            rem.removePage(0);
            expect(rem.pages[0].content).to.not.be("removed");
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
