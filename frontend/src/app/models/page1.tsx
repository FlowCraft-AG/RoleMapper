import { getCamundaFiles } from '../../lib/camunda/camundaFileUtils';
import ClientPage from './clientPage';

export default async function CamundaPage() {
  const { bpmnFiles, formFiles, dmnFiles } = await getCamundaFiles();

  return (
    <ClientPage
      bpmnFiles={bpmnFiles}
      formFiles={formFiles}
      dmnFiles={dmnFiles}
    />
  );
}
