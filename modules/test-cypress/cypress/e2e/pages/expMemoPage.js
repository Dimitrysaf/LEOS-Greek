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
        //cy.xpath("//mainbody//blockcontainer[" + blockContainerNumber + "]").invoke('attr', 'id').then(id => cy.get("#" + id).realHover().click({ force: true }));
    }

    getBlockContainer(blockContainerCount){
        return this.elements.blockContainer().eq(blockContainerCount-1);
    }

    getBlockList(blockListCount, blockContainerCount){
        return this.getBlockContainer(blockContainerCount).find('blocklist').eq(blockListCount-1);
    }

    getItem(itemCount, blockListCount, blockContainerCount) {
        return this.getBlockList(blockListCount, blockContainerCount).find('item').eq(itemCount-1);
    }
}
export default new expMemoPage();