import { push, replace } from 'connected-react-router';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { change, reduxForm } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import { onSubmitFail } from '@store/@common/helpers';
import { changeSettings } from '@store/dialog';
import { showSuccess } from '@store/notifications';
import { patchProjectTask, postProjectTask, PROJECT_EDIT_TASK_FORM_NAME, projectTasksIsLoading } from '@store/projects';
import { routeProjectId, routeTaskId } from '@store/router';
import { archiveTask, checkIsCurrent, fetchTaskDetails, getEditTaskInitialValues, startUserWork } from '@store/tasks';
import { ITaskFormData, ITaskFormProps, TaskFormJsx } from './TaskForm';

const mapStateToProps = createStructuredSelector({
  checkIsCurrent,
  getEditTaskInitialValues,
  projectTasksIsLoading,
  routeProjectId,
  routeTaskId,
} as any);

const mapDispatchToProps = {
  archiveTask,
  changeSettings,
  fetchTaskDetails,
  push,
  replace,
  showSuccess,
  startUserWork,
};

const mergeProps = (
  { checkIsCurrent, getEditTaskInitialValues, routeProjectId, routeTaskId, ...restState }: any,
  { ...restDispatch }: any,
  { taskId, projectId, initialValues, ...restOwn }: any
) => {
  const localTaskId = taskId || routeTaskId;
  const localProjectId = projectId || routeProjectId;
  const preparedInitialValues = initialValues || (localTaskId ? getEditTaskInitialValues(localTaskId) : {});
  return {
    ...restState,
    initialValues: preparedInitialValues,
    isCurrent: checkIsCurrent(localTaskId),
    projectId: localProjectId,
    taskId: localTaskId,
    ...restDispatch,
    ...restOwn,
  };
};

export const PatchTaskForm = connect<
  any,
  any,
  { buttonText?: string; taskId?: number | string; projectId?: number | string; initialValues?: Partial<ITaskFormData> }
>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(reduxForm<ITaskFormData, ITaskFormProps>({
  enableReinitialize: true,
  form: PROJECT_EDIT_TASK_FORM_NAME,
  onSubmit: async (values, dispatch, { projectId }: any) => {
    const val = { ...values, projectId };
    return val.id ? dispatch(patchProjectTask(val)) : dispatch(postProjectTask(val));
  },
  onSubmitFail,
  onSubmitSuccess: (result, dispatch) => {
    const actionType = get(result, 'meta.previousAction.type');
    const taskId = get(result, 'payload.data.id');
    if (actionType === postProjectTask.toString()) {
      dispatch(change(PROJECT_EDIT_TASK_FORM_NAME, 'id', taskId));
    }
  },
})(TaskFormJsx) as any);
