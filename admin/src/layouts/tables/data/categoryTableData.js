/* eslint-disable react/prop-types */
// @mui material components
import Icon from "@mui/material/Icon";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonProgress from "components/ArgonProgress";

// Images
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoWebDev from "assets/images/small-logos/logo-webdev.svg";
import logoXD from "assets/images/small-logos/logo-xd.svg";

function Completion({ value, color }) {
  return (
    <ArgonBox display="flex" alignItems="center">
      <ArgonTypography variant="caption" color="text" fontWeight="medium">
        {value}%&nbsp;
      </ArgonTypography>
      <ArgonBox width="8rem">
        <ArgonProgress value={value} color={color} variant="gradient" label={false} />
      </ArgonBox>
    </ArgonBox>
  );
}

const action = (
  <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
    more_vert
  </Icon>
);

const categoryTableData = {
  columns: [
    { name: "categoryName", align: "left" },
    { name: "Description", align: "left" },
    { name: "Image", align: "left" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      categoryName: "hairstyling",
      Description: "hairstyling",
      Image: "", // Since image is empty
      action: (
        <td>
          <span
            onClick={() => handleUpdate()}
            style={{ cursor: "pointer", color: "green", }}
          >
            <i className="fas fa-edit"></i>
          </span>
          <span style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => handleDelete()}>
            <i className="fas fa-trash-alt"></i>
          </span>{" "}
        </td>
      ),
    },
  ],
};

export default categoryTableData;

