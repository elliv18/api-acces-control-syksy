import React from "react";
import Cookies from "js-cookie";
import Router from 'next/router'
import NotAuth from "../../pages/components/NotAuth";
import { NoSsr } from "@material-ui/core";
import Login from '../../pages/components/Login'
import disableSsr from "./disableSsr";

/*
export default function checkLogIn() {
  //return Cookies.get("jwtToken") !== undefined;
}*/

export default function CheckLogin(props) {
  if (Cookies.get('jwtToken') !== undefined) {
    return (
      props.children
    )
  }
  else {
    return (
      <NotAuth />
    )
  }
}

export function loginStatus() {
  if (Cookies.get('jwtToken') !== undefined) {
    return true
  }
  return false

}