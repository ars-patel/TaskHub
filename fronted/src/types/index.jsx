
// Interface definitions
export const User = {
  _id: String,
  email: String,
  name: String,
  createdAt: Date,
  isEmailVerified: Boolean,
  updatedAt: Date,
  profilePicture: String,
};

export const Workspace = {
  _id: String,
  name: String,
  description: String,
  owner: [User, String],
  color: String,
  members: [{
    user: User,
    role: ["admin", "member", "owner", "viewer"],
    joinedAt: Date,
  }],
  createdAt: Date,
  updatedAt: Date,
};

export const ProjectStatus = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const Project = {
  _id: String,
  title: String,
  description: String,
  status: ProjectStatus,
  workspace: Workspace,
  startDate: Date,
  dueDate: Date,
  progress: Number,
  tasks: [Task],
  members: [{
    user: User,
    role: ["admin", "member", "owner", "viewer"],
  }],
  createdAt: Date,
  updatedAt: Date,
  isArchived: Boolean,
};

export const TaskStatus = ["To Do", "In Progress", "Done"];
export const TaskPriority = ["High", "Medium", "Low"];
export const ProjectMemberRole = {
  MANAGER: "manager",
  CONTRIBUTOR: "contributor",
  VIEWER: "viewer",
};

export const Subtask = {
  _id: String,
  title: String,
  completed: Boolean,
  createdAt: Date,
};

export const Task = {
  _id: String,
  title: String,
  description: String,
  status: TaskStatus,
  project: Project,
  createdAt: Date,
  updatedAt: Date,
  isArchived: Boolean,
  dueDate: Date,
  priority: TaskPriority,
  assignee: [User, String],
  createdBy: [User, String],
  assignees: [User],
  subtasks: [Subtask],
  watchers: [User],
  attachments: [Attachment],
};

export const Attachment = {
  fileName: String,
  fileUrl: String,
  fileType: String,
  fileSize: Number,
  uploadedBy: String,
  uploadedAt: Date,
  _id: String,
};

export const MemberProps = {
  _id: String,
  user: User,
  role: ["admin", "member", "owner", "viewer"],
  joinedAt: Date,
};

export const ResourceType = [
  "Task",
  "Project",
  "Workspace",
  "Comment",
  "User"
];

export const ActionType = [
  "created_task",
  "updated_task",
  "created_subtask",
  "updated_subtask",
  "completed_task",
  "created_project",
  "updated_project",
  "completed_project",
  "created_workspace",
  "updated_workspace",
  "added_comment",
  "added_member",
  "removed_member",
  "joined_workspace",
  "added_attachment"
];

export const ActivityLog = {
  _id: String,
  user: User,
  action: ActionType,
  resourceType: ResourceType,
  resourceId: String,
  details: Object,
  createdAt: Date,
};

export const CommentReaction = {
  emoji: String,
  user: User,
};

export const Comment = {
  _id: String,
  author: User,
  text: String,
  createdAt: Date,
  reactions: [CommentReaction],
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
  }],
};

export const StatsCardProps = {
  totalProjects: Number,
  totalTasks: Number,
  totalProjectInProgress: Number,
  totalTaskCompleted: Number,
  totalTaskToDo: Number,
  totalTaskInProgress: Number,
};

export const TaskTrendsData = {
  name: String,
  completed: Number,
  inProgress: Number,
  todo: Number,
};

export const TaskPriorityData = {
  name: String,
  value: Number,
  color: String,
};

export const ProjectStatusData = {
  name: String,
  value: Number,
  color: String,
};

export const WorkspaceProductivityData = {
  name: String,
  completed: Number,
  total: Number,
};