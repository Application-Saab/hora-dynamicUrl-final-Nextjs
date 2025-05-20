import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM, API_SUCCESS_CODE } from '../../../../utils/apiconstants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"
import logo from '../../../../assets/new_logo_light.png';
import { CardSkeleton } from "../../../../components/CardSkeleton";
import { getDecorationCatOrganizationSchema } from "../../../../utils/schema";
import '../../../../css/decoration.css';
import { setState } from '../../../../actions/action';
import { useDispatch } from 'react-redux';
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import DecorationCatDetails from "./product/[productName]";

const DecorationCityYoutubeCatPage = () => {
return (<DecorationCatDetails/>)
}
export default DecorationCityYoutubeCatPage;