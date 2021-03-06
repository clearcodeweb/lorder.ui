import { createDeepEqualSelector } from '#/@store/@common/createSelector';
import { defaultProjectId } from '#/@store/identity/selectors';

import { ownProjectList } from './selectors';

// export const ownProjectListNoProjectFirst = createDeepEqualSelector(
//   [ownProjectList, defaultProjectId],
//   (list, projectId) => {
//     const defaultProject = list.find(el => el && el.id === projectId);
//     if (defaultProject) {
//       const defProjectIndex = list.findIndex(el => el.id === defaultProject.id);
//       return [defaultProject, ...list.slice(0, defProjectIndex), ...list.slice(defProjectIndex + 1)];
//     }
//     return [...list];
//   }
// );

export const ownProjectListWithoutDefault = createDeepEqualSelector(
  [ownProjectList, defaultProjectId],
  (list, projectId) => {
    return list.slice(0).filter(el => el.id !== projectId);
  }
);
