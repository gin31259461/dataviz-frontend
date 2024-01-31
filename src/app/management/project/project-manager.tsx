'use client';

import CardButton from '@/components/button/card-button';
import IconCardButton from '@/components/button/icon-card-button';
import Loader from '@/components/loading/loader';
import { useSplitLineStyle } from '@/hooks/use-styles';
import { ProjectSchema } from '@/server/api/routers/project';
import { trpc } from '@/server/trpc';
import convertOpacityToHexString from '@/utils/function';
import AddIcon from '@mui/icons-material/AddOutlined';
import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import ListIcon from '@mui/icons-material/ListOutlined';
import TimelineIcon from '@mui/icons-material/TimelineOutlined';
import {
  Box,
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
import { useEffect, useState } from 'react';
import ContextMenu from '../../../components/context-menu';
import ProjectCard from './project-card';
import ProjectList from './project-list';

type ViewMode = 'grid' | 'list';
type SortTarget = 'name' | 'dateCreated' | 'lastViewed';

interface ProjectManagerProps {
  getProjects: () => Promise<ProjectSchema[]>;
}

export default function ProjectManager(props: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectSchema[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortTarget, setSortTarget] = useState<SortTarget>('name');
  const [activeID, setActiveID] = useState<number | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const deleteProject = trpc.project.deleteProject.useMutation();

  useEffect(() => {
    const getProjects = async () => {
      const projects = await props.getProjects();
      setProjects(projects);
    };
    getProjects();
  }, [props]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortTarget(event.target.value as SortTarget);
  };

  const onDelete = async (cid: number) => {
    await deleteProject.mutateAsync(cid);
    router.refresh();
  };

  const ProjectCards = () => {
    return (
      <>
        {projects.map((project) => (
          <Grid key={project.id} item xs={12} sm={6} md={4}>
            <ContextMenu
              onDelete={async () => await onDelete(project.id)}
              id={project.id}
            >
              <div onMouseDown={() => setActiveID(project.id)}>
                <ProjectCard
                  active={activeID === project.id ? true : false}
                  project={project}
                />
              </div>
            </ContextMenu>
          </Grid>
        ))}
      </>
    );
  };

  const ProjectItems = () => {
    return (
      <>
        {projects.map((project) => {
          return (
            <TableRow
              key={project.id}
              sx={{
                '&:hover': {
                  backgroundColor:
                    activeID === project.id
                      ? 'none'
                      : theme.palette.action.hover,
                },
                backgroundColor:
                  activeID === project.id
                    ? theme.palette.info.main + convertOpacityToHexString(15)
                    : 'none',
              }}
            >
              <TableCell padding="none">
                <ContextMenu
                  onDelete={async () => await onDelete(project.id)}
                  id={project.id}
                >
                  <div
                    style={{ height: 50, padding: 16 }}
                    onMouseDown={() => setActiveID(project.id)}
                  >
                    {project.title}
                  </div>
                </ContextMenu>
              </TableCell>
              <TableCell padding="none">
                <ContextMenu
                  onDelete={async () => await onDelete(project.id)}
                  id={project.id}
                >
                  <div
                    style={{ height: 50, padding: 16 }}
                    onMouseDown={() => setActiveID(project.id)}
                  >
                    {project.lastModifiedDT.toDateString()}
                  </div>
                </ContextMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </>
    );
  };

  return (
    <Box padding={2}>
      <Box
        sx={{
          position: 'sticky',
          backdropFilter: 'blur(3px)',
          top: 60,
          zIndex: 10,
          height: 210,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgb(20, 27, 45, 0.7)'
              : 'rgb(252, 252, 252, 0.8)',
          borderBottom: `${useSplitLineStyle()}`,
        }}
      >
        {/* ---------- create project start ----------  */}
        <Grid container gap={2}>
          <Grid container>
            <CardButton
              title="New project"
              description="Create various projects"
              icon={<AddIcon color="secondary" fontSize="large" />}
              onClick={() => setNewProjectDialogOpen(true)}
            ></CardButton>
          </Grid>

          <Dialog
            open={newProjectDialogOpen}
            onClose={() => setNewProjectDialogOpen(false)}
          >
            <DialogTitle>Create new project</DialogTitle>
            <DialogContent
              sx={{
                width: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {/* ---------- project options start ----------  */}
              <CardButton
                title="New racing chart project"
                icon={<TimelineIcon color="info" />}
                description=""
                onClick={() => router.push('/create/racing-chart')}
              ></CardButton>

              <CardButton
                title="New live analysis project"
                icon={<TimelineIcon color="info" />}
                description=""
                onClick={() => router.push('/create/live-analysis')}
              ></CardButton>
              {/* ---------- project options end ----------  */}
            </DialogContent>
          </Dialog>
        </Grid>
        {/* ---------- create project end ----------  */}

        <Grid
          container
          justifyContent="flex-end"
          alignItems={'flex-end'}
          marginTop={3}
        >
          <div style={{ marginRight: 10 }}>
            <FormControl variant="standard">
              <InputLabel>Sort by: </InputLabel>
              <Select
                sx={{ border: 'none' }}
                value={sortTarget}
                onChange={handleSortChange}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="dateCreated">Date created</MenuItem>
                <MenuItem value="lastViewed">Last viewed</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ marginRight: 5 }}>
            <IconCardButton
              title="Grid view"
              onClick={() => setViewMode('grid')}
            >
              {viewMode === 'list' ? (
                <GridViewIcon />
              ) : (
                <GridViewIcon color="secondary" />
              )}
            </IconCardButton>
          </div>
          <div>
            <IconCardButton
              title="List view"
              onClick={() => setViewMode('list')}
            >
              {viewMode === 'grid' ? (
                <ListIcon />
              ) : (
                <ListIcon color="secondary" />
              )}
            </IconCardButton>
          </div>
        </Grid>
      </Box>

      {projects.length > 0 ? (
        <div>
          {viewMode === 'grid' ? (
            <Grid container spacing={2} mt={2}>
              <ProjectCards />
            </Grid>
          ) : (
            <ProjectList>
              <ProjectItems />
            </ProjectList>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </Box>
  );
}