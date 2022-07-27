import React, { useState } from "react";
import "./RightSide.css";

import NavIcons from "../NavIcons/NavIcons";
import FromUsersCard from "../FromUsersCard/FromUsersCard";
const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="RightSide">
      {/* Side Navbar */}

      <NavIcons />
			<FromUsersCard />
      {/* TODO Chat contacts */}
    </div>
  );
};

export default RightSide;
