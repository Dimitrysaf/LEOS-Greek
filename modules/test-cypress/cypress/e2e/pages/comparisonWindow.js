class comparisonWindow {
    elements = {
        versionComparisonMainContainer: () => cy.get('#versionComparisonMainContainer'),
        article: () => this.elements.versionComparisonMainContainer().find('article')
    }

    getArticle(articleNUmber){
        return this.elements.article().eq(articleNUmber-1);
    }

    getParagraphFromArticle(paragraphNumber, articleNumber){
        return this.getArticle(articleNumber).find('paragraph').eq(paragraphNumber-1);
    }

    getSpanOfContentOfParagraphOfArticle(attributeName, paragraphNumber, articleNumber) {
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).find('content aknp').find("span."+attributeName);
    }

    getSpanOfNumOfArticle(attributeName, articleNumber) {
        return this.getArticle(articleNumber).find('num').find("span."+attributeName);
    }

    getSpanOfNumOfParagraphOfArticle(attributeName, paragraphNumber, articleNumber) {
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).find('num').find("span."+attributeName);
    }

    getNumOfParagraphOfArticle(paragraphNumber, articleNumber) {
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).find('num');
    }

    getContentOfSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber){
        return this.getSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getSubparagraphOfListOfParagraphFromArticle(subparagraphNumber, listNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getNumTagOfPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber){
        return this.getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber).children('num');
    }

    getPointOfParagraphFromArticle(pointNumber, listNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber-1).children('point').eq(pointNumber-1);
    }

    getContentOfSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber).find('content aknp');
    }

    getSubParagraphOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber, poinListNumber, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(poinListNumber-1).children('point').eq(pointNumber-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getNumTagOfPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('num');
    }

    getPointOfPointOfParagraphFromArticle(pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(listNumber2-1).children('point').eq(pointNumber2-1);
    }

    getContentOfSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getSubParagraphOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(pointListNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(pointListNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, pointListNumber3, pointNumber2, pointListNumber2, pointNumber1, pointListNumber1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(pointListNumber1-1).children('point').eq(pointNumber1-1).children('list').eq(pointListNumber2-1).children('point').eq(pointNumber2-1).children('list').eq(pointListNumber3-1).children('point').eq(pointNumber3-1).children('list').eq(subParagraphListNumber-1).children('subparagraph').eq(subparagraphNumber-1);
    }

    getNumTagOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('num');
    }

    getPointOfPointOfPointOfParagraphFromArticle(pointNum3, listNum3, pointNum2, listNum2, pointNum1, listNum1, paragraphNumber, articleNumber){
        return this.getParagraphFromArticle(paragraphNumber, articleNumber).children('list').eq(listNum1-1).children('point').eq(pointNum1-1).children('list').eq(listNum2-1).children('point').eq(pointNum2-1).children('list').eq(listNum3-1).children('point').eq(pointNum3-1);
    }

    getContentOfSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber){
        return this.getSubParagraphOfPointOfPointOfPointOfParagraphOfArticle(subparagraphNumber, subParagraphListNumber, pointNumber3, poinListNumber3, pointNumber2, poinListNumber2, pointNumber1, poinListNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getNumTagOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('num');
    }

    getIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).children('list').eq(listNumber4-1).children('indent').eq(indentNumber-1);
    }

    getContentOfIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getIndentOfPointOfPointOfPointOfParagraphFromArticle(indentNumber, listNumber4, pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).find('content aknp');
    }

    getContentOfPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber){
        return this.getPointOfPointOfPointOfParagraphFromArticle(pointNumber3, listNumber3, pointNumber2, listNumber2, pointNumber1, listNumber1, paragraphNumber, articleNumber).find('content aknp');
    }
}
export default new comparisonWindow();