class expMemoPage {
    elements = {
        closeBtn: () => cy.contains('Close'),
        documentContainer: () => cy.get('#docContainer'),
        guidanceBlock: () => cy.get('.guidance-green-block'),
        blockContainer: () => cy.get('mainbody blockcontainer')
    }

    clickCloseBtn(){
        this.elements.closeBtn().click();
    }

    mouseHoverAndClickOnBlockContainer(blockContainerNumber){
        this.getBlockContainer(blockContainerNumber).invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }

    getBlockContainer(blockContainerCount){
        return this.elements.blockContainer().eq(blockContainerCount-1);
    }

    getBlockListFirstLayer(blockListCount, blockContainerCount){
        return this.getBlockContainer(blockContainerCount).children('blocklist').eq(blockListCount-1);
    }

    getBlockListSecondLayer(blockListCount2, itemCount, blockListCount, blockContainerCount){
        return this.getBlockContainer(blockContainerCount).children('blocklist').eq(blockListCount-1).children('item').eq(itemCount-1).children('blocklist').eq(blockListCount2-1);
    }

    getItemFirstLayer(itemCount, blockListCount, blockContainerCount) {
        return this.getBlockListFirstLayer(blockListCount, blockContainerCount).children('item').eq(itemCount-1);
    }

    getItemSecondLayer(itemCount2, blockListCount2, itemCount, blockListCount, blockContainerCount) {
        return this.getBlockListSecondLayer(blockListCount2, itemCount, blockListCount, blockContainerCount).children('item').eq(itemCount2-1);
    }
}
export default new expMemoPage();