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
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginLeft: { xs: 0, sm: 1 },
            minWidth: 0,
          }}
        >
          <Notes fontSize="small" />
          <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
            Description
          </Typography>
        </Box>
        {canEdit && !HelperUtils.isEmpty(description) && (
          <Button
            variant="outlined"
            onClick={() => setIsEditing(true)}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Edit
          </Button>
        )}
      </Box>
      <Box
        mt={1}
        sx={{
          minWidth: 0,
          maxWidth: "100%",
          px: { xs: 0, sm: 1, md: 1 },
        }}
      >
        {!isEditing ? (
          <Box ml={{ xs: 0, md: 1 }}>
            <Box
              sx={{
                color: "text.primary",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                "& p": { color: "text.primary" },
                "& span": { color: "text.primary" },
                "& li": { color: "text.primary" },
                "& img": { maxWidth: "100%", height: "auto" },
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
            <Box
              sx={{
                display: "flex",
                mt: 1,
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
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
            mt: 1,
            mx: { xs: 0, sm: 1, md: 0 },
            width: {
              xs: "100%",
              sm: "calc(100% - 16px)",
              md: "100%",
            },
          }}
          onClick={() => setIsEditing(true)}
        >
          Add a more detailed description...
        </Button>
      )}
    </>
  );
}
