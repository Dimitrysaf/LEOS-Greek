class messageGrowl {
    elements = {
        successMessageContent: () => cy.get('.eui-growl-item-container--success', { timeout: 180000 }),
        warningMessageContent: () => cy.get('.eui-growl-item-container--warning', { timeout: 180000 })
    }
}
export default new messageGrowl;