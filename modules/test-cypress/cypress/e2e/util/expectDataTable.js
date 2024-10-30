export function checkContentResult(element, datatable) {
    element[0].childNodes.forEach((element, index) => {
        if (element.nodeType === 1 && (datatable.raw().at(index).at(0).includes(",") || datatable.raw().at(index).at(0) !== "html")) {
            const elementsArray = datatable.raw().at(index).at(0).split(",");
            for (let elementIndex = 0; elementIndex < elementsArray.length; elementIndex++) {
                expect(element.localName).equal(elementsArray[elementIndex]);
                element = element.childNodes[0];
            }
            expect(element.textContent + "\"").equal(datatable.raw().at(index).at(1).substring(1));
        }
        if (element.nodeType === 1 && datatable.raw().at(index).at(0) === "html") {
            const re = new RegExp(datatable.raw().at(index).at(1));
            expect(true).equal(re.test(element.outerHTML));
        }
        if(element.nodeType === 3 && datatable.raw().at(index).at(0) === "text") {
            expect(element.textContent + "\"").equal(datatable.raw().at(index).at(1).substring(1));
        }
    })
}