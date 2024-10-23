class internalReferenceWindow {
    elements = {
        legalActTabPanel: () => cy.get("div[role='tabpanel'][name^='REG']"),
        //annexTabPanel: () => cy.get("div[role='tabpanel'][name^='ANNEX']"),
        bill: () => this.elements.legalActTabPanel().find('bill'),
        article: () => this.elements.bill().find('article'),
        navigationPane: () => cy.get("div[role='tabpanel'][name^='REG'] div[title='Navigation pane']"),
        annexNavigationPane: () => cy.get("div[role='tabpanel'][name^='ANNEX'] div[title='Navigation pane']"),
        citationList: () => this.elements.navigationPane().contains('Citations').next("ul[role='group']"),
        recitalList: () => this.elements.navigationPane().contains('Recitals').next("ul[role='group']"),
        articleList: () => this.elements.navigationPane().contains('Enacting Terms').next("ul[role='group']"),
        levelList: () => this.elements.annexNavigationPane().contains('Body').next("ul[role='group']")
    }

    clickParagraphOfArticle(paragraphNumber){
        this.elements.article().find('paragraph').eq(paragraphNumber-1).realHover().click();
    }

    clickPointOfParagraphOfArticle(pointNumber, listNumber, paragraphNumber){
        this.elements.article().find('paragraph').eq(paragraphNumber-1).find('list').eq(listNumber-1).find('point').eq(pointNumber-1).realHover().click();
    }

    clickEnactingTermsArticleLink(link){
        this.elements.articleList().contains(link).click();
    }

    clickCitationLink(link){
        this.elements.citationList().contains(link).click();
    }

    clickRecitalLink(link){
        this.elements.recitalList().contains(link).click();
    }

    clickAnnexLink(link){
        this.elements.levelList().contains(link).click();
    }
}
export default new internalReferenceWindow();