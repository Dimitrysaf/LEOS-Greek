package eu.europa.ec.leos.services.support.scheduler;

import eu.europa.ec.leos.domain.repository.document.Proposal;
import eu.europa.ec.leos.security.TokenService;
import eu.europa.ec.leos.services.collection.CollectionContextService;
import eu.europa.ec.leos.services.store.WorkspaceService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.inject.Provider;
import java.util.List;

@Service
public class LeosSchedulerService {
    private static final Logger LOG = LoggerFactory.getLogger(LeosSchedulerService.class);

    private final WorkspaceService workspaceService;
    private final TokenService tokenService;
    private final Provider<CollectionContextService> proposalContextProvider;

    @Autowired
    public LeosSchedulerService(WorkspaceService workspaceService, Provider<CollectionContextService> proposalContextProvider, TokenService tokenService) {
        this.workspaceService = workspaceService;
        this.proposalContextProvider = proposalContextProvider;
        this.tokenService = tokenService;
    }

    @Scheduled(cron = "#{applicationProperties['leos.delete.clone.proposal.cron.schedule']}")
    public void deleteCloneCronTask() {
        try {
            LOG.info("Deleting cloned proposals using cron task....");
            List<Proposal> proposals = workspaceService.browseWorkspace(Proposal.class, false);
            CollectionContextService context = proposalContextProvider.get();
            proposals.forEach(proposal -> {
                if (proposal.isClonedProposal() && StringUtils.isEmpty(proposal.getClonedFrom())) {
                    context.useProposal(proposal);
                    try {
                        context.executeDeleteProposal();
                    } catch (Exception e) {
                        LOG.error("Error deleting the cloned proposal from the cron task", e);
                    }
                }
            });
        } catch (Exception ex) {
            LOG.error("Unable to connect to CMIS repo", ex);
        }
    }

    @Scheduled(cron = "#{applicationProperties['leos.empty.access.token.list.cron.schedule']}")
    public void emptyAccessTokenList() {
        try {
            LOG.info("Clear access token list using cron task....");
            tokenService.cleanAccessTokenInList();
        } catch (Exception ex) {
            LOG.error("Unable to clean list of access token", ex);
        }
    }

    @Scheduled(cron = "#{applicationProperties['leos.empty.access.token.session.map.cron.schedule']}")
    public void emptyAccessTokenSessionMap() {
        try {
            LOG.info("Clear access token amd session map using cron task....");
            tokenService.cleanAccessTokenSessionMap();
        } catch (Exception ex) {
            LOG.error("Unable to clean map of access token and session", ex);
        }
    }
}
