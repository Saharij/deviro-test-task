import { Box, styled, Typography } from "@mui/material";

export function ObjectStatistics({
  active,
  lost,
  onClose,
}: {
  active: number;
  lost: number;
  onClose: () => void;
}) {
  return (
    <Container>
      <CloseButton onClick={onClose} />
      <Box sx={{ height: "stretch" }}>
        <Typography>{`Активні: ${active || 0}`}</Typography>
        <Typography>{`Втрачені: ${lost || 0}`}</Typography>
      </Box>
    </Container>
  );
}

const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Box
      sx={{ padding: "5px", cursor: "pointer", alignSelf: "flex-end" }}
      onClick={onClick}
    >
      <svg height="24px" viewBox="0 0 24 24" width="24px" fill="#0000000">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    </Box>
  );
};

const Container = styled(Box)({
  position: "absolute",
  left: "20px",
  bottom: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "10px",
  boxSizing: "border-box",
  maxHeight: "200px",
  height: "100%",
  maxWidth: "200px",
  width: "100%",
  color: "black",
  backgroundColor: "rgba(211, 211, 211, 0.6)",
  zIndex: 999,
});
