import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Notes } from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import { CardType } from "~/types/card";
import { HelperUtils } from "~/untils/helpers";

interface DescriptionSectionProps {
  description: CardType["description"];
  canEdit: boolean;
  onSaveDescription: (description: string) => void;
}

export function DescriptionSection({
  description,
  canEdit,
  onSaveDescription,
}: DescriptionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftDescription, setDraftDescription] = useState(
    String(description || ""),
  );

  useEffect(() => {
    setDraftDescription(String(description || ""));
  }, [description]);

  const handleSaveDescription = () => {
    onSaveDescription(draftDescription);
    setIsEditing(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginLeft: 1,
          }}
        >
          <Notes fontSize="small" />
          <Typography variant="body2">Description</Typography>
        </Box>
        {canEdit && !HelperUtils.isEmpty(description) && (
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </Box>
      <Box mt={1}>
        {!isEditing ? (
          <Box ml={1}>
            <Box
              sx={{
                color: "text.primary",
                "& p": { color: "text.primary" },
                "& span": { color: "text.primary" },
                "& li": { color: "text.primary" },
              }}
              dangerouslySetInnerHTML={{
                __html: description || "",
              }}
            />
          </Box>
        ) : (
          <Box>
            <ReactQuill
              theme="snow"
              value={draftDescription}
              onChange={setDraftDescription}
            />
            <Box sx={{ display: "flex", mt: 1, gap: 2 }}>
              <Button variant="contained" onClick={handleSaveDescription}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      {canEdit && HelperUtils.isEmpty(description) && (
        <Button
          variant="outlined"
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            mt: 1,
          }}
          onClick={() => setIsEditing(true)}
        >
          Add a more detailed description...
        </Button>
      )}
    </>
  );
}
