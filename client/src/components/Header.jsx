import React from "react";
import HighlightIcon from '@mui/icons-material/Highlight';

function Header(){
  const appName = "Keeper"

  return(
    <header>
      <h1>
      <HighlightIcon />
      {appName}
      </h1>
    </header>
  );
}

export default Header;
