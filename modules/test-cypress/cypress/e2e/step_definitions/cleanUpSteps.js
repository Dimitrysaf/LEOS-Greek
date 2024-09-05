import { And } from "cypress-cucumber-preprocessor/steps";
import repositoryBrowserPage from "../pages/repositoryBrowserPage";
import actViewerPage from "../pages/actViewerPage";
import dialogBoxPage from "../pages/euiDialogBoxPage";
import headerPage from "../pages/headerPage";

And(`delete all the acts containing keyword {string}`, (keyword) => {
    repositoryBrowserPage.getProposalCount(keyword).then((count) => {
        for (let i = 0; i < count; i++) {
            repositoryBrowserPage.openFirstProposal();
            headerPage.getCurrentPageName().should("have.text", "Act View");
            actViewerPage.clickOnActionButton();
            actViewerPage.clickOnDeleteButton();
            dialogBoxPage.clickDangerButton();
            headerPage.getCurrentPageName().should("have.text", "Workspace");
            repositoryBrowserPage.enterSearchText(keyword);
        }
    });
});