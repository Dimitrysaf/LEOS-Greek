const user = require('../models/user');
const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const _ = require('lodash');
const { getUserFromAuthorizationHeader } = require('../util');

module.exports = function (app, db) {
  db.then((db) => {
    app.post('/api/secured/filterProposals', (req, res) => {
      const user = getUserFromAuthorizationHeader(req);
      const filters = req.body.filters ?? [];
      const applyFilters = (proposal) => filters.every(applyFilter(proposal));

      const sortOrder = req.body.sortOrder ?? false;
      const orderByProp = sortOrder ? 'title' : 'lastModificationDate';
      const orderByDir = sortOrder ? 'asc' : 'desc';

      const startIndex = req.body.startIndex ?? 0;
      const limit = req.body.limit ?? 40;

      let proposalCount = 0;
      const setProposalCount = (xs) => (proposalCount = xs.length);

      const proposals = db
        .get('proposals')
        .filter(applyFilters)
        .tap(setProposalCount)
        .orderBy([orderByProp], [orderByDir])
        .slice(startIndex, startIndex + limit)
        .value();
      res.send({ proposals, proposalCount });

      function applyFilter(proposal) {
        return ({ type, value }) => {
          switch (type) {
            case 'procedureType':
              return procedureTypeFilter(proposal, value);
            case 'template':
              return templateFilter(proposal, value);
            case 'docType':
              return docTypeFilter(proposal, value);
            case 'role':
              return roleFilter(proposal, value);
            case 'title':
              return title(proposal, value);
            default:
              return true; // ignore unknown filters
          }
        };

        function procedureTypeFilter(proposal, value) {
          // eg ["ORDINARY_LEGISLATIVE_PROC"]
          const val = proposal.metadata.procedureType;
          return val !== null ? value.includes(val) : true;
        }

        function templateFilter(proposal, value) {
          // eg ["SJ-023"]
          const val = proposal.template;
          return val !== null ? value.includes(val) : true;
        }

        function docTypeFilter(proposal, value) {
          // Act - eg ["REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL"]
          const val = proposal.metadata;
          return val !== null ? value.includes(val) : true;
        }

        function roleFilter(proposal, value) {
          // eg ["OWNER"]
          if (!proposal.collaborators.length || !user) {
            return true;
          }

          return proposal.collaborators
            .filter((c) => value.includes(c.role))
            .some((c) => c.login === user);
        }

        function title(proposal, value) {
          // eg ["TEST"]
          const filterValue = value[0] ?? '';
          return proposal.title.includes(filterValue); // exact match
        }
      }
    });

    app.get('/api/secured/proposals/:id', (req, res) => {
      const proposal = db
        .get('proposals')
        .find((p) => p.id === req.params.id)
        .value();
      if (!proposal) {
        res.sendStatus(404);
      } else {
        res.send(proposal);
      }
    });

    app.post('/api/secured/createPackage', (req, res) => {
      const { templateId, templateName, langCode, docPurpose, eeaRelevance } =
        req.body;
      const proposalId = 'proposal_with_child_docs';
      const proposal = db
        .get('proposals')
        .find((p) => p.id === proposalId)
        .value();
      const getChildId = (type) =>
        proposal.childDocuments.find((d) => d.type === type)?.id ?? null;
      const getChildUrl = (id, path) =>
        id ? `http://localhost:8080/leos-pilot/ui#!${path}/${id}` : null;
      const billId = getChildId('BILL');
      const memorandumId = getChildId('MEMORANDUM');
      const coverpageId = getChildId('COVERPAGE');

      res.send({
        proposalId,
        billId,
        proposalUrl: `http://localhost:8080/leos-pilot/ui#!collection/${proposalId}`,
        billUrl: getChildUrl(billId, 'document'),
        memorandumUrl: getChildUrl(memorandumId, 'memorandum'),
        memorandumId,
        coverpageUrl: getChildUrl(coverpageId, 'coverpage'),
        coverpageId,
        annexIdUrl: {},
        docCloneAndOriginIdMap: {},
        collectionCreated: true,
        error: null,
      });
    });

    app.get('/api/secured/getTemplates', (req, res) => {
      res.send(db.get('templates'));
    });

    app.put('/api/secured/proposals/:id/collaborators/:userId', (req, res) => {
      const collaborators = db
        .get('proposals')
        .find((p) => p.id === req.params.id)
        .get('collaborators');
      const collaborator = db
        .get('proposals')
        .find((p) => p.id === req.params.id)
        .get('collaborators')
        .find((c) => c.id === req.params.userId)
        .assign({ role: req.body.role })
        .write();
      if (collaborator) {
        res.send(collaborators);
      } else {
        res.sendStatus(404);
      }
    });

    app.delete(
      '/api/secured/proposals/:id/collaborators/:userId',
      (req, res) => {
        const collaboratorsFiltered = db
          .get('proposals')
          .find((p) => p.id === req.params.id)
          .get('collaborators')
          .filter((c) => c.id !== req.params.userId)
          .value();
        console.log('todelete', collaboratorsFiltered);

        const collaboratorsAfterDelete = db
          .get('proposals')
          .find((p) => p.id === req.params.id)
          .assign({ collaborators: collaboratorsFiltered })
          .write();

        if (collaboratorsAfterDelete) {
          res.send(collaboratorsAfterDelete);
        } else {
          res.sendStatus(404);
        }
      },
    );

    app.post('/api/secured/proposals/:id/addCollaborator', (req, res) => {
      const collaborators = db
        .get('proposals')
        .find((p) => p.id === req.params.id)
        .get('collaborators')
        .value();

      let collaboratorsToAdd = req.body.collaborators.map((x) => ({
        ...x,
        id: randomUUID(),
      }));
      collaboratorsToAdd = [...collaborators, ...collaboratorsToAdd];
      db.get('proposals')
        .find((p) => p.id === req.params.id)
        .assign({ collaborators: collaboratorsToAdd })
        .write();

      const newCollab = db
        .get('proposals')
        .find((p) => p.id === req.params.id)
        .get('collaborators')
        .value();

      if (!newCollab) {
        res.sendStatus(404);
      } else {
        res.send(newCollab);
      }
    });
  });
};
