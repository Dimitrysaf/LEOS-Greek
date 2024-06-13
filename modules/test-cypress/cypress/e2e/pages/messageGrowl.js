class messageGrowl {
    elements = {
        successMessageContent: () => cy.get('.eui-growl-item-container--success'),
        warningMessageContent: () => cy.get('.eui-growl-item-container--warning')
    }
}
export default new messageGrowl;