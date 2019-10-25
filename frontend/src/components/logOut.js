import React from "react";
import Cookies from "js-cookie";
import Router from 'next/router'

export default function checkLogIn() {
    Cookies.remove("jwtToken");
    Router.push('/')
}