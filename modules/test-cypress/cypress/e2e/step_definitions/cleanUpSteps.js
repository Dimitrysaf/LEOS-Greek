import { And } from "cypress-cucumber-preprocessor/steps";
import repositoryBrowserPage from "../pages/repositoryBrowserPage";
import proposalViewerPage from "../pages/proposalViewerPage";
import dialogBoxPage from "../pages/euiDialogBoxPage";
import headerPage from "../pages/headerPage";

And(`delete all the proposals containing keyword {string}`, (keyword) => {
    repositoryBrowserPage.getProposalCount(keyword).then((count) => {
        for (let i = 0; i < count; i++) {
            repositoryBrowserPage.openFirstProposal();
            headerPage.getCurrentPageName().should("have.text", "Proposal View");
            proposalViewerPage.clickOnActionButton();
            proposalViewerPage.clickOnDeleteButton();
            dialogBoxPage.clickDangerButton();
            headerPage.getCurrentPageName().should("have.text", "Workspace");
            repositoryBrowserPage.enterSearchText(keyword);
        }
    });
});