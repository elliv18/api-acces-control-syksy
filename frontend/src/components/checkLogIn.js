import React from "react";
import Cookies from "js-cookie";

export default function checkLogIn() {
  return Cookies.get("jwtToken") !== undefined;
}
