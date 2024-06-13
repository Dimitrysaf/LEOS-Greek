import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";
import ribbonToolbar from "../pages/ribbonToolBar";

When(`click on change annex structure in ribbon toolbar`, () => {
    ribbonToolbar.clickChangeAnnexStructureBtn();
});

When(`click on import from oj button in ribbon toolbar`, () => {
    ribbonToolbar.clickImportOjButton();
});
