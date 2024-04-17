require('@cypress/xpath');

describe('template spec', () => {
    it('passes', () => {
      cy.viewport(1280, 720)
    //   cy.visit('https://intragate.development.ec.europa.eu/decide-drafting/ui/workspace')
      cy.visit('http://dasatya:demo@localhost:8080/leos-pilot/ui/workspace')
    //   cy.wait(2000)
    //   cy.get('#username').type('dasatya')
    //   cy.get('.btn-primary').click()
    //   cy.wait(2000)
    //   cy.get('#password').type('Bejing1234')
    //   cy.get('.btn-primary').click()
      cy.wait(5000)
      cy.xpath("//*[text()=' Create Proposal ']").click();
      cy.wait(1000);
      cy.xpath("//*[text()=' SJ-023 - Proposal for a Regulation of the European Parliament and of the Council ']").click();
      cy.xpath("//*[text()=' Next ']").click();
      cy.get('input#docPurpose').type('Automation ck editor testing scenario 1');
      cy.get('app-proposal-create-wizard button.eui-button.eui-button--primary').click();
      cy.wait(5000);
    //   cy.get('eui-card-header-title').first().click()
    //   cy.wait(3000)
      cy.contains('Legal Act').click()
      cy.wait(3000)
      //cy.get('#_art_1').invoke('attr', 'class', 'leos-editable-content')
      //cy.get('#_imp_art_d653e1221_DisVXR').invoke('attr', 'class', 'leos-editable-content')
      cy.get('#_art_1').trigger('mouseover').trigger("click")
      cy.wait(12000)
      //cy.get('#docContainer').click()
      cy.window().then((w) => {
        // console.log("WINDOW ------> " + w.ckeditor);
        // console.log(w.ckeditor);
        // console.log("CONNECTOR ------> " + w.connector);
        // console.log(w.connector);
        // console.log("CKEDITOR ------> " + w.CKEDITOR);
        // console.log(w.CKEDITOR);
        w.EditorConnector.handleEdit({
          "action": "edit",
          "elementId": "_art_1",
          "elementType": "article",
          "elementCursorId": "_art_1",
          "elementCursorChildPos": 0,
          "elementCursorPos": 0
        })
        //cy.wait(3000).then( () => {
  
        //console.log("w.CKEDITOR.instances.editor1 ------> " + w.CKEDITOR.instances.editor1);
        //console.log(w.CKEDITOR.instances);
        cy.wait(12000).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 3);
          range.setEnd(elementToPutCursor, 3);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData(' adding new data ');
        //   range.setStart(elementToPutCursor, 10);
        //   range.setEnd(elementToPutCursor, 10);
        //   range.collapse(true);
        //   range.select();
        })
        /*cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 10);
          range.setEnd(elementToPutCursor, 10);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData('ew');
          range.setStart(elementToPutCursor, 12);
          range.setEnd(elementToPutCursor, 12);
          range.collapse(true);
          range.select();
        })
        cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 12);
          range.setEnd(elementToPutCursor, 12);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData(' d');
          range.setStart(elementToPutCursor, 14);
          range.setEnd(elementToPutCursor, 14);
          range.collapse(true);
          range.select();
        })
        cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 14);
          range.setEnd(elementToPutCursor, 14);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData('at');
          range.setStart(elementToPutCursor, 16);
          range.setEnd(elementToPutCursor, 16);
          range.collapse(true);
          range.select();
        })
        cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 16);
          range.setEnd(elementToPutCursor, 16);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData('a ');
          range.setStart(elementToPutCursor, 18);
          range.setEnd(elementToPutCursor, 18);
          range.collapse(true);
          range.select();
        })
        cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 18);
          range.setEnd(elementToPutCursor, 18);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData('ad');
          range.setStart(elementToPutCursor, 20);
          range.setEnd(elementToPutCursor, 20);
          range.collapse(true);
          range.select();
        })
        cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 20);
          range.setEnd(elementToPutCursor, 20);
          range.collapse(true);
          range.select();
          range.startContainer.$.appendData('ded');
          range.setStart(elementToPutCursor, 23);
          range.setEnd(elementToPutCursor, 23);
          range.collapse(true);
          range.select();
        })
        cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 10);
          range.setEnd(elementToPutCursor, 20);
          range.select();
        })*/
        /*cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          editor.execCommand( 'bold' );
        })*/
        /*cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let elementToPutCursorParent = editor.element.findOne("#_art_1__para_1");
          let elementToPutCursor = elementToPutCursorParent.getChild(3);
          //elementToPutCursor = elementToPutCursor.getChild(0);
          let range = editor.createRange();
          range.moveToPosition(elementToPutCursor, w.CKEDITOR.POSITION_AFTER_START);
          range.setStart(elementToPutCursor, 12);
          range.setEnd(elementToPutCursor, 12);
          range.select();
        })*/
        /*cy.wait(500).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          let data = new w.CKEDITOR.dom.event(
            new KeyboardEvent('keypress', {
              charCode: 97,
              ctrlKey: false,
              shiftKey: false
            })
          )
          editor.document.fire('keypress', data);
        })*/
        cy.wait(1000).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          editor.execCommand( 'enter' );
        })
        cy.wait(1000).then( () => {
          let editor = w.CKEDITOR.instances.editor1;
          editor.execCommand( 'inlinesaveclose' );
        })
        // cy.wait(3000).then( () => {
        //   range.startContainer.$.appendData();
        // })
  
        //
        // range.collapse(true);
        // range.select();
        // editor.execCommand( 'enter' );
        // editor.execCommand( 'inlinesaveclose' );
        //elementToPutCursorParent.appendText('new test');
  
        //})
        //let instances = w.CKEDITOR.instances.then((result) => {return result} );
        //console.log("instances ------> " + instances);
        //var editor = w.CKEDITOR.editor;
        //editor.createRange();
        // range.moveToPosition(elementToPutCursor, CKEDITOR.POSITION_AFTER_START);
        // range.setStart(elementToPutCursor, editor.LEOS.elementCursorPos);
        // range.setEnd(elementToPutCursor, editor.LEOS.elementCursorPos);
        // range.collapse(true);
        // range.select();
  
      })
    })
  })
  