import { createDeepEqualSelector } from '#/@store/@common/createSelector';

import { IPublicProject, IState } from '@types';

export const publicProjectData = (state: IState): undefined | IPublicProject => state.publicProject;

export const publicProjectIsLoaded = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp && pp.isLoaded
);

export const publicProjectIsLoading = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp && pp.isLoading
);

export const publicProjectProject = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp && pp.project
);

export const PublicProjectMembers = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp?.project?.members?.list
);

export const publicProjectUuid = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp && pp.uuid
);

export const publicProjectStatistic = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp && pp.statistic
);

export const PublicProjectRoles = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp?.project?.roles
);

export const PublicProjectProjectId = createDeepEqualSelector(
  publicProjectData,
  (pp: IPublicProject | undefined) => pp?.project?.id
);
