import { Avatar, Box, Typography } from "@mui/material";
import { format } from "date-fns";
import { ActivityType } from "~/types/card";
import { HelperUtils } from "~/untils/helpers";

interface ActivityItemProps {
  activity: ActivityType;
}

const ActivityItem = ({ activity }: ActivityItemProps) => (
  <Box display="flex" alignItems="flex-start" gap={2} mb={1.5}>
    {activity.actorAvatar ? (
      <Avatar alt={activity.actorName} src={activity.actorAvatar} />
    ) : (
      <Avatar sx={{ bgcolor: "primary.main", fontSize: "small" }}>
        {HelperUtils.getInitials(activity.actorName)}
      </Avatar>
    )}
    <Box flex={1}>
      <Typography variant="body2">
        <Typography component="span" variant="body2" fontWeight={700}>
          {activity.actorName}
        </Typography>
        {" "}
        <Typography component="span" variant="body2" fontWeight={400} fontSize={12}>
          {activity.message}
        </Typography>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {format(new Date(activity.createdAt), "MMM dd, yyyy, h:mm a")}
      </Typography>
    </Box>
  </Box>
);

export default ActivityItem;
