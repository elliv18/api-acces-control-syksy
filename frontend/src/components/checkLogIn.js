import React from "react";
import Cookies from "js-cookie";
import Router from 'next/router'
import NotAuth from "../../pages/components/NotAuth";
import { NoSsr } from "@material-ui/core";

/*
export default function checkLogIn() {
  //return Cookies.get("jwtToken") !== undefined;
}*/

export default function CheckLogin(props) {
  if (Cookies.get('jwtToken') !== undefined) {
    return (
      <NoSsr>
        {props.children}
      </NoSsr>
    )
  }
  else return <NotAuth />

}
