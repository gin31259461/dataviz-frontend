'use client';

import RacingBarChartEngine, {
  convertToRacingBarChartData,
  RacingBarChartArgs,
  RacingBarChartMapping,
} from '@/components/ChartEngine/RacingBarChartEngine';
import Loader from '@/components/Loading/Loader';
import { NavbarContext } from '@/components/Navbar/Navbar.context';
import { DataArgsProps } from '@/hooks/store/useProjectStore';
import { ArgSchema } from '@/server/api/routers/project';
import { trpc } from '@/server/trpc';
import { Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

function ProjectPage() {
  const navbar = useContext(NavbarContext);

  const currentIndex = 0;
  const projectId = parseInt(useParams().id as string);
  const observations = trpc.project.getProjectObservations.useQuery(projectId);
  const args = trpc.project.getArgsFromObservations.useQuery(
    observations.data && observations.data.map((d) => d.CID),
  );

  const arg: ArgSchema = JSON.parse(
    (args.data && args.data[currentIndex].CDes) ?? '{}',
  );

  const dataContent = trpc.dataObject.getContentFromDataTable.useQuery(
    arg.dataId,
  );

  return (
    <Container
      sx={{ paddingTop: 10, gap: 3, display: 'flex', flexDirection: 'column' }}
    >
      {dataContent.data && args.data ? (
        <>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {args.data[currentIndex].EName}
          </Typography>
          <RacingBarChartEngine
            data={convertToRacingBarChartData(
              dataContent.data,
              arg.dataArgs as DataArgsProps<RacingBarChartMapping>,
            )}
            args={arg.chartArgs as RacingBarChartArgs}
          />
          {/* <Button onClick={() => navbar.toggleOpen()}>Toggle</Button> */}
          <Typography variant="h6">Description:</Typography>
          <Typography>{args.data[currentIndex].EDes}</Typography>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
}

export default ProjectPage;
