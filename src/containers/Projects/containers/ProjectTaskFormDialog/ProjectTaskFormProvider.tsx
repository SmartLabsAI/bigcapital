import React from 'react';
import {
  useCreateProjectTask,
  useEditProjectTask,
  useProjectTask,
} from '../../hooks';
import { DialogContent } from '@/components';

const ProjectTaskFormContext = React.createContext();

/**
 * Project task form provider.
 * @returns
 */
function ProjectTaskFormProvider({
  // #ownProps
  dialogName,
  taskId,
  projectId,
  ...props
}) {
  // Create and edit project task mutations.
  const { mutateAsync: createProjectTaskMutate } = useCreateProjectTask();
  const { mutateAsync: editProjectTaskMutate } = useEditProjectTask();

  // Handle fetch project task detail.
  const { data: projectTask, isLoading: isProjectTaskLoading } = useProjectTask(
    taskId,
    {
      enabled: !!taskId,
    },
  );

  console.log(taskId, 'XX');
  console.log(projectTask, 'XX');

  const isNewMode = !taskId;
  // State provider.
  const provider = {
    dialogName,
    isNewMode,
    projectId,
    projectTask,
    createProjectTaskMutate,
    editProjectTaskMutate,
  };

  return (
    <DialogContent isLoading={isProjectTaskLoading}>
      <ProjectTaskFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useProjectTaskFormContext = () =>
  React.useContext(ProjectTaskFormContext);

export { ProjectTaskFormProvider, useProjectTaskFormContext };
