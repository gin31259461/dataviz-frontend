'use client';

import CardButton from '@/components/Button/CardButton';
import IconCardButton from '@/components/Button/IconCardButton';
import { useSplitLineStyle } from '@/hooks/useStyles';
import convertOpacityToHexString from '@/utils/opacityToHexString';
import AddChartIcon from '@mui/icons-material/AddchartOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import TimelineIcon from '@mui/icons-material/TimelineOutlined';
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableCell,
  TableRow,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ContextMenu from '../../../../components/ContextMenu';
import { type ProjectProps } from '../../../../types/Project';
import ProjectCard from './ProjectCard';
import ProjectList from './ProjectList';

type ViewMode = 'grid' | 'list';
type SortTarget = 'name' | 'dateCreated' | 'lastViewed';

type ProjectListProps = {
  projects: ProjectProps[];
};

export default function ProjectManager({ projects }: ProjectListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortTarget, setSortTarget] = useState<SortTarget>('name');
  const [activeID, setActiveID] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortTarget(event.target.value as SortTarget);
  };

  return (
    <Box>
      <Box
        sx={{
          padding: 3,
          position: 'sticky',
          width: '100%',
          backdropFilter: 'blur(3px)',
          top: 60,
          zIndex: 10,
          height: 210,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgb(20, 27, 45, 0.7)' : 'rgb(252, 252, 252, 0.8)',
          borderBottom: `${useSplitLineStyle()}`,
        }}
      >
        <Grid container gap={2}>
          <Grid item sm={12}>
            <CardButton
              title="New project"
              description="Automatic analyze data to infographic"
              icon={<AddIcon color="secondary" fontSize="large" />}
              onClick={() => setNewProjectDialogOpen(true)}
            ></CardButton>
          </Grid>

          <Dialog open={newProjectDialogOpen} onClose={() => setNewProjectDialogOpen(false)}>
            <DialogTitle>Create new project</DialogTitle>
            <DialogContent sx={{ width: 400, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <CardButton
                title="New racing chart project"
                icon={<TimelineIcon color="info" />}
                description=""
                onClick={() => router.push('/create/racing-chart')}
              ></CardButton>
              <CardButton title="New basic project" icon={<AddChartIcon color="info" />} description=""></CardButton>
            </DialogContent>
          </Dialog>
        </Grid>

        <Grid container justifyContent="flex-end" alignItems={'flex-end'} marginTop={3}>
          <div style={{ marginRight: 10 }}>
            <FormControl variant="standard">
              <InputLabel>Sort by: </InputLabel>
              <Select sx={{ border: 'none' }} value={sortTarget} onChange={handleSortChange}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="dateCreated">Date created</MenuItem>
                <MenuItem value="lastViewed">Last viewed</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ marginRight: 5 }}>
            <IconCardButton title="Grid view" onClick={() => setViewMode('grid')}>
              {viewMode === 'list' ? <GridViewIcon /> : <GridViewIcon color="secondary" />}
            </IconCardButton>
          </div>
          <div>
            <IconCardButton title="List view" onClick={() => setViewMode('list')}>
              {viewMode === 'grid' ? <ListIcon /> : <ListIcon color="secondary" />}
            </IconCardButton>
          </div>
        </Grid>
      </Box>

      <Container>
        {viewMode === 'grid' ? (
          <Grid container spacing={2} mt={2}>
            {projects.map((project) => (
              <Grid key={project.id} item xs={12} sm={6} md={4}>
                <ContextMenu maxWidth={345} id={project.id}>
                  <div onMouseDown={() => setActiveID(project.id)}>
                    <ProjectCard active={activeID === project.id ? true : false} project={project} />
                  </div>
                </ContextMenu>
              </Grid>
            ))}
          </Grid>
        ) : (
          <ProjectList>
            {projects.map((project) => {
              return (
                <TableRow
                  key={project.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: activeID === project.id ? 'none' : theme.palette.action.hover,
                    },
                    backgroundColor:
                      activeID === project.id ? theme.palette.info.main + convertOpacityToHexString(15) : 'none',
                  }}
                >
                  <TableCell padding="none">
                    <ContextMenu id={project.id}>
                      <div style={{ height: 50, padding: 16 }} onMouseDown={() => setActiveID(project.id)}>
                        {project.name}
                      </div>
                    </ContextMenu>
                  </TableCell>
                  <TableCell padding="none">
                    <ContextMenu id={project.id}>
                      <div style={{ height: 50, padding: 16 }} onMouseDown={() => setActiveID(project.id)}>
                        {project.lastModified}
                      </div>
                    </ContextMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </ProjectList>
        )}
      </Container>
    </Box>
  );
}