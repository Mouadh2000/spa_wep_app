/* eslint-disable react/prop-types */
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Author({ image, name, email }) {
  return (
    <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
      <ArgonBox mr={2}>
        <ArgonAvatar src={image} alt={name} size="sm" variant="rounded" />
      </ArgonBox>
      <ArgonBox display="flex" flexDirection="column">
        <ArgonTypography variant="button" fontWeight="medium">
          {name}
        </ArgonTypography>
        <ArgonTypography variant="caption" color="secondary">
          {email}
        </ArgonTypography>
      </ArgonBox>
    </ArgonBox>
  );
}

function Function({ job, org }) {
  return (
    <ArgonBox display="flex" flexDirection="column">
      <ArgonTypography variant="caption" fontWeight="medium" color="text">
        {job}
      </ArgonTypography>
      <ArgonTypography variant="caption" color="secondary">
        {org}
      </ArgonTypography>
    </ArgonBox>
  );
}

const serviceTableData = {
  columns: [
    { name: "Service Name", align: "left" },
    { name: "Description", align: "left" },
    { name: "Price", align: "center" },
    { name: "Assigned Staff", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      "Service Name": "Woman haircut",
      Description: "Woman haircut",
      Price: "120 DT",
      "Assigned Staff": "ahlem ahlem",
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
    }
  ],
};

export default serviceTableData;
